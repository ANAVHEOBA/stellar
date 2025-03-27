import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware, requireConsumer } from '../../shared/middleware/auth.middleware';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { body } from 'express-validator';

const router = express.Router();
const authController = new AuthController();

// Async handler wrapper to ensure Promise<void> return type
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Validation middleware
const challengeValidation = [
    body('walletAddress')
        .isString()
        .notEmpty()
        .withMessage('Wallet address is required')
];

const verifyValidation = [
    body('signedChallenge')
        .isString()
        .notEmpty()
        .withMessage('Signed challenge is required'),
    body('walletAddress')
        .isString()
        .notEmpty()
        .withMessage('Wallet address is required'),
    body('userType')
        .isIn(['merchant', 'consumer'])
        .withMessage('User type must be either merchant or consumer')
];

// Public routes
router.post(
    '/challenge', 
    challengeValidation, 
    validateRequest, 
    asyncHandler(async (req, res) => {
        await authController.getAuthChallenge(req, res);
    })
);

router.post(
    '/verify', 
    verifyValidation, 
    validateRequest, 
    asyncHandler(async (req, res) => {
        await authController.verifyAuth(req, res);
    })
);

// Protected routes
router.post(
    '/logout', 
    authMiddleware, 
    asyncHandler(async (req, res) => {
        await authController.logout(req, res);
    })
);

router.get(
    '/me', 
    authMiddleware, 
    asyncHandler(async (req, res) => {
        await authController.getCurrentUser(req, res);
    })
);

router.post(
    '/refresh-token', 
    authMiddleware, 
    asyncHandler(async (req, res) => {
        await authController.refreshToken(req, res);
    })
);

// Consumer-specific routes
router.get(
    '/check-token', 
    authMiddleware, 
    asyncHandler(async (req, res) => {
        res.json({ 
            success: true, 
            valid: true 
        });
    })
);

export default router;