import mongoose, { Schema } from 'mongoose';
import { IRate, Currency, RateStatus } from './rate.types';
import { validateStellarRate } from '../../shared/utils/stellar.utils';

const rateSchema = new Schema<IRate>(
    {
        merchantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        baseCurrency: {
            type: String,
            required: true,
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'XLM']
        },
        quoteCurrency: {
            type: String,
            required: true,
            enum: ['USD', 'EUR', 'GBP', 'JPY', 'XLM']
        },
        rate: {
            type: Number,
            required: true
        },
        validFrom: {
            type: Date,
            required: true
        },
        validTo: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'pending'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

// Indexes for better query performance
rateSchema.index({ merchantId: 1, status: 1 });
rateSchema.index({ validTo: 1 }, { expireAfterSeconds: 0 });

// Validate that base and quote currencies are different
rateSchema.pre('save', function(next) {
    if (this.baseCurrency === this.quoteCurrency) {
        next(new Error('Base and quote currencies must be different'));
    }
    next();
});

// Method to check if rate is expired
rateSchema.methods.isExpired = function(): boolean {
    return this.validTo < new Date();
};

// Method to activate rate
rateSchema.methods.activate = async function(): Promise<void> {
    this.status = 'active';
    await this.save();
};

// Add this method to the schema
rateSchema.methods.validateAgainstStellar = async function(): Promise<boolean> {
    return await validateStellarRate(
        this.baseCurrency,
        this.quoteCurrency,
        this.rate
    );
};

export const Rate = mongoose.model<IRate>('Rate', rateSchema); 