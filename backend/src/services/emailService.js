// backend/src/services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

initializeTransporter();

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate Trading Password (10 chars with special chars)
export const generateTradingPassword = () => {
    const length = 10;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%&*';

    const allChars = uppercase + lowercase + numbers + special;
    let password = '';

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate Account Number (format: JM + 8 digits)
export const generateAccountNumber = () => {
    return 'JM' + Math.floor(10000000 + Math.random() * 90000000);
};

// ============================================
// SIMPLIFIED REGISTRATION EMAIL
// ============================================

const registrationEmailHTML = (userData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Jaaz Markets</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 20px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Jaaz Markets</h1>
                        </td>
                    </tr>
                    
                    <!-- Welcome -->
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="margin: 0 0 8px; color: #1a1a1a; font-size: 22px; font-weight: 600;">Welcome, ${userData.firstName} ${userData.lastName}!</h2>
                            <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.5;">
                                Your account has been created successfully. Below are your complete login credentials.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Credentials Section -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #f97316; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 15px; background-color: #fff5f0;">
                                        <h3 style="margin: 0 0 15px; color: #f97316; font-size: 16px; font-weight: 700; text-transform: uppercase;">
                                            🔐 Your Login Credentials
                                        </h3>
                                        
                                        <!-- Login Email -->
                                        <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 8px; background-color: #fff; border-radius: 4px;">
                                            <tr>
                                                <td style="width: 35%; color: #666; font-size: 14px; font-weight: 600; vertical-align: top; padding-top: 10px;">Login Email:</td>
                                                <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; word-break: break-all;">${userData.email}</td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Portal Password -->
                                        <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 8px; background-color: #fff; border-radius: 4px;">
                                            <tr>
                                                <td style="width: 35%; color: #666; font-size: 14px; font-weight: 600; vertical-align: top; padding-top: 10px;">Portal Password:</td>
                                                <td style="color: #1a1a1a; font-size: 15px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                                                    ${userData.portalPassword || '(Your signup password)'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="padding-top: 0; padding-bottom: 10px; color: #999; font-size: 12px; font-style: italic;">
                                                    For web dashboard login
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Trading Password - HIGHLIGHTED -->
                                        <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 8px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 4px;">
                                            <tr>
                                                <td style="width: 35%; color: #92400e; font-size: 14px; font-weight: 700; vertical-align: top; padding-top: 10px;">Trading Password:</td>
                                                <td style="color: #92400e; font-size: 16px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                                                    ${userData.tradingPassword}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td style="padding-top: 0; padding-bottom: 10px; color: #92400e; font-size: 12px; font-weight: 600;">
                                                    ⚠️ For MT4/MT5 platform login
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Account Number -->
                                        <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #fff; border-radius: 4px;">
                                            <tr>
                                                <td style="width: 35%; color: #666; font-size: 14px; font-weight: 600; vertical-align: top; padding-top: 10px;">Account Number:</td>
                                                <td style="color: #f97316; font-size: 16px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                                                    ${userData.accountNumber || 'JM' + Math.floor(10000000 + Math.random() * 90000000)}
                                                </td>
                                            </tr>
                                        </table>
                                        
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Account Details - Compact Table -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <h3 style="margin: 0 0 10px; color: #1a1a1a; font-size: 16px; font-weight: 600;">📊 Account Information</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #666; font-size: 13px; width: 50%;">
                                        <strong>Account Type:</strong>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a; font-size: 13px; font-weight: 600;">
                                        Standard
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #666; font-size: 13px;">
                                        <strong>Base Currency:</strong>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a; font-size: 13px; font-weight: 600;">
                                        ${userData.currency || 'USD'}
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #666; font-size: 13px;">
                                        <strong>Leverage:</strong>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a; font-size: 13px; font-weight: 600;">
                                        1:100
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #666; font-size: 13px;">
                                        <strong>Platform:</strong>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #1a1a1a; font-size: 13px; font-weight: 600;">
                                        MT5 (Web, Desktop, Mobile)
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #666; font-size: 13px;">
                                        <strong>Account Status:</strong>
                                    </td>
                                    <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #f59e0b; font-size: 13px; font-weight: 700;">
                                        Pending Verification
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; color: #666; font-size: 13px;">
                                        <strong>KYC Status:</strong>
                                    </td>
                                    <td style="padding: 10px; color: #ef4444; font-size: 13px; font-weight: 700;">
                                        Pending
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Quick Next Steps -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <h3 style="margin: 0 0 10px; color: #1a1a1a; font-size: 16px; font-weight: 600;">🚀 Next Steps</h3>
                            <div style="background-color: #f9fafb; border-left: 3px solid #f97316; padding: 12px; border-radius: 4px;">
                                <p style="margin: 0 0 8px; color: #333; font-size: 14px; line-height: 1.6;">
                                    <strong>1.</strong> Complete KYC verification (upload ID documents)
                                </p>
                                <p style="margin: 0 0 8px; color: #333; font-size: 14px; line-height: 1.6;">
                                    <strong>2.</strong> Fund your account (minimum $100 USD)
                                </p>
                                <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.6;">
                                    <strong>3.</strong> Download MT5 platform and start trading
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Login Button -->
                    <tr>
                        <td style="padding: 0 20px 20px;" align="center">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 6px; padding: 12px 35px;">
                                        <a href="${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/signin" style="color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                                            Login to Dashboard →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Security Notice - Compact -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <div style="background-color: #fef2f2; border-left: 3px solid #ef4444; padding: 12px; border-radius: 4px;">
                                <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.5;">
                                    <strong>🔒 Security:</strong> Never share your passwords. Enable 2FA in settings. Jaaz Markets will never ask for your password via email/phone.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Support - Compact -->
                    <tr>
                        <td style="padding: 0 20px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; padding: 12px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0 0 6px; color: #1a1a1a; font-size: 14px; font-weight: 600;">Need Help? 24/7 Support</p>
                                        <p style="margin: 0; color: #666; font-size: 13px;">
                                            📧 support@jaazmarkets.com | 💬 Live Chat Available
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer - Minimal -->
                    <tr>
                        <td style="padding: 15px; background-color: #1f2937; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                © ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
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
const registrationEmailText = (userData) => `
WELCOME TO JAAZ MARKETS
=======================

Hi ${userData.firstName} ${userData.lastName},

Your account has been created successfully!

YOUR LOGIN CREDENTIALS:
-----------------------
Login Email: ${userData.email}
Portal Password: ${userData.portalPassword || '(Your signup password)'}
                 For web dashboard login

Trading Password: ${userData.tradingPassword}
                 ⚠️ For MT4/MT5 platform login

Account Number: ${userData.accountNumber || 'Pending'}


ACCOUNT INFORMATION:
--------------------
Account Type: Standard
Base Currency: ${userData.currency || 'USD'}
Leverage: 1:100
Platform: MT5 (Web, Desktop, Mobile)
Account Status: Pending Verification
KYC Status: Pending


NEXT STEPS:
-----------
1. Complete KYC verification (upload ID documents)
2. Fund your account (minimum $100 USD)
3. Download MT5 platform and start trading


SECURITY:
---------
🔒 Never share your passwords
🔒 Enable 2FA in settings
🔒 Jaaz Markets will never ask for your password via email/phone


NEED HELP?
----------
24/7 Support Available
📧 support@jaazmarkets.com
💬 Live Chat on our website

Login: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/signin

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// ============================================
// PASSWORD RESET EMAIL - SIMPLE VERSION
// ============================================

const passwordResetEmailHTML = (otp, name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 10px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    
                    <tr>
                        <td style="padding: 20px; text-align: center; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Jaaz Markets</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <h2 style="margin: 0 0 10px; color: #1a1a1a; font-size: 20px; font-weight: 600;">Reset Your Password</h2>
                            <p style="margin: 0 0 20px; color: #666; font-size: 14px;">
                                Hi <strong>${name}</strong>, use this code to reset your password:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color: #f9fafb; border: 2px solid #f97316; border-radius: 6px; padding: 20px;">
                                        <div style="font-size: 12px; color: #666; margin-bottom: 8px; font-weight: 600;">VERIFICATION CODE</div>
                                        <div style="font-size: 32px; font-weight: 700; color: #f97316; letter-spacing: 6px; font-family: 'Courier New', monospace;">${otp}</div>
                                        <div style="font-size: 12px; color: #999; margin-top: 8px;">Expires in 10 minutes</div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; color: #666; font-size: 13px;">
                                If you didn't request this, ignore this email.
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; background-color: #f9fafb; text-align: center;">
                            <p style="margin: 0; color: #999; font-size: 12px;">
                                © ${new Date().getFullYear()} Jaaz Markets
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

const passwordResetEmailText = (otp, name) => `
Hi ${name},

Your password reset code: ${otp}

This code expires in 10 minutes.

If you didn't request this, ignore this email.

---
© ${new Date().getFullYear()} Jaaz Markets
`;

// ============================================
// SEND FUNCTIONS
// ============================================

export const sendRegistrationEmail = async (userData) => {
    try {
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
            to: userData.email,
            subject: '✅ Your Jaaz Markets Account - Login Credentials',
            html: registrationEmailHTML(userData),
            text: registrationEmailText(userData),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Registration email sent:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error('Error sending registration email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, otp, name) => {
    try {
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
            subject: '🔐 Password Reset Code',
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

export default {
    sendRegistrationEmail,
    sendPasswordResetEmail,
    generateOTP,
    generateTradingPassword,
    generateAccountNumber,
};
