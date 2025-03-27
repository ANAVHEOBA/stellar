import { Keypair } from 'stellar-sdk';
import axios from 'axios';

async function createOperationalAccount() {
    try {
        // Generate new keypair
        const keypair = Keypair.random();
        const publicKey = keypair.publicKey();
        const secretKey = keypair.secret();

        console.log('Generated Keypair:');
        console.log('Public Key:', publicKey);
        console.log('Secret Key:', secretKey);

        // Fund the account using Friendbot
        const response = await axios.get(`https://friendbot.stellar.org?addr=${publicKey}`);
        
        if (response.status === 200) {
            console.log('\nAccount funded successfully!');
            console.log('\nAdd this to your .env file:');
            console.log(`STELLAR_OPERATIONAL_SECRET=${secretKey}`);
        }
    } catch (error) {
        console.error('Error creating operational account:', error);
    }
}

createOperationalAccount(); 