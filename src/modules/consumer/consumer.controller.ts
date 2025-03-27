import { Request, Response } from 'express';
import { ConsumerCrud } from './consumer.crud';
import { ICreateConsumer, IUpdateConsumer } from './consumer.types';

export class ConsumerController {
    // Create a new consumer
    createConsumer = async (req: Request, res: Response): Promise<void> => {
        try {
            const consumerData: ICreateConsumer = req.body;
            const consumer = await ConsumerCrud.createConsumer(consumerData);
            res.status(201).json({ 
                success: true, 
                data: consumer 
            });
        } catch (error) {
            console.error('Error creating consumer:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create consumer' 
            });
        }
    };

    // Get consumer by ID
    getConsumerById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { consumerId } = req.params;
            const consumer = await ConsumerCrud.getConsumerById(consumerId);
            if (!consumer) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Consumer not found' 
                });
                return;
            }
            res.json({ 
                success: true, 
                data: consumer 
            });
        } catch (error) {
            console.error('Error fetching consumer:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch consumer' 
            });
        }
    };

    // Update consumer details
    updateConsumer = async (req: Request, res: Response): Promise<void> => {
        try {
            const { consumerId } = req.params;
            const updateData: IUpdateConsumer = req.body;
            const updatedConsumer = await ConsumerCrud.updateConsumer(consumerId, updateData);
            if (!updatedConsumer) {
                res.status(404).json({ 
                    success: false, 
                    error: 'Consumer not found' 
                });
                return;
            }
            res.json({ 
                success: true, 
                data: updatedConsumer 
            });
        } catch (error) {
            console.error('Error updating consumer:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to update consumer' 
            });
        }
    };

    // Add a payment method for the consumer
    addPaymentMethod = async (req: Request, res: Response): Promise<void> => {
        try {
            const { consumerId } = req.params;
            const { type, identifier, isDefault } = req.body;
            const paymentMethod = await ConsumerCrud.addPaymentMethod(consumerId, type, identifier, isDefault);
            res.status(201).json({ 
                success: true, 
                data: paymentMethod 
            });
        } catch (error) {
            console.error('Error adding payment method:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to add payment method' 
            });
        }
    };

    // Get all payment methods for the consumer
    getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
        try {
            const { consumerId } = req.params;
            const paymentMethods = await ConsumerCrud.getConsumerPaymentMethods(consumerId);
            res.json({ 
                success: true, 
                data: paymentMethods 
            });
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to fetch payment methods' 
            });
        }
    };
} 