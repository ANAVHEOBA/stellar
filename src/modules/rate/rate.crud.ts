import { Rate } from './rate.schema';
import { IRate, ICreateRate } from './rate.types';
import { Types } from 'mongoose';
import { validateStellarRate, checkPathPaymentViability } from '../../shared/utils/stellar.utils';

export class RateCrud {
    // Create a new rate
    static async createRate(data: ICreateRate): Promise<IRate> {
        const validFrom = new Date();
        const validTo = new Date();
        validTo.setDate(validTo.getDate() + data.validityPeriod);

        const rate = new Rate({
            merchantId: new Types.ObjectId(data.merchantId),
            baseCurrency: data.baseCurrency,
            quoteCurrency: data.quoteCurrency,
            rate: data.rate,
            validFrom,
            validTo,
            status: 'pending'
        });

        return await rate.save();
    }

    // Get rate by ID
    static async getRateById(rateId: string): Promise<IRate | null> {
        return await Rate.findById(rateId);
    }

    // Get active rates for a merchant
    static async getMerchantActiveRates(merchantId: string): Promise<IRate[]> {
        return await Rate.find({
            merchantId: new Types.ObjectId(merchantId),
            status: 'active',
            validTo: { $gt: new Date() }
        }).sort({ createdAt: -1 });
    }

    // Get rate by currency pair for a merchant
    static async getMerchantRateByCurrencyPair(
        merchantId: string,
        baseCurrency: string,
        quoteCurrency: string
    ): Promise<IRate | null> {
        try {
            return await Rate.findOne({
                merchantId: new Types.ObjectId(merchantId),
                baseCurrency: baseCurrency.toUpperCase(),
                quoteCurrency: quoteCurrency.toUpperCase(),
                status: 'active',
                validTo: { $gt: new Date() }
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Get merchant rate error:', error);
            return null;
        }
    }

    // Update rate status
    static async updateRateStatus(rateId: string, status: 'active' | 'expired'): Promise<IRate | null> {
        return await Rate.findByIdAndUpdate(
            rateId,
            { status },
            { new: true }
        );
    }

    // Expire all rates for a merchant
    static async expireMerchantRates(merchantId: string): Promise<void> {
        await Rate.updateMany(
            {
                merchantId: new Types.ObjectId(merchantId),
                status: 'active'
            },
            {
                status: 'expired'
            }
        );
    }

    // Get all rates that need to be checked against market
    static async getRatesToValidate(): Promise<IRate[]> {
        return await Rate.find({
            status: 'pending',
            validFrom: { $lte: new Date() },
            validTo: { $gt: new Date() }
        });
    }

    // Delete rate
    static async deleteRate(rateId: string): Promise<boolean> {
        const result = await Rate.deleteOne({ _id: new Types.ObjectId(rateId) });
        return result.deletedCount === 1;
    }

    // Get rates about to expire (within next 24 hours)
    static async getExpiringRates(): Promise<IRate[]> {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return await Rate.find({
            status: 'active',
            validTo: {
                $gt: new Date(),
                $lt: tomorrow
            }
        });
    }

    // Validate and activate rate
    static async validateAndActivateRate(rateId: string): Promise<IRate | null> {
        const rate = await this.getRateById(rateId);
        if (!rate) return null;

        const isValid = await validateStellarRate(
            rate.baseCurrency,
            rate.quoteCurrency,
            rate.rate
        );

        if (isValid) {
            return await this.updateRateStatus(rateId, 'active');
        }

        return await this.updateRateStatus(rateId, 'expired');
    }

    // Add new method for checking rate viability
    static async checkRateViability(
        merchantId: string,
        baseCurrency: string,
        quoteCurrency: string,
        amount: string
    ): Promise<{
        isViable: boolean;
        rate: number | null;
        details?: any;
    }> {
        try {
            // Get the active rate for this currency pair
            const rate = await this.getMerchantRateByCurrencyPair(
                merchantId,
                baseCurrency,
                quoteCurrency
            );

            if (!rate) {
                return {
                    isViable: false,
                    rate: null,
                    details: {
                        error: 'No active rate found for this currency pair'
                    }
                };
            }

            // Check viability using Stellar utils
            const viabilityResult = await checkPathPaymentViability(
                baseCurrency,
                quoteCurrency,
                amount,
                rate.rate
            );

            return {
                isViable: viabilityResult.isViable,
                rate: rate.rate,
                details: viabilityResult.details
            };
        } catch (error) {
            console.error('Check rate viability error:', error);
            return {
                isViable: false,
                rate: null,
                details: {
                    error: 'Failed to check rate viability'
                }
            };
        }
    }
} 