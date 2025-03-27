import app from './app';
import { config } from './config/config';
import { connectDatabase } from './config/database.config';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();
        
        const port = config.port;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`🌍 Environment: ${config.nodeEnv}`);
            console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Don't exit here as the database connection has its own error handling
});