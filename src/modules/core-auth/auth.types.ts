import { Document, Types } from 'mongoose';
import { Request } from 'express';
import ms from 'ms';

export interface IUser extends Document {
    email: string;
    walletAddress: string;
    userType: 'merchant' | 'consumer';
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISession extends Document {
    userId: Types.ObjectId;
    token: string;
    isValid: boolean;
    expiresAt: Date;
    createdAt: Date;
}

export interface IStellarAuthChallenge {
    transaction: string;
    networkPassphrase: string;
}

export interface IAuthResponse {
    token: string;
    user: IUser;
}

export interface JWTPayload {
    userId: string;
    userType: string;
    walletAddress: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}