import express, { Request, Response, NextFunction } from 'express';
import { ConsumerController } from './consumer.controller';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { body, param } from 'express-validator';

const router = express.Router();
const consumerController = new ConsumerController();

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation middleware
const createConsumerValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('merchantId').isString().withMessage('Merchant ID is required')
];

const updateConsumerValidation = [
    body('firstName').optional().isString(),
    body('lastName').optional().isString(),
    body('phoneNumber').optional().isString()
];

const addPaymentMethodValidation = [
    body('type').isString().isIn(['stellar_wallet', 'bank_account', 'credit_card']).withMessage('Valid payment method type is required'),
    body('identifier').isString().withMessage('Identifier is required'),
    body('isDefault').optional().isBoolean()
];

// Routes
router.post(
    '/',
    createConsumerValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await consumerController.createConsumer(req, res);
    })
);

router.get(
    '/:consumerId',
    param('consumerId').isString().withMessage('Valid consumer ID is required'),
    validateRequest,
    asyncHandler(async (req, res) => {
        await consumerController.getConsumerById(req, res);
    })
);

router.patch(
    '/:consumerId',
    updateConsumerValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await consumerController.updateConsumer(req, res);
    })
);

router.post(
    '/:consumerId/payment-methods',
    addPaymentMethodValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await consumerController.addPaymentMethod(req, res);
    })
);

router.get(
    '/:consumerId/payment-methods',
    asyncHandler(async (req, res) => {
        await consumerController.getPaymentMethods(req, res);
    })
);

export default router; 