import { Types } from 'mongoose';

export interface IMerchant {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    businessName: string;
    walletAddress: string;
    webhookUrl?: string;
    webhookSecret?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUpdateMerchant {
    businessName?: string;
    walletAddress?: string;
    webhookUrl?: string;
    webhookSecret?: string;
} 