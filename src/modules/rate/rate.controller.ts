import { Request, Response } from 'express';
import { RateCrud } from './rate.crud';
import { ICreateRate } from './rate.types';
import { validateStellarRate } from '../../shared/utils/stellar.utils';
import { AuthRequest } from '../core-auth/auth.types';
import { checkPathPaymentViability } from '../../shared/utils/stellar.utils';
import { Types } from 'mongoose';

const handleError = (error: unknown, res: Response): void => {
    console.error('Operation error:', error);
    
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

export class RateController {
    // Create new rate
    createRate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const rateData: ICreateRate = {
                merchantId: req.user.userId,
                ...req.body
            };

            // Validate rate against Stellar DEX
            const isValidRate = await validateStellarRate(
                rateData.baseCurrency,
                rateData.quoteCurrency,
                rateData.rate
            );

            if (!isValidRate) {
                res.status(400).json({
                    success: false,
                    error: 'Rate is too far from market rate'
                });
                return;
            }

            const rate = await RateCrud.createRate(rateData);
            
            // Activate the rate immediately if validation passed
            await RateCrud.updateRateStatus(rate.id, 'active');

            res.json({
                success: true,
                data: { rate }
            });
        } catch (error) {
            console.error('Create rate error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create rate'
            });
        }
    };

    // Get merchant's active rates
    getMerchantRates = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const rates = await RateCrud.getMerchantActiveRates(req.user.userId);
            res.json({
                success: true,
                data: { rates }
            });
        } catch (error) {
            console.error('Get rates error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get rates'
            });
        }
    };

    // Get specific rate by currency pair
    getRateByCurrencyPair = async (req: Request, res: Response): Promise<void> => {
        try {
            const { merchantId, baseCurrency, quoteCurrency } = req.params;
            console.log('Looking for rate:', { merchantId, baseCurrency, quoteCurrency }); // Debug log

            const rate = await RateCrud.getMerchantRateByCurrencyPair(
                merchantId,
                baseCurrency.toUpperCase(), // Ensure uppercase
                quoteCurrency.toUpperCase() // Ensure uppercase
            );

            if (!rate) {
                res.status(404).json({
                    success: false,
                    error: 'Rate not found'
                });
                return;
            }

            res.json({
                success: true,
                data: { rate }
            });
        } catch (error) {
            console.error('Get rate error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get rate'
            });
        }
    };

    // Delete rate
    deleteRate = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const { rateId } = req.params;

            // Verify rate belongs to merchant
            const rate = await RateCrud.getRateById(rateId);
            if (!rate || rate.merchantId.toString() !== req.user.userId) {
                res.status(404).json({
                    success: false,
                    error: 'Rate not found'
                });
                return;
            }

            await RateCrud.deleteRate(rateId);
            res.json({
                success: true,
                message: 'Rate deleted successfully'
            });
        } catch (error) {
            console.error('Delete rate error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete rate'
            });
        }
    };

    // Check rate viability
    checkRateViability = async (req: Request, res: Response): Promise<void> => {
        try {
            const { merchantId } = req.params;
            const { baseCurrency, quoteCurrency, amount } = req.body;

            // Validate merchantId format
            if (!Types.ObjectId.isValid(merchantId)) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid merchant ID format'
                });
                return;
            }
            
            const rate = await RateCrud.getMerchantRateByCurrencyPair(
                merchantId,
                baseCurrency.toUpperCase(),
                quoteCurrency.toUpperCase()
            );

            if (!rate) {
                res.status(404).json({
                    success: false,
                    error: 'Rate not found for this currency pair'
                });
                return;
            }

            const viabilityResult = await checkPathPaymentViability(
                baseCurrency,
                quoteCurrency,
                amount,
                rate.rate
            );

            res.json({
                success: true,
                data: {
                    isViable: viabilityResult.isViable,
                    rate: rate.rate,
                    expectedDestinationAmount: (parseFloat(amount) * rate.rate).toFixed(7),
                    viabilityDetails: viabilityResult.details
                }
            });
        } catch (error: unknown) {
            handleError(error, res);
        }
    };
} 