import mongoose from 'mongoose';
import { config } from './config';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(config.database.url);
        console.log('📦 Connected to MongoDB Atlas');
        
        // Set up global mongoose configuration
        mongoose.set('debug', config.nodeEnv === 'development');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('🔌 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('🔥 MongoDB connection error:', err);
});

// Gracefully close the MongoDB connection when the Node process ends
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});
