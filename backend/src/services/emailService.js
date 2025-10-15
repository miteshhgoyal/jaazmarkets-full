// backend/src/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('EMAIL_USER and EMAIL_PASSWORD environment variables are required');
}

const createTransporter = () => {
    const config = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        pool: true,
        maxConnections: 3,
        maxMessages: 100,
    };

    return nodemailer.createTransport(config);
};

let transporter = null;
let isVerified = false;

const initializeTransporter = async () => {
    try {
        transporter = createTransporter();
        await transporter.verify();
        isVerified = true;
        console.log('Email service ready');
        return true;
    } catch (error) {
        console.error('Email service failed:', error.message);
        isVerified = false;
        return false;
    }
};

// Initialize on load
initializeTransporter();

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// MINIMAL EMAIL TEMPLATES
// ============================================

// Password Reset Email - Minimal Design
const passwordResetEmailHTML = (otp, name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Jaaz Markets</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px 30px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Jaaz Markets</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                            <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                                Hi <strong>${name}</strong>,
                            </p>
                            <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password. Use the code below to complete the process:
                            </p>
                            
                            <!-- OTP Code -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background-color: #f9fafb; border: 2px dashed #e5e7eb; border-radius: 8px; padding: 25px;">
                                        <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                                        <div style="font-size: 36px; font-weight: 700; color: #f97316; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
                                        <div style="font-size: 14px; color: #9ca3af; margin-top: 10px;">Expires in <strong>10 minutes</strong></div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                If you didn't request this, please ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                                © ${new Date().getFullYear()} Jaaz Markets. All rights reserved.<br>
                                This is an automated message, please do not reply.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Plain text version
const passwordResetEmailText = (otp, name) => `
Hi ${name},

We received a request to reset your password for your Jaaz Markets account.

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

---
Jaaz Markets
© ${new Date().getFullYear()}
`;

// ============================================
// SEND PASSWORD RESET EMAIL
// ============================================

export const sendPasswordResetEmail = async (email, otp, name) => {
    try {
        // Ensure transporter is ready
        if (!transporter || !isVerified) {
            const initialized = await initializeTransporter();
            if (!initialized) {
                throw new Error('Email service is not available');
            }
        }

        const mailOptions = {
            from: {
                name: 'Jaaz Markets',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: '🔐 Password Reset Code - Jaaz Markets',
            html: passwordResetEmailHTML(otp, name),
            text: passwordResetEmailText(otp, name),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// ============================================
// SEND WELCOME EMAIL (OPTIONAL)
// ============================================

export const sendWelcomeEmail = async (email, name) => {
    try {
        if (!transporter || !isVerified) {
            await initializeTransporter();
        }

        const mailOptions = {
            from: {
                name: 'Jaaz Markets',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: '🎉 Welcome to Jaaz Markets',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                        <h1 style="color: #f97316;">Welcome to Jaaz Markets!</h1>
                        <p>Hi ${name},</p>
                        <p>Thank you for joining Jaaz Markets. Your account has been successfully created.</p>
                        <p>Start trading today and explore our powerful platform features.</p>
                        <p style="margin-top: 30px; color: #666;">Best regards,<br>Jaaz Markets Team</p>
                    </div>
                </div>
            `,
            text: `Hi ${name},\n\nWelcome to Jaaz Markets! Your account has been successfully created.\n\nBest regards,\nJaaz Markets Team`
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false };
    }
};

export default {
    sendPasswordResetEmail,
    sendWelcomeEmail,
    generateOTP,
};
