import mongoose, { Schema } from 'mongoose';
import { ISubscription, SubscriptionStatus, BillingPeriod } from './subscription.types';

const subscriptionSchema = new Schema<ISubscription>({
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
    customerId: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    sourceAsset: {
        type: String,
        required: true
    },
    destinationAsset: {
        type: String,
        required: true
    },
    billingPeriod: {
        type: String,
        enum: Object.values(BillingPeriod),
        required: true
    },
    nextBillingDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.ACTIVE,
        required: true
    },
    lastPaymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        required: false
    },
    failedAttempts: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: true
});

// Indexes
subscriptionSchema.index({ merchantId: 1, status: 1 });
subscriptionSchema.index({ nextBillingDate: 1, status: 1 });
subscriptionSchema.index({ customerId: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema); 