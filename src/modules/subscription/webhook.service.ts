import axios from 'axios';
import { ISubscription } from './subscription.types';
import { WebhookEventType, WebhookPayload } from './webhook.types';
import { logger } from '../../shared/utils/logger.utils';
import { MerchantCrud } from '../merchant/merchant.crud';

export class WebhookService {
    private static async sendWebhook(
        merchantId: string, 
        payload: WebhookPayload
    ): Promise<boolean> {
        try {
            // Get merchant webhook details
            const webhookDetails = await MerchantCrud.getMerchantWebhookDetails(merchantId);
            
            if (!webhookDetails?.webhookUrl) {
                logger.warn(`No webhook URL configured for merchant ${merchantId}`);
                return false;
            }

            const response = await axios.post(webhookDetails.webhookUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Signature': webhookDetails.webhookSecret || '',
                },
                timeout: 5000
            });

            if (response.status === 200) {
                logger.info(`Webhook sent successfully to merchant ${merchantId}`);
                return true;
            }

            logger.warn(`Webhook failed for merchant ${merchantId}: ${response.status}`);
            return false;
        } catch (error) {
            logger.error(`Error sending webhook to merchant ${merchantId}:`, error);
            return false;
        }
    }

    static async notifySubscriptionCreated(subscription: ISubscription): Promise<boolean> {
        const payload: WebhookPayload = {
            eventType: WebhookEventType.SUBSCRIPTION_CREATED,
            subscriptionId: subscription._id.toString(),
            merchantId: subscription.merchantId.toString(),
            customerId: subscription.customerId,
            status: subscription.status,
            timestamp: new Date(),
            data: {
                amount: subscription.amount,
                sourceAsset: subscription.sourceAsset,
                destinationAsset: subscription.destinationAsset
            }
        };

        return this.sendWebhook(subscription.merchantId.toString(), payload);
    }

    static async notifyPaymentSuccess(
        subscription: ISubscription, 
        paymentId: string
    ): Promise<boolean> {
        const payload: WebhookPayload = {
            eventType: WebhookEventType.SUBSCRIPTION_PAYMENT_SUCCESS,
            subscriptionId: subscription._id.toString(),
            merchantId: subscription.merchantId.toString(),
            customerId: subscription.customerId,
            status: subscription.status,
            timestamp: new Date(),
            data: {
                amount: subscription.amount,
                sourceAsset: subscription.sourceAsset,
                destinationAsset: subscription.destinationAsset,
                paymentId
            }
        };

        return this.sendWebhook(subscription.merchantId.toString(), payload);
    }

    static async notifyPaymentFailed(
        subscription: ISubscription, 
        error: string
    ): Promise<boolean> {
        const payload: WebhookPayload = {
            eventType: WebhookEventType.SUBSCRIPTION_PAYMENT_FAILED,
            subscriptionId: subscription._id.toString(),
            merchantId: subscription.merchantId.toString(),
            customerId: subscription.customerId,
            status: subscription.status,
            timestamp: new Date(),
            data: {
                amount: subscription.amount,
                sourceAsset: subscription.sourceAsset,
                destinationAsset: subscription.destinationAsset,
                failedAttempts: subscription.failedAttempts,
                error
            }
        };

        return this.sendWebhook(subscription.merchantId.toString(), payload);
    }
} 