import { Types } from 'mongoose';

export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    EXPIRED = 'expired'
}

export enum PaymentType {
    CRYPTO = 'crypto',
    FIAT = 'fiat'
}

export interface IPayment {
    _id: Types.ObjectId;
    merchantId: Types.ObjectId;
    rateId: Types.ObjectId;
    type: PaymentType;
    status: PaymentStatus;
    sourceAmount: string;
    sourceAsset: string;
    destinationAmount: string;
    destinationAsset: string;
    exchangeRate: number;
    customerEmail?: string;
    stellarTransactionId?: string;
    stellarPaymentAddress?: string;
    stellarMemo?: string;
    merchantWalletAddress: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    consumerEmail: string;
    paymentLink: string;
    consumerWalletAddress?: string;
}

export interface ICreatePayment {
    merchantId: string;
    rateId: string;
    sourceAmount: string;
    sourceAsset: string;
    destinationAmount: string;
    destinationAsset: string;
    exchangeRate: number;
    customerEmail?: string;
    stellarPaymentAddress?: string;
    stellarMemo?: string;
    merchantWalletAddress: string;
    type?: PaymentType;
    status?: PaymentStatus;
    expiresAt?: Date;
    consumerEmail: string;
    paymentLink?: string;
}

export interface IUpdateConsumerWallet {
    paymentId: string;
    consumerWalletAddress: string;
}

export interface IVerifyPayment {
    paymentId: string;
    transactionId: string;
    amount: string;
    asset: string;
} 