import * as StellarSdk from 'stellar-sdk';
import { 
    Keypair, 
    Asset, 
    Operation, 
    TransactionBuilder, 
    Networks,
    Horizon
} from 'stellar-sdk';
import { config } from '../../config/config';
import { IPayment, PaymentStatus } from '../../modules/payment/payment.types';
import { PaymentCrud } from '../../modules/payment/payment.crud';
import { BigNumber } from 'bignumber.js';

// Initialize Stellar server
const server = new StellarSdk.Horizon.Server(config.stellar.horizonUrl);

interface PaymentDetails {
    paymentAddress: string;
    memo: string;
}

export class StellarPaymentService {
    // Generate unique payment details for a new payment
    static async generatePaymentDetails(): Promise<PaymentDetails> {
        // Generate a new keypair for this payment
        const paymentKeypair = Keypair.random();
        
        // Generate a random memo
        const memo = Math.random().toString(36).substring(2, 15);

        return {
            paymentAddress: paymentKeypair.publicKey(),
            memo
        };
    }

    // Monitor for incoming payment
    static async monitorPayment(payment: IPayment): Promise<boolean> {
        try {
            const cursor = 'now';
            const paymentStream = server
                .payments()
                .forAccount(payment.stellarPaymentAddress!)
                .cursor(cursor)
                .stream({
                    onmessage: async (value: any) => {
                        // Process payment when received
                        if (value.type === 'payment') {
                            const stellarPayment = value as Horizon.ServerApi.PaymentOperationRecord;
                            // Verify amount and asset
                            if (this.verifyPayment(stellarPayment, payment)) {
                                // Process the payment
                                await this.processPayment(payment);
                            }
                        }
                    }
                });

            // Return the payment stream for cleanup
            return true;
        } catch (error) {
            console.error('Error monitoring payment:', error);
            return false;
        }
    }

    // Verify incoming payment matches expected details
    private static verifyPayment(
        stellarPayment: Horizon.ServerApi.PaymentOperationRecord, 
        payment: IPayment
    ): boolean {
        try {
            // Verify amount matches
            const receivedAmount = new BigNumber(stellarPayment.amount);
            const expectedAmount = new BigNumber(payment.sourceAmount);
            
            // Verify asset type
            const isNativeAsset = stellarPayment.asset_type === 'native' && 
                                payment.sourceAsset === 'XLM';

            return receivedAmount.isEqualTo(expectedAmount) && isNativeAsset;
        } catch (error) {
            console.error('Payment verification error:', error);
            return false;
        }
    }

    // Process the payment through Stellar DEX
    static async processPayment(payment: IPayment): Promise<boolean> {
        try {
            if (!config.stellar.operationalSecret) {
                throw new Error('Operational account secret not configured');
            }

            const sourceAccount = await server.loadAccount(config.stellar.assetIssuer);
            const fee = await server.fetchBaseFee();

            // Create the payment operation
            const paymentOp = Operation.payment({
                destination: payment.merchantWalletAddress,
                asset: Asset.native(), // Assuming XLM for now
                amount: payment.destinationAmount // This should already be a string
            });

            // Build and submit transaction
            const transaction = new TransactionBuilder(sourceAccount, {
                fee: fee.toString(), // Convert fee to string
                networkPassphrase: Networks.TESTNET
            })
                .addOperation(paymentOp)
                .setTimeout(30)
                .build();

            // Sign with operational account
            transaction.sign(Keypair.fromSecret(config.stellar.operationalSecret));

            // Submit to network
            const result = await server.submitTransaction(transaction);
            
            if (result) {
                // Update payment status
                await PaymentCrud.updatePaymentStatus(
                    payment._id.toString(),
                    PaymentStatus.COMPLETED,
                    result.hash
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error processing payment:', error);
            await PaymentCrud.updatePaymentStatus(
                payment._id.toString(),
                PaymentStatus.FAILED
            );
            return false;
        }
    }
} 