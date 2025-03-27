import express, { Request, Response, NextFunction } from 'express';
import { RateController } from './rate.controller';
import { authMiddleware, requireMerchant } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { body, param } from 'express-validator';
import { Currency } from './rate.types';
import { Types } from 'mongoose';

const router = express.Router();
const rateController = new RateController();

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation middleware
const createRateValidation = [
    body('baseCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid base currency'),
    body('quoteCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid quote currency'),
    body('rate')
        .isFloat({ min: 0 })
        .withMessage('Rate must be a positive number'),
    body('validityPeriod')
        .isInt({ min: 1, max: 90 })
        .withMessage('Validity period must be between 1 and 90 days')
];

const currencyPairValidation = [
    param('baseCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid base currency'),
    param('quoteCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid quote currency')
];

// Update the validation for check-viability route
const checkViabilityValidation = [
    param('merchantId')
        .custom((value) => {
            if (!Types.ObjectId.isValid(value)) {
                throw new Error('Invalid merchant ID format');
            }
            return true;
        }),
    body('baseCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid base currency'),
    body('quoteCurrency')
        .isIn(['USD', 'EUR', 'GBP', 'JPY', 'XLM'] as Currency[])
        .withMessage('Invalid quote currency'),
    body('amount')
        .isString()
        .matches(/^\d*\.?\d+$/)
        .withMessage('Amount must be a valid number string')
];

// Routes

// Create new rate (merchant only)
router.post(
    '/',
    authMiddleware,
    requireMerchant,
    createRateValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await rateController.createRate(req, res);
    })
);

// Get merchant's active rates
router.get(
    '/merchant',
    authMiddleware,
    requireMerchant,
    asyncHandler(async (req, res) => {
        await rateController.getMerchantRates(req, res);
    })
);

// Get rate by currency pair (public)
router.get(
    '/:merchantId/:baseCurrency/:quoteCurrency',
    currencyPairValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await rateController.getRateByCurrencyPair(req, res);
    })
);

// Delete rate (merchant only)
router.delete(
    '/:rateId',
    authMiddleware,
    requireMerchant,
    asyncHandler(async (req, res) => {
        await rateController.deleteRate(req, res);
    })
);

// Update the route
router.post(
    '/check-viability/:merchantId',
    authMiddleware,
    checkViabilityValidation,
    validateRequest,
    asyncHandler(async (req, res) => {
        await rateController.checkRateViability(req, res);
    })
);

export default router; 