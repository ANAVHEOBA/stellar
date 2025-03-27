import { SubscriptionStatus } from './subscription.types';
import { Types } from 'mongoose';

export enum WebhookEventType {
    SUBSCRIPTION_CREATED = 'subscription.created',
    SUBSCRIPTION_PAYMENT_SUCCESS = 'subscription.payment.success',
    SUBSCRIPTION_PAYMENT_FAILED = 'subscription.payment.failed',
    SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
    SUBSCRIPTION_EXPIRED = 'subscription.expired'
}

export interface WebhookPayload {
    eventType: WebhookEventType;
    subscriptionId: string;
    merchantId: string;
    customerId: string;
    status: SubscriptionStatus;
    timestamp: Date;
    data: {
        amount?: string;
        sourceAsset?: string;
        destinationAsset?: string;
        failedAttempts?: number;
        paymentId?: string;
        error?: string;
    };
} 