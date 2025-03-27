import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import only the auth routes for now
import authRoutes from './modules/core-auth/auth.router';
import rateRoutes from './modules/rate/rate.router';
import paymentRouter from './modules/payment/payment.router';
import subscriptionRouter from './modules/subscription/subscription.router';
import consumerRouter from './modules/consumer/consumer.router';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes() {
        // Only use auth routes for now
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/rates', rateRoutes);
        this.app.use('/api/payments', paymentRouter);
        this.app.use('/api/subscriptions', subscriptionRouter);
        this.app.use('/api/consumers', consumerRouter);
        
        // Add a root route
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ 
                message: 'FixedRateX API',
                version: '1.0.0',
                status: 'online'
            });
        });
        
        // Add a catch-all route for undefined routes
        this.app.use('*', (req: Request, res: Response) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }
}

export default new App().app;