import { User, Session } from './auth.schema';
import { IUser, ISession } from './auth.types';
import { Types } from 'mongoose';

export class AuthCrud {
    static async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return await user.save();
    }

    static async findUserByWallet(walletAddress: string): Promise<IUser | null> {
        return await User.findOne({ walletAddress });
    }

    static async createSession(userId: string, token: string, expiresAt: Date): Promise<ISession> {
        const session = new Session({
            userId: new Types.ObjectId(userId),
            token,
            expiresAt
        });
        return await session.save();
    }

    static async invalidateSession(token: string): Promise<boolean> {
        const result = await Session.updateOne(
            { token },
            { isValid: false }
        );
        return result.modifiedCount > 0;
    }

    static async findValidSession(token: string): Promise<ISession | null> {
        return await Session.findOne({
            token,
            isValid: true,
            expiresAt: { $gt: new Date() }
        });
    }
}
