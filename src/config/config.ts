import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        // Can be a string like '7d', a number of seconds, or undefined
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    
    stellar: {
        network: process.env.STELLAR_NETWORK || 'TESTNET',
        horizonUrl: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
        assetIssuer: process.env.STELLAR_ASSET_ISSUER || '',
        operationalSecret: process.env.STELLAR_OPERATIONAL_SECRET || ''
    },
    
    database: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/fixedratex'
    }
};