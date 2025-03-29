import { Request, Response } from 'express';
import { PaymentCrud } from './payment.crud';
import { AuthRequest } from '../core-auth/auth.types';
import { PaymentStatus, PaymentType } from './payment.types';
import { RateCrud } from '../rate/rate.crud';
import { StellarPaymentService } from '../../shared/utils/payment.utils';
import crypto from 'crypto';
import { config } from '../../config/config';
import { sendPaymentRequestEmail } from '../../shared/utils/email.utils';

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
            
            // Generate unique payment link
            const paymentLink = crypto.randomBytes(32).toString('hex');
            
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
            
            const paymentData = {
                merchantId: req.user.userId,
                rateId,
                sourceAmount,
                sourceAsset: rate.baseCurrency,
                destinationAmount: (parseFloat(sourceAmount) * rate.rate).toFixed(7),
                destinationAsset: rate.quoteCurrency,
                exchangeRate: rate.rate,
                consumerEmail: customerEmail,  // Map customerEmail to consumerEmail
                paymentLink,    // Include the generated payment link
                stellarPaymentAddress: paymentDetails.paymentAddress,
                stellarMemo: paymentDetails.memo,
                merchantWalletAddress: req.user.walletAddress,
                type: PaymentType.CRYPTO,
                status: PaymentStatus.PENDING
            };

            const payment = await PaymentCrud.createPayment(paymentData);

            // Send email to consumer with payment link
            try {
                await sendPaymentRequestEmail(customerEmail, paymentLink);
                console.log('Payment request email sent successfully');
            } catch (emailError) {
                console.error('Email sending failed but payment was created:', emailError);
                // Continue with the response even if email fails
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

    // Add new endpoint to handle payment link access
    getPaymentByLink = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentLink } = req.params;
            const payment = await PaymentCrud.getPaymentByLink(paymentLink);

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

    verifyPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentId } = req.params;
            const { transactionId } = req.body;

            const payment = await PaymentCrud.verifyPayment(paymentId, transactionId);

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

    updateConsumerWallet = async (req: Request, res: Response): Promise<void> => {
        try {
            const { paymentId } = req.params;
            const { consumerWalletAddress } = req.body;

            const payment = await PaymentCrud.updateConsumerWallet(
                paymentId,
                consumerWalletAddress
            );

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

    monitorPayment = async (req: Request, res: Response): Promise<void> => {
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
                    expiresAt: payment.expiresAt,
                    updatedAt: payment.updatedAt
                }
            });
        } catch (error) {
            handleError(error, res);
        }
    };
} 