import { Document, Types } from 'mongoose';

// Supported currencies (can expand this list)
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XLM';

// Rate status
export type RateStatus = 'active' | 'expired' | 'pending';

// Interface for Rate document
export interface IRate extends Document {
    merchantId: Types.ObjectId;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    rate: number;
    validFrom: Date;
    validTo: Date;
    status: RateStatus;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for creating a new rate
export interface ICreateRate {
    merchantId: string;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    rate: number;
    validityPeriod: number; // in days
}

// Interface for rate response
export interface IRateResponse {
    success: boolean;
    data?: {
        rate: IRate;
    };
    error?: string;
}

// Add these interfaces
export interface ICheckRateViability {
    baseCurrency: Currency;
    quoteCurrency: Currency;
    amount: string;
}

export interface IRateViabilityResponse {
    success: boolean;
    data?: {
        isViable: boolean;
    };
    error?: string;
} 