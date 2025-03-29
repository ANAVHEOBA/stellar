import express, { Request, Response, NextFunction } from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware, requireMerchant } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { body, query, param } from 'express-validator';
import { PaymentStatus } from './payment.types';
import { Types } from 'mongoose';

const router = express.Router();
const paymentController = new PaymentController();

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation middleware
const createPaymentValidation = [
    body('rateId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid rate ID'),
    body('sourceAmount')
        .isString()
        .matches(/^\d*\.?\d+$/)
        .withMessage('Source amount must be a valid number string'),
    body('customerEmail')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
];

const getPaymentsValidation = [
    query('status')
        .optional()
        .isIn(Object.values(PaymentStatus))
        .withMessage('Invalid payment status'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer')
];

const paymentIdValidation = [
    param('paymentId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid payment ID')
];

// Add new validation middleware
const processPaymentValidation = [
    param('paymentId')
        .isString()
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage('Invalid payment ID')
];

// Add validation middleware
const updateConsumerWalletValidation = [
    body('consumerWalletAddress')
        .isString()
        .notEmpty()
        .withMessage('Consumer wallet address is required')
];

const verifyPaymentValidation = [
    body('transactionId')
        .isString()
        .notEmpty()
        .withMessage('Transaction ID is required')
];

// Routes

// Create new payment (merchant only)
router.post(
    '/',
    authMiddleware,
    requireMerchant,
    createPaymentValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.createPayment(req, res);
    })
);

// Get merchant's payments with filters
router.get(
    '/merchant',
    authMiddleware,
    requireMerchant,
    getPaymentsValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.getMerchantPayments(req, res);
    })
);

// Get payment by ID
router.get(
    '/:paymentId',
    authMiddleware,
    paymentIdValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.getPaymentById(req, res);
    })
);

// Add new route for processing payment
router.post(
    '/:paymentId/process',
    authMiddleware,
    requireMerchant,
    processPaymentValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.processPayment(req, res);
    })
);

// Add route for checking payment status
router.get(
    '/:paymentId/status',
    authMiddleware,
    paymentIdValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.getPaymentStatus(req, res);
    })
);

// Public route to access payment by link
router.get(
    '/link/:paymentLink',
    asyncHandler(async (req, res) => {
        await paymentController.getPaymentByLink(req, res);
    })
);

// Add new routes
router.post(
    '/:paymentId/verify',
    verifyPaymentValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.verifyPayment(req, res);
    })
);

router.post(
    '/:paymentId/consumer-wallet',
    updateConsumerWalletValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.updateConsumerWallet(req, res);
    })
);

router.get(
    '/:paymentId/monitor',
    paymentIdValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await paymentController.monitorPayment(req, res);
    })
);

export default router; 