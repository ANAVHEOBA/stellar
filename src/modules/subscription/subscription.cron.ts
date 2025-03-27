import cron from 'node-cron';
import { SubscriptionProcessor } from './subscription.processor';
import { logger } from '../../shared/utils/logger.utils';

export class SubscriptionCron {
    // Run every hour
    static schedule(): void {
        cron.schedule('0 * * * *', async () => {
            logger.info('Starting scheduled subscription processing');
            await SubscriptionProcessor.processSubscriptions();
        });

        logger.info('Subscription cron job scheduled');
    }

    // For testing/manual runs
    static async runNow(): Promise<void> {
        logger.info('Running subscription processing manually');
        await SubscriptionProcessor.processSubscriptions();
    }
} 