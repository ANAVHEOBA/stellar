import mongoose, { Schema } from 'mongoose';
import { IUser, ISession } from './auth.types';

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        enum: ['merchant', 'consumer'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const SessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,  // Fixed: Using Schema.Types.ObjectId
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
UserSchema.index({ walletAddress: 1 });
SessionSchema.index({ token: 1 });
SessionSchema.index({ userId: 1 });

// Add methods if needed
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
};

export const User = mongoose.model<IUser>('User', UserSchema);
export const Session = mongoose.model<ISession>('Session', SessionSchema);