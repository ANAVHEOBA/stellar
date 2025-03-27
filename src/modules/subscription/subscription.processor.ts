import { SubscriptionService } from './subscription.service';
import { SubscriptionCrud } from './subscription.crud';
import { WebhookService } from './webhook.service';
import { logger } from '../../shared/utils/logger.utils';
import { ISubscription } from './subscription.types';
import { PaymentCrud } from '../payment/payment.crud';

interface PaymentResult {
    success: boolean;
    paymentId?: string;
    error?: string;
}

export class SubscriptionProcessor {
    private static readonly BATCH_SIZE = 50;
    private static isProcessing = false;

    static async processSubscriptions(): Promise<void> {
        if (this.isProcessing) {
            logger.warn('Subscription processing already in progress');
            return;
        }

        try {
            this.isProcessing = true;
            logger.info('Starting subscription processing');

            // Get due subscriptions in batches
            let processed = 0;
            let hasMore = true;

            while (hasMore) {
                const dueSubscriptions = await SubscriptionCrud.getDueSubscriptions();

                if (dueSubscriptions.length === 0) {
                    hasMore = false;
                    continue;
                }

                // Process subscriptions in parallel with concurrency limit
                await Promise.all(
                    dueSubscriptions.map(subscription =>
                        this.processSingleSubscription(subscription)
                    )
                );

                processed += dueSubscriptions.length;
                logger.info(`Processed ${processed} subscriptions`);

                // If we got less than batch size, we're done
                if (dueSubscriptions.length < this.BATCH_SIZE) {
                    hasMore = false;
                }
            }

            logger.info(`Completed processing ${processed} subscriptions`);
        } catch (error) {
            logger.error('Error in subscription processing:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    private static async processSingleSubscription(subscription: ISubscription): Promise<void> {
        try {
            logger.info(`Processing subscription ${subscription._id}`);
            
            // Process payment
            const success = await SubscriptionService.processSubscriptionPayment(subscription);
            
            // Find the most recent payment for this subscription
            const latestPayment = await PaymentCrud.getLatestSubscriptionPayment(
                subscription._id.toString()
            );

            const result: PaymentResult = success 
                ? { 
                    success: true, 
                    paymentId: latestPayment?._id.toString() 
                } 
                : { success: false, error: 'Payment processing failed' };
            
            if (result.success) {
                logger.info(`Successfully processed subscription ${subscription._id}`);
                await WebhookService.notifyPaymentSuccess(
                    subscription, 
                    result.paymentId || '' // Provide a default empty string if no paymentId
                );
            } else {
                logger.warn(`Failed to process subscription ${subscription._id}`);
                await WebhookService.notifyPaymentFailed(
                    subscription,
                    result.error || 'Unknown error'
                );
            }
        } catch (error) {
            logger.error(`Error processing subscription ${subscription._id}:`, error);
            await WebhookService.notifyPaymentFailed(
                subscription,
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }
} 