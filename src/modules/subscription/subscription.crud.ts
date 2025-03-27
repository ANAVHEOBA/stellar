import { Types } from 'mongoose';
import { Subscription } from './subscription.schema';
import { 
    ISubscription, 
    ICreateSubscription, 
    SubscriptionStatus, 
    BillingPeriod 
} from './subscription.types';

export class SubscriptionCrud {
    // Create a new subscription
    static async createSubscription(data: ICreateSubscription): Promise<ISubscription> {
        const nextBillingDate = this.calculateNextBillingDate(new Date(), data.billingPeriod);
        
        const subscription = new Subscription({
            merchantId: new Types.ObjectId(data.merchantId),
            rateId: new Types.ObjectId(data.rateId),
            customerId: data.customerId,
            amount: data.amount,
            sourceAsset: data.sourceAsset,
            destinationAsset: data.destinationAsset,
            billingPeriod: data.billingPeriod,
            nextBillingDate,
            status: SubscriptionStatus.ACTIVE,
            failedAttempts: 0
        });

        return await subscription.save();
    }

    // Get subscription by ID
    static async getSubscriptionById(subscriptionId: string): Promise<ISubscription | null> {
        return await Subscription.findById(subscriptionId);
    }

    // Get merchant's subscriptions with optional filters
    static async getMerchantSubscriptions(
        merchantId: string,
        status?: SubscriptionStatus,
        limit = 10,
        offset = 0
    ): Promise<{ subscriptions: ISubscription[]; total: number }> {
        const query = {
            merchantId: new Types.ObjectId(merchantId),
            ...(status && { status })
        };

        const [subscriptions, total] = await Promise.all([
            Subscription.find(query)
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
            Subscription.countDocuments(query)
        ]);

        return { subscriptions, total };
    }

    // Update subscription status
    static async updateSubscriptionStatus(
        subscriptionId: string,
        status: SubscriptionStatus,
        lastPaymentId?: string
    ): Promise<ISubscription | null> {
        const update: { 
            status: SubscriptionStatus; 
            lastPaymentId?: Types.ObjectId 
        } = { status };

        if (lastPaymentId) {
            update.lastPaymentId = new Types.ObjectId(lastPaymentId);
        }

        return await Subscription.findByIdAndUpdate(
            subscriptionId,
            update,
            { new: true }
        );
    }

    // Get subscriptions due for billing
    static async getDueSubscriptions(): Promise<ISubscription[]> {
        const now = new Date();
        return await Subscription.find({
            status: SubscriptionStatus.ACTIVE,
            nextBillingDate: { $lte: now }
        });
    }

    // Update next billing date
    static async updateNextBillingDate(
        subscriptionId: string,
        failedAttempt = false
    ): Promise<ISubscription | null> {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) return null;

        const update: {
            nextBillingDate: Date;
            failedAttempts?: number;
            status?: SubscriptionStatus;
        } = {
            nextBillingDate: this.calculateNextBillingDate(
                subscription.nextBillingDate,
                subscription.billingPeriod
            )
        };

        if (failedAttempt) {
            update.failedAttempts = (subscription.failedAttempts || 0) + 1;
            if (update.failedAttempts >= 3) {
                update.status = SubscriptionStatus.FAILED;
            }
        } else {
            update.failedAttempts = 0;
        }

        return await Subscription.findByIdAndUpdate(
            subscriptionId,
            update,
            { new: true }
        );
    }

    // Helper method to calculate next billing date
    private static calculateNextBillingDate(currentDate: Date, period: BillingPeriod): Date {
        const nextDate = new Date(currentDate);
        
        switch (period) {
            case BillingPeriod.DAILY:
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case BillingPeriod.WEEKLY:
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case BillingPeriod.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case BillingPeriod.QUARTERLY:
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case BillingPeriod.YEARLY:
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        
        return nextDate;
    }
} 