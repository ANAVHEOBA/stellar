import { Consumer, PaymentMethod } from './consumer.schema';
import { 
    IConsumer, 
    ICreateConsumer, 
    IUpdateConsumer, 
    IPaymentMethod, 
    PaymentMethodType 
} from './consumer.types';
import { Types } from 'mongoose';

export class ConsumerCrud {
    static async createConsumer(data: ICreateConsumer): Promise<IConsumer> {
        const consumer = new Consumer({
            userId: new Types.ObjectId(data.merchantId), // Assuming userId is used
            merchantId: new Types.ObjectId(data.merchantId),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber
        });
        return await consumer.save();
    }

    static async getConsumerById(consumerId: string): Promise<IConsumer | null> {
        return await Consumer.findById(consumerId);
    }

    static async updateConsumer(
        consumerId: string, 
        data: IUpdateConsumer
    ): Promise<IConsumer | null> {
        return await Consumer.findByIdAndUpdate(
            consumerId, 
            { $set: data }, 
            { new: true }
        );
    }

    static async addPaymentMethod(
        consumerId: string, 
        type: PaymentMethodType, 
        identifier: string,
        isDefault: boolean = false
    ): Promise<IPaymentMethod> {
        // First, if this is set as default, unset other defaults
        if (isDefault) {
            await PaymentMethod.updateMany(
                { consumerId: new Types.ObjectId(consumerId) },
                { isDefault: false }
            );
        }

        const paymentMethod = new PaymentMethod({
            consumerId: new Types.ObjectId(consumerId),
            type,
            identifier,
            isDefault
        });

        return await paymentMethod.save();
    }

    static async getConsumerPaymentMethods(
        consumerId: string
    ): Promise<IPaymentMethod[]> {
        return await PaymentMethod.find({ 
            consumerId: new Types.ObjectId(consumerId) 
        });
    }

    static async getDefaultPaymentMethod(
        consumerId: string
    ): Promise<IPaymentMethod | null> {
        return await PaymentMethod.findOne({ 
            consumerId: new Types.ObjectId(consumerId),
            isDefault: true 
        });
    }
} 