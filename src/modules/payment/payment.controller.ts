import { Request, Response } from 'express';
import { PaymentCrud } from './payment.crud';
import { AuthRequest } from '../core-auth/auth.types';
import { PaymentStatus } from './payment.types';
import { RateCrud } from '../rate/rate.crud';
import { StellarPaymentService } from '../../shared/utils/payment.utils';

const handleError = (error: unknown, res: Response): void => {
    console.error('Payment operation error:', error);
    
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

export class PaymentController {
    // Create new payment
    createPayment = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const { rateId, sourceAmount, customerEmail } = req.body;

            // Verify rate exists and is active
            const rate = await RateCrud.getRateById(rateId);
            if (!rate || rate.merchantId.toString() !== req.user.userId) {
                res.status(404).json({
                    success: false,
                    error: 'Rate not found or inactive'
                });
                return;
            }

            // Generate Stellar payment details
            const paymentDetails = await StellarPaymentService.generatePaymentDetails();

            // Create payment with Stellar details
            const payment = await PaymentCrud.createPayment({
                merchantId: req.user.userId,
                rateId,
                sourceAmount,
                sourceAsset: rate.baseCurrency,
                destinationAmount: (parseFloat(sourceAmount) * rate.rate).toFixed(7),
                destinationAsset: rate.quoteCurrency,
                exchangeRate: rate.rate,
                customerEmail,
                stellarPaymentAddress: paymentDetails.paymentAddress,
                stellarMemo: paymentDetails.memo,
                merchantWalletAddress: req.user.walletAddress
            });

            // Start monitoring for payment
            StellarPaymentService.monitorPayment(payment);

            res.json({
                success: true,
                data: { 
                    payment,
                    paymentInstructions: {
                        address: paymentDetails.paymentAddress,
                        memo: paymentDetails.memo,
                        amount: sourceAmount,
                        asset: rate.baseCurrency
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Get merchant's payments
    getMerchantPayments = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const status = req.query.status as PaymentStatus | undefined;
            const limit = parseInt(req.query.limit as string || '10');
            const offset = parseInt(req.query.offset as string || '0');

            const result = await PaymentCrud.getMerchantPayments(
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

    // Get payment by ID
    getPaymentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentId } = req.params;
            const payment = await PaymentCrud.getPaymentById(paymentId);

            if (!payment) {
                res.status(404).json({
                    success: false,
                    error: 'Payment not found'
                });
                return;
            }

            res.json({
                success: true,
                data: { payment }
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Process payment
    processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Not authenticated'
                });
                return;
            }

            const { paymentId } = req.params;
            const payment = await PaymentCrud.getPaymentById(paymentId);

            if (!payment) {
                res.status(404).json({
                    success: false,
                    error: 'Payment not found'
                });
                return;
            }

            // Verify merchant owns this payment
            if (payment.merchantId.toString() !== req.user.userId) {
                res.status(403).json({
                    success: false,
                    error: 'Unauthorized to process this payment'
                });
                return;
            }

            // Start monitoring for payment if not already processing
            if (payment.status === PaymentStatus.PENDING) {
                await PaymentCrud.updatePaymentStatus(paymentId, PaymentStatus.PROCESSING);
                StellarPaymentService.monitorPayment(payment);
            }

            res.json({
                success: true,
                data: {
                    payment,
                    paymentInstructions: {
                        address: payment.stellarPaymentAddress,
                        memo: payment.stellarMemo,
                        amount: payment.sourceAmount,
                        asset: payment.sourceAsset
                    }
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    };

    // Get payment status
    getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentId } = req.params;
            const payment = await PaymentCrud.getPaymentById(paymentId);

            if (!payment) {
                res.status(404).json({
                    success: false,
                    error: 'Payment not found'
                });
                return;
            }

            res.json({
                success: true,
                data: {
                    status: payment.status,
                    stellarTransactionId: payment.stellarTransactionId,
                    updatedAt: payment.updatedAt
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    };
} 