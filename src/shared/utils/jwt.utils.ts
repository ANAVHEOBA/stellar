import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import ms from 'ms';
import { config } from '../../config/config';
import { JWTPayload } from '../../modules/core-auth/auth.types';

// Define valid time unit strings
type TimeUnit = 'y'|'w'|'d'|'h'|'m'|'s'|'ms';
type StringValue = `${number}${TimeUnit}`;

// Type guard to check if the value is a valid ms string
function isValidMsString(value: unknown): value is StringValue {
    if (typeof value !== 'string') return false;
    // Simple regex to validate format: number followed by valid time unit
    const timeUnitRegex = /^\d+(?:y|w|d|h|m|s|ms)$/;
    return timeUnitRegex.test(value);
}

export const generateToken = (payload: JWTPayload): string => {
    // Ensure secret is a string and handle potential undefined
    const secret: Secret = config.jwt.secret;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }

    const expiresIn = config.jwt.expiresIn;
    
    const options: SignOptions = {
        expiresIn: typeof expiresIn === 'string' && isValidMsString(expiresIn)
            ? ms(expiresIn) / 1000 // Convert ms to seconds
            : typeof expiresIn === 'number'
                ? expiresIn
                : 7 * 24 * 60 * 60 // Default to 7 days in seconds
    };

    return jwt.sign(
        payload, 
        secret,
        options
    );
};

export const verifyToken = (token: string): JWTPayload => {
    // Ensure secret is a string and handle potential undefined
    const secret: Secret = config.jwt.secret;
    if (!secret) {
        throw new Error('JWT secret is not defined');
    }

    try {
        return jwt.verify(token, secret) as JWTPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
};