import mongoose, { Schema } from 'mongoose';
import { IConsumer, IPaymentMethod, PaymentMethodType } from './consumer.types';

const consumerSchema = new Schema<IConsumer>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    merchantId: {
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const paymentMethodSchema = new Schema<IPaymentMethod>({
    consumerId: {
        type: Schema.Types.ObjectId,
        ref: 'Consumer',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(PaymentMethodType),
        required: true
    },
    identifier: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
});

export const Consumer = mongoose.model<IConsumer>('Consumer', consumerSchema);
export const PaymentMethod = mongoose.model<IPaymentMethod>('PaymentMethod', paymentMethodSchema); 