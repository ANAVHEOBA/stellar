import nodemailer from 'nodemailer';
import { config } from '../../config/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.password
    },
    debug: true // Enable debug logs
});

// Verify transporter
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email transporter error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export const sendPaymentRequestEmail = async (
    consumerEmail: string, 
    paymentLink: string
): Promise<void> => {
    const paymentUrl = `${config.email.frontendUrl}/payment/${paymentLink}`;

    console.log('Email Configuration:', {
        from: config.email.user,
        to: consumerEmail,
        frontendUrl: config.email.frontendUrl,
        paymentUrl: paymentUrl
    });

    const mailOptions = {
        from: config.email.user,
        to: consumerEmail,
        subject: 'Payment Request from FixedRateX',
        html: `
            <h1>Payment Request</h1>
            <p>You have received a payment request. Click the link below to process your payment:</p>
            <a href="${paymentUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Process Payment</a>
            <p>Or copy this link: ${paymentUrl}</p>
            <p>This payment link will expire in 30 minutes.</p>
        `
    };

    try {
        console.log('Sending email with options:', mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully. Full response:', {
            messageId: info.messageId,
            response: info.response,
            envelope: info.envelope
        });
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send payment request email: ' + (error as Error).message);
    }
}; 