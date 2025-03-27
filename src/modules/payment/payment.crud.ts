import { Payment } from './payment.schema';
import { IPayment, ICreatePayment, PaymentStatus } from './payment.types';
import { Types } from 'mongoose';

export class PaymentCrud {
    // Create a new payment
    static async createPayment(data: ICreatePayment): Promise<IPayment> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Payment expires in 30 minutes

        const payment = new Payment({
            merchantId: new Types.ObjectId(data.merchantId),
            rateId: new Types.ObjectId(data.rateId),
            sourceAmount: data.sourceAmount,
            sourceAsset: data.sourceAsset,
            destinationAmount: data.destinationAmount,
            destinationAsset: data.destinationAsset,
            exchangeRate: data.exchangeRate,
            customerEmail: data.customerEmail,
            expiresAt
        });

        return await payment.save();
    }

    // Get payment by ID
    static async getPaymentById(paymentId: string): Promise<IPayment | null> {
        return await Payment.findById(paymentId);
    }

    // Get merchant's payments with optional filters
    static async getMerchantPayments(
        merchantId: string,
        status?: PaymentStatus,
        limit = 10,
        offset = 0
    ): Promise<{ payments: IPayment[]; total: number }> {
        const query = {
            merchantId: new Types.ObjectId(merchantId),
            ...(status && { status })
        };

        const [payments, total] = await Promise.all([
            Payment.find(query)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
            Payment.countDocuments(query)
        ]);

        return { payments, total };
    }

    // Update payment status
    static async updatePaymentStatus(
        paymentId: string,
        status: PaymentStatus,
        stellarTransactionId?: string
    ): Promise<IPayment | null> {
        const update: { status: PaymentStatus; stellarTransactionId?: string } = { status };
        if (stellarTransactionId) {
            update.stellarTransactionId = stellarTransactionId;
        }

        return await Payment.findByIdAndUpdate(
            paymentId,
            update,
            { new: true }
        );
    }

    // Expire pending payments
    static async expirePendingPayments(): Promise<void> {
        const now = new Date();
        await Payment.updateMany(
            {
                status: PaymentStatus.PENDING,
                expiresAt: { $lt: now }
            },
            {
                status: PaymentStatus.EXPIRED
            }
        );
    }

    // Get payment by Stellar transaction ID
    static async getPaymentByTransactionId(transactionId: string): Promise<IPayment | null> {
        return await Payment.findOne({ stellarTransactionId: transactionId });
    }

    // Get the latest payment for a specific subscription
    static async getLatestSubscriptionPayment(subscriptionId: string) {
        return await Payment.findOne(
            { subscriptionId: new Types.ObjectId(subscriptionId) },
            null,
            { sort: { createdAt: -1 } }
        );
    }
} 