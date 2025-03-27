import { Types } from 'mongoose';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    CANCELLED = 'cancelled',
    FAILED = 'failed'
}

export enum BillingPeriod {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly'
}

export interface ISubscription {
    _id: Types.ObjectId;
    merchantId: Types.ObjectId;
    rateId: Types.ObjectId;
    customerId: string;
    amount: string;
    sourceAsset: string;
    destinationAsset: string;
    billingPeriod: BillingPeriod;
    nextBillingDate: Date;
    status: SubscriptionStatus;
    lastPaymentId?: Types.ObjectId;
    failedAttempts: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateSubscription {
    merchantId: string;
    rateId: string;
    customerId: string;
    amount: string;
    sourceAsset: string;
    destinationAsset: string;
    billingPeriod: BillingPeriod;
} 