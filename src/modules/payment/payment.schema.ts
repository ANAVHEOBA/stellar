import mongoose, { Schema } from 'mongoose';
import { IPayment, PaymentStatus, PaymentType } from './payment.types';

const paymentSchema = new Schema<IPayment>({
    merchantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Merchant'
    },
    rateId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Rate'
    },
    type: {
        type: String,
        enum: Object.values(PaymentType),
        required: true,
        default: PaymentType.CRYPTO
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        required: true,
        default: PaymentStatus.PENDING
    },
    sourceAmount: {
        type: String,
        required: true
    },
    sourceAsset: {
        type: String,
        required: true
    },
    destinationAmount: {
        type: String,
        required: true
    },
    destinationAsset: {
        type: String,
        required: true
    },
    exchangeRate: {
        type: Number,
        required: true
    },
    customerEmail: {
        type: String,
        required: false
    },
    stellarTransactionId: {
        type: String,
        required: false
    },
    expiresAt: {
        type: Date,
        required: true
    },
    stellarPaymentAddress: {
        type: String,
        required: false
    },
    stellarMemo: {
        type: String,
        required: false
    },
    merchantWalletAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Indexes
paymentSchema.index({ merchantId: 1, status: 1 });
paymentSchema.index({ status: 1, expiresAt: 1 });
paymentSchema.index({ stellarTransactionId: 1 }, { sparse: true });

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema); 