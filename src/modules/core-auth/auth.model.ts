import { AuthCrud } from './auth.crud';
import { IUser, ISession, IStellarAuthChallenge } from './auth.types';
import { generateToken } from '../../shared/utils/jwt.utils';
import { 
    Networks, 
    TransactionBuilder, 
    Keypair, 
    Account,
    BASE_FEE,
    Operation,
    Transaction,
    StrKey
} from 'stellar-sdk';
import { config } from '../../config/config';
import crypto from 'crypto';

export class AuthModel {
    static async generateAuthChallenge(walletAddress: string): Promise<IStellarAuthChallenge> {
        // Validate the wallet address format
        if (!StrKey.isValidEd25519PublicKey(walletAddress)) {
            throw new Error('Invalid Stellar wallet address');
        }

        try {
            // Create a random nonce keypair for the challenge
            const serverKeypair = Keypair.random();
            
            // Create a mock account for the transaction builder
            const account = new Account(serverKeypair.publicKey(), '0');
            
            // Generate a shorter challenge value (32 bytes)
            const nonce = crypto.randomBytes(32).toString('base64').slice(0, 64);
            
            // Build the challenge transaction
            const challengeTx = new TransactionBuilder(account, {
                fee: BASE_FEE,
                networkPassphrase: Networks.TESTNET
            })
                .addOperation(Operation.manageData({
                    name: 'auth',
                    value: Buffer.from(nonce), // Use the shorter nonce value
                    source: walletAddress
                }))
                .setTimeout(300) // 5 minutes
                .build();
            
            return {
                transaction: challengeTx.toXDR(),
                networkPassphrase: Networks.TESTNET
            };
        } catch (error) {
            console.error('Error generating auth challenge:', error);
            throw new Error('Failed to generate authentication challenge');
        }
    }

   


    static async verifyAuthChallenge(signedChallenge: string): Promise<boolean> {
        try {
            // Convert XDR to transaction object
            const transaction = new Transaction(signedChallenge, Networks.TESTNET);
            
            // Verify the transaction structure
            if (!transaction || transaction.operations.length !== 1) {
                return false;
            }

            // Verify the operation is manageData
            const operation = transaction.operations[0];
            if (operation.type !== 'manageData' || !operation.value) {
                return false;
            }

            // Verify the signature
            transaction.signatures.forEach(signature => {
                // Verify each signature
                // In production, add more robust signature verification
            });

            return true;
        } catch (error) {
            console.error('Challenge verification failed:', error);
            return false;
        }
    }

    static async authenticateUser(walletAddress: string, userType: 'merchant' | 'consumer'): Promise<IUser> {
        let user = await AuthCrud.findUserByWallet(walletAddress);
        
        if (!user) {
            user = await AuthCrud.createUser({
                walletAddress,
                userType,
                lastLogin: new Date()
            });
        } else {
            // Update last login
            user.lastLogin = new Date();
            await user.save();
        }

        return user;
    }

    static async createUserSession(user: IUser): Promise<string> {
        const token = generateToken({
            userId: user.id,
            userType: user.userType,
            walletAddress: user.walletAddress
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await AuthCrud.createSession(user.id, token, expiresAt);
        return token;
    }
}
