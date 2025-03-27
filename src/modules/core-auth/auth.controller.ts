import { Request, Response } from 'express';
import { AuthModel } from './auth.model';
import { AuthCrud } from './auth.crud';

export class AuthController {
    getAuthChallenge = async (req: Request, res: Response): Promise<void> => {
        try {
            const { walletAddress } = req.body;
            
            if (!walletAddress) {
                res.status(400).json({ 
                    success: false,
                    error: 'Wallet address is required' 
                });
                return;
            }

            try {
                const challenge = await AuthModel.generateAuthChallenge(walletAddress);
                res.json({ 
                    success: true, 
                    data: challenge 
                });
            } catch (error) {
                if (error instanceof Error && error.message === 'Invalid Stellar wallet address') {
                    res.status(400).json({
                        success: false,
                        error: 'Invalid Stellar wallet address format'
                    });
                    return;
                }
                throw error; // Re-throw other errors
            }
        } catch (error) {
            console.error('Challenge generation error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to generate challenge' 
            });
        }
    };

    verifyAuth = async (req: Request, res: Response): Promise<void> => {
        try {
            const { signedChallenge, walletAddress, userType } = req.body;

            const isValid = await AuthModel.verifyAuthChallenge(signedChallenge);
            if (!isValid) {
                res.status(401).json({ 
                    success: false,
                    error: 'Invalid signature' 
                });
                return;
            }

            const user = await AuthModel.authenticateUser(walletAddress, userType);
            const token = await AuthModel.createUserSession(user);

            res.json({
                success: true,
                data: {
                    token,
                    user
                }
            });
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Authentication failed' 
            });
        }
    };

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(400).json({ 
                    success: false,
                    error: 'No token provided' 
                });
                return;
            }

            await AuthCrud.invalidateSession(token);
            res.json({ 
                success: true, 
                message: 'Logged out successfully' 
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Logout failed' 
            });
        }
    };

    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ 
                    success: false,
                    error: 'Not authenticated' 
                });
                return;
            }

            const user = await AuthCrud.findUserByWallet(req.user.walletAddress);
            if (!user) {
                res.status(404).json({ 
                    success: false,
                    error: 'User not found' 
                });
                return;
            }

            res.json({ 
                success: true, 
                data: { user } 
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to get user info' 
            });
        }
    };

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ 
                    success: false,
                    error: 'Not authenticated' 
                });
                return;
            }

            const user = await AuthCrud.findUserByWallet(req.user.walletAddress);
            if (!user) {
                res.status(404).json({ 
                    success: false,
                    error: 'User not found' 
                });
                return;
            }

            // Invalidate old token
            const oldToken = req.headers.authorization?.split(' ')[1];
            if (oldToken) {
                await AuthCrud.invalidateSession(oldToken);
            }

            // Create new token
            const newToken = await AuthModel.createUserSession(user);

            res.json({
                success: true,
                data: {
                    token: newToken,
                    user
                }
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(500).json({ 
                success: false,
                error: 'Failed to refresh token' 
            });
        }
    };
}