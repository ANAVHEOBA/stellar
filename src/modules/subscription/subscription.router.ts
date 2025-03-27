import express, { Request, Response, NextFunction } from 'express';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionProcessor } from './subscription.processor';
import { SubscriptionCrud } from './subscription.crud';
import { authMiddleware, requireMerchant } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { body, query, param } from 'express-validator';
import { SubscriptionStatus, BillingPeriod } from './subscription.types';
import { Types } from 'mongoose';
import { logger } from '../../shared/utils/logger.utils';

const router = express.Router();
const subscriptionController = new SubscriptionController();

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation middleware
const createSubscriptionValidation = [
    body('rateId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid rate ID'),
    body('customerId')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Customer ID is required'),
    body('amount')
        .isString()
        .matches(/^\d*\.?\d+$/)
        .withMessage('Amount must be a valid number string'),
    body('sourceAsset')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Source asset is required'),
    body('destinationAsset')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Destination asset is required'),
    body('billingPeriod')
        .isIn(Object.values(BillingPeriod))
        .withMessage('Invalid billing period')
];

const getSubscriptionsValidation = [
    query('status')
        .optional()
        .isIn(Object.values(SubscriptionStatus))
        .withMessage('Invalid subscription status'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer')
];

const subscriptionIdValidation = [
    param('subscriptionId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid subscription ID')
];

const updateStatusValidation = [
    param('subscriptionId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid subscription ID'),
    body('status')
        .isIn(Object.values(SubscriptionStatus))
        .withMessage('Invalid subscription status')
];

// Routes

// Create new subscription (merchant only)
router.post(
    '/',
    authMiddleware,
    requireMerchant,
    createSubscriptionValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await subscriptionController.createSubscription(req, res);
    })
);

// New endpoint to manually trigger subscription processing
router.post(
    '/process',
    authMiddleware,
    requireMerchant,
    asyncHandler(async (req, res) => {
        try {
            logger.info('Manually triggering subscription processing');
            await SubscriptionProcessor.processSubscriptions();
            res.json({
                success: true,
                message: 'Subscription processing initiated'
            });
        } catch (error) {
            logger.error('Error in manual subscription processing:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process subscriptions'
            });
        }
    })
);

// Get merchant's subscriptions with filters
router.get(
    '/merchant',
    authMiddleware,
    requireMerchant,
    getSubscriptionsValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await subscriptionController.getMerchantSubscriptions(req, res);
    })
);

// New endpoint to get upcoming/due subscriptions
router.get(
    '/due',
    authMiddleware,
    requireMerchant,
    asyncHandler(async (req, res) => {
        try {
            const dueSubscriptions = await SubscriptionCrud.getDueSubscriptions();
            res.json({
                success: true,
                data: {
                    subscriptions: dueSubscriptions,
                    total: dueSubscriptions.length
                }
            });
        } catch (error) {
            logger.error('Error fetching due subscriptions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch due subscriptions'
            });
        }
    })
);

// Bulk status update endpoint
router.patch(
    '/bulk-status',
    authMiddleware,
    requireMerchant,
    [
        body('subscriptionIds').isArray().withMessage('Subscription IDs must be an array'),
        body('subscriptionIds.*')
            .isString()
            .custom((value) => Types.ObjectId.isValid(value))
            .withMessage('Invalid subscription ID'),
        body('status')
            .isIn(Object.values(SubscriptionStatus))
            .withMessage('Invalid subscription status')
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        try {
            const { subscriptionIds, status } = req.body;
            const updatedSubscriptions = await Promise.all(
                subscriptionIds.map((id: string) => 
                    SubscriptionCrud.updateSubscriptionStatus(id, status)
                )
            );

            res.json({
                success: true,
                data: {
                    updatedSubscriptions,
                    total: updatedSubscriptions.length
                }
            });
        } catch (error) {
            logger.error('Error in bulk subscription status update:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update subscription statuses'
            });
        }
    })
);

// Get subscription by ID - MOVED AFTER OTHER ROUTES WITH SPECIFIC PATHS
router.get(
    '/:subscriptionId',
    authMiddleware,
    subscriptionIdValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await subscriptionController.getSubscriptionById(req, res);
    })
);

// Update subscription status
router.patch(
    '/:subscriptionId/status',
    authMiddleware,
    requireMerchant,
    updateStatusValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await subscriptionController.updateSubscriptionStatus(req, res);
    })
);

export default router; 