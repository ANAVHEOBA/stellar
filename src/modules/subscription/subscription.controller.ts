import { Request, Response } from 'express';
import { AuthRequest } from '../core-auth/auth.types';
import { SubscriptionCrud } from './subscription.crud';
import { SubscriptionStatus } from './subscription.types';
import { RateCrud } from '../rate/rate.crud';
import { PaymentCrud } from '../payment/payment.crud';

const handleError = (error: unknown, res: Response): void => {
    console.error('Subscription operation error:', error);
    
    if (error instanceof Error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    } else {
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred'
        });
    }
};

export class SubscriptionController {
    // Create new subscription
    createSubscription = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const { 
                rateId, 
                customerId, 
                amount, 
                sourceAsset,
                destinationAsset,
                billingPeriod 
            } = req.body;

            // Verify rate exists and is active
            const rate = await RateCrud.getRateById(rateId);
            if (!rate || rate.merchantId.toString() !== req.user.userId) {
                res.status(404).json({
                    success: false,
                    error: 'Rate not found or inactive'
                });
                return;
            }

            // Create subscription
            const subscription = await SubscriptionCrud.createSubscription({
                merchantId: req.user.userId,
                rateId,
                customerId,
                amount,
                sourceAsset,
                destinationAsset,
                billingPeriod
            });

            res.json({
                success: true,
                data: { subscription }
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Get merchant's subscriptions
    getMerchantSubscriptions = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const status = req.query.status as SubscriptionStatus | undefined;
            const limit = parseInt(req.query.limit as string || '10');
            const offset = parseInt(req.query.offset as string || '0');

            const result = await SubscriptionCrud.getMerchantSubscriptions(
                req.user.userId,
                status,
                limit,
                offset
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Get subscription by ID
    getSubscriptionById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { subscriptionId } = req.params;
            const subscription = await SubscriptionCrud.getSubscriptionById(subscriptionId);

            if (!subscription) {
                res.status(404).json({
                    success: false,
                    error: 'Subscription not found'
                });
                return;
            }

            res.json({
                success: true,
                data: { subscription }
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Update subscription status
    updateSubscriptionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const { subscriptionId } = req.params;
            const { status } = req.body;

            const subscription = await SubscriptionCrud.getSubscriptionById(subscriptionId);

            if (!subscription) {
                res.status(404).json({
                    success: false,
                    error: 'Subscription not found'
                });
                return;
            }

            // Verify merchant owns this subscription
            if (subscription.merchantId.toString() !== req.user.userId) {
                res.status(403).json({
                    success: false,
                    error: 'Unauthorized to update this subscription'
                });
                return;
            }

            const updatedSubscription = await SubscriptionCrud.updateSubscriptionStatus(
                subscriptionId,
                status
            );

            res.json({
                success: true,
                data: { subscription: updatedSubscription }
            });
        } catch (error) {
            handleError(error, res);
        }
    };
} 