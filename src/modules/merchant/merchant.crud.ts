import { Merchant } from './merchant.schema';
import { IMerchant, IUpdateMerchant } from './merchant.types';
import { Types } from 'mongoose';

export class MerchantCrud {
    // ... existing methods ...

    static async getMerchantById(merchantId: string): Promise<IMerchant | null> {
        return await Merchant.findById(merchantId);
    }

    static async updateMerchantSettings(
        merchantId: string,
        data: IUpdateMerchant
    ): Promise<IMerchant | null> {
        return await Merchant.findByIdAndUpdate(
            merchantId,
            { $set: data },
            { new: true }
        );
    }

    static async getMerchantWebhookDetails(merchantId: string): Promise<{
        webhookUrl?: string;
        webhookSecret?: string;
    } | null> {
        const merchant = await Merchant.findById(merchantId)
            .select('webhookUrl webhookSecret');
        
        if (!merchant) return null;
        
        return {
            webhookUrl: merchant.webhookUrl,
            webhookSecret: merchant.webhookSecret
        };
    }
} 