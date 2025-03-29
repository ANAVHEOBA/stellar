import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
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
    },

    email: {
        user: 'wisdomvolt@gmail.com',
        password: process.env.EMAIL_PASSWORD,
        service: 'gmail',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    }
};