import { Types } from 'mongoose';

export enum PaymentMethodType {
    STELLAR_WALLET = 'stellar_wallet',
    BANK_ACCOUNT = 'bank_account',
    CREDIT_CARD = 'credit_card'
}

export interface IConsumer {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    merchantId: Types.ObjectId;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface IPaymentMethod {
    _id: Types.ObjectId;
    consumerId: Types.ObjectId;
    type: PaymentMethodType;
    identifier: string; // Wallet address or last 4 digits
    isDefault: boolean;
    metadata?: Record<string, any>;
}

export interface ICreateConsumer {
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    merchantId: string;
}

export interface IUpdateConsumer {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
} 