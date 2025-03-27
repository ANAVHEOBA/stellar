import { Transaction, Networks, Keypair } from 'stellar-sdk';

// The challenge transaction XDR
const challengeXdr = process.argv[2];
// Your secret key
const secretKey = process.argv[3];

if (!challengeXdr || !secretKey) {
    console.error('Usage: ts-node sign-challenge.ts <challenge-xdr> <secret-key>');
    process.exit(1);
}

try {
    // Create transaction object from XDR
    const transaction = new Transaction(challengeXdr, Networks.TESTNET);
    
    // Sign the transaction
    const keypair = Keypair.fromSecret(secretKey);
    transaction.sign(keypair);
    
    // Get the signed transaction XDR
    const signedXdr = transaction.toXDR();
    console.log(signedXdr);
} catch (error) {
    console.error('Error signing transaction:', error);
    process.exit(1);
} 