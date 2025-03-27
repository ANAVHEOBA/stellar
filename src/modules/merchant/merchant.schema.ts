import mongoose, { Schema } from 'mongoose';
import { IMerchant } from './merchant.types';

const merchantSchema = new Schema<IMerchant>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    businessName: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    webhookUrl: {
        type: String,
        required: false
    },
    webhookSecret: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

export const Merchant = mongoose.model<IMerchant>('Merchant', merchantSchema); 