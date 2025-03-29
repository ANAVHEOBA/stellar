import { SubscriptionCrud } from './subscription.crud';
import { PaymentCrud } from '../payment/payment.crud';
import { RateCrud } from '../rate/rate.crud';
import { MerchantCrud } from '../merchant/merchant.crud';
import { StellarPaymentService } from '../../shared/utils/payment.utils';
import { ISubscription, SubscriptionStatus } from './subscription.types';
import { PaymentStatus, PaymentType } from '../payment/payment.types';
import { WebhookService } from './webhook.service';

// Create a simple logger if you don't have one
const logger = {
    info: (message: string, ...args: any[]) => console.log(message, ...args),
    error: (message: string, ...args: any[]) => console.error(message, ...args),
    warn: (message: string, ...args: any[]) => console.warn(message, ...args)
};

export class SubscriptionService {
    // Process due subscriptions
    static async processDueSubscriptions(): Promise<void> {
        try {
            // Get all due subscriptions
            const dueSubscriptions = await SubscriptionCrud.getDueSubscriptions();
            logger.info(`Processing ${dueSubscriptions.length} due subscriptions`);

            // Process each subscription
            for (const subscription of dueSubscriptions) {
                await this.processSubscriptionPayment(subscription);
            }
        } catch (error) {
            logger.error('Error processing due subscriptions:', error);
        }
    }

    // Process individual subscription payment
    static async processSubscriptionPayment(subscription: ISubscription): Promise<boolean> {
        try {
            // Verify rate is still active
            const rate = await RateCrud.getRateById(subscription.rateId.toString());
            if (!rate) {
                logger.error(`Rate not found for subscription ${subscription._id}`);
                await this.handleFailedPayment(subscription, 'Rate not found');
                return false;
            }

            // Get merchant wallet address
            const merchant = await MerchantCrud.getMerchantById(subscription.merchantId.toString());
            if (!merchant) {
                logger.error(`Merchant not found for subscription ${subscription._id}`);
                await this.handleFailedPayment(subscription, 'Merchant not found');
                return false;
            }

            // Create payment for subscription
            const payment = await PaymentCrud.createPayment({
                merchantId: subscription.merchantId.toString(),
                merchantWalletAddress: merchant.walletAddress,
                rateId: subscription.rateId.toString(),
                sourceAmount: subscription.amount,
                sourceAsset: subscription.sourceAsset,
                destinationAmount: (parseFloat(subscription.amount) * rate.rate).toFixed(7),
                destinationAsset: subscription.destinationAsset,
                exchangeRate: rate.rate,
                consumerEmail: subscription.customerId,
                type: PaymentType.CRYPTO,
                status: PaymentStatus.PENDING
            });

            // Generate Stellar payment details
            const paymentDetails = await StellarPaymentService.generatePaymentDetails();

            // Update payment with Stellar details
            await PaymentCrud.updatePaymentStatus(
                payment._id.toString(),
                PaymentStatus.PENDING,
                paymentDetails.paymentAddress
            );

            // Start monitoring for payment
            const success = await StellarPaymentService.monitorPayment(payment);

            if (success) {
                // Update subscription with successful payment
                await SubscriptionCrud.updateNextBillingDate(subscription._id.toString());
                await SubscriptionCrud.updateSubscriptionStatus(
                    subscription._id.toString(),
                    SubscriptionStatus.ACTIVE
                );

                logger.info(`Successfully processed payment for subscription ${subscription._id}`);
                return true;
            } else {
                await this.handleFailedPayment(subscription, 'Payment processing failed');
                return false;
            }
        } catch (error) {
            logger.error(`Error processing subscription ${subscription._id}:`, error);
            await this.handleFailedPayment(subscription, error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    }

    // Handle failed payment
    private static async handleFailedPayment(subscription: ISubscription, reason: string): Promise<void> {
        try {
            // Update subscription with failed attempt
            await SubscriptionCrud.updateNextBillingDate(subscription._id.toString(), true);
            
            // If max retries reached, mark subscription as failed
            if (subscription.failedAttempts >= 2) { // 3 attempts total
                await SubscriptionCrud.updateSubscriptionStatus(
                    subscription._id.toString(),
                    SubscriptionStatus.FAILED
                );
                logger.warn(`Subscription ${subscription._id} marked as failed after 3 attempts`);
            }

            // Send webhook notification
            await WebhookService.notifyPaymentFailed(
                subscription,
                reason
            );

            logger.error(`Payment failed for subscription ${subscription._id}: ${reason}`);
        } catch (error) {
            logger.error(`Error handling failed payment for subscription ${subscription._id}:`, error);
        }
    }
} 