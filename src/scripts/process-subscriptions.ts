import { SubscriptionService } from '../modules/subscription/subscription.service';
import { logger } from '../shared/utils/logger.utils';

async function processSubscriptions() {
    try {
        logger.info('Starting subscription processing');
        await SubscriptionService.processDueSubscriptions();
        logger.info('Finished subscription processing');
    } catch (error) {
        logger.error('Error in subscription processing:', error);
    }
}

// Run every hour
setInterval(processSubscriptions, 60 * 60 * 1000);

// Initial run
processSubscriptions(); 