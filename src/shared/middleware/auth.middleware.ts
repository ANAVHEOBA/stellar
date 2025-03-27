import { Request, Response, NextFunction } from 'express';
import { AuthCrud } from '../../modules/core-auth/auth.crud';
import { verifyToken } from '../utils/jwt.utils';
import { JWTPayload } from '../../modules/core-auth/auth.types';

// Extend the global Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ 
                success: false,
                error: 'Authorization header must start with Bearer' 
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ 
                success: false,
                error: 'No token provided' 
            });
            return;
        }

        try {
            const session = await AuthCrud.findValidSession(token);
            if (!session) {
                res.status(401).json({ 
                    success: false,
                    error: 'Invalid or expired session' 
                });
                return;
            }

            const decoded = verifyToken(token);
            req.user = decoded;
            next();
        } catch (jwtError) {
            res.status(401).json({ 
                success: false,
                error: 'Invalid token' 
            });
            return;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error during authentication' 
        });
        return;
    }
};

export const requireMerchant = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ 
            success: false,
            error: 'Authentication required' 
        });
        return;
    }
    
    if (req.user.userType !== 'merchant') {
        res.status(403).json({ 
            success: false,
            error: 'Merchant access required' 
        });
        return;
    }
    next();
};

export const requireConsumer = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ 
            success: false,
            error: 'Authentication required' 
        });
        return;
    }
    
    if (req.user.userType !== 'consumer') {
        res.status(403).json({ 
            success: false,
            error: 'Consumer access required' 
        });
        return;
    }
    next();
};