import { Keypair } from 'stellar-sdk';

// Generate a new random keypair
const keypair = Keypair.random();

console.log('Public Key (Wallet Address):', keypair.publicKey());
console.log('Secret Key (Keep this safe!):', keypair.secret()); 