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

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTraderPassword = () => {
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

export const generateInvestorPassword = () => {
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

// REGISTRATION EMAIL
const registrationEmailHTML = (userData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; padding: 30px 20px;">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #000000;">
                    <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #000000;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">JAAZ MARKETS</h1>
                            <p style="margin: 5px 0 0; font-size: 12px;">Welcome to Our Platform</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            
                            <p style="margin: 0 0 10px; font-size: 14px;">Dear ${userData.firstName} ${userData.lastName},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
                                Welcome to Jaaz Markets! Your account has been successfully created. Please find your portal login credentials below.
                            </p>
                            
                            <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #000000; font-size: 13px; margin-bottom: 20px;">
                                <tr style="border-bottom: 1px solid #000000;">
                                    <td colspan="2" style="font-weight: bold; background-color: #f5f5f5; text-transform: uppercase; font-size: 12px;">
                                        PORTAL CREDENTIALS
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="width: 40%; font-weight: bold; padding: 12px 8px;">User ID:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px;">${userData.accountNumber}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Email:</td>
                                    <td style="padding: 12px 8px;">${userData.email}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; padding: 12px 8px;">Portal Password:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px;">${userData.portalPassword}</td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f97316; margin-bottom: 20px; background-color: #fff7ed;">
                                <tr>
                                    <td style="padding: 15px; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px; font-weight: bold; text-transform: uppercase; color: #c2410c;">📌 Next Steps:</p>
                                        <p style="margin: 0 0 8px;">1. Login to your dashboard using the credentials above</p>
                                        <p style="margin: 0 0 8px;">2. Complete your profile and KYC verification</p>
                                        <p style="margin: 0 0 8px;">3. Create your first trading account (Demo or Real)</p>
                                        <p style="margin: 0;">4. You will receive separate credentials for each trading account you create</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 10px; font-size: 14px;">Login URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/login</p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                                Should you require any assistance, please contact our support team at support@jaazmarkets.com
                            </p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px;">
                                Sincerely,<br/>
                                <strong>Jaaz Markets Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; border-top: 1px solid #000000; font-size: 11px; text-align: center;">
                            &copy; ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const registrationEmailText = (userData) => `
JAAZ MARKETS
Trading Platform

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${userData.firstName} ${userData.lastName},

Your trading account has been successfully created. Please find your account credentials below.

ACCOUNT CREDENTIALS
-------------------
Account Number:    ${userData.accountNumber}
Login Email:       ${userData.email}
Portal Password:   ${userData.portalPassword}

PASSWORD USAGE:
Portal Password: Use this to access the web dashboard
Trader Password: Use this for full trading access on MT4/MT5 platforms
Investor Password: Use this for read-only access on MT4/MT5 platforms

SECURITY NOTICE:
Never share your passwords with anyone. Enable two-factor authentication in your account settings. Jaaz Markets will never ask for your password via email or phone.

Login URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/login

Should you require any assistance, please contact our support team at support@jaazmarkets.com

Sincerely,
Jaaz Markets Team

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// EMAIL VERIFICATION OTP
const emailVerificationHTML = (otp, name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; padding: 30px 20px;">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #000000;">
                    <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #000000;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">JAAZ MARKETS</h1>
                            <p style="margin: 5px 0 0; font-size: 12px;">Email Verification</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            
                            <p style="margin: 0 0 10px; font-size: 14px;">Dear ${name},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
                                Please use the following verification code to complete your email verification:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 20px; border: 2px solid #000000; background-color: #f5f5f5;">
                                        <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold;">VERIFICATION CODE</p>
                                        <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                                        <p style="margin: 8px 0 0; font-size: 11px;">Valid for 10 minutes</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                                If you did not request this verification code, please disregard this email.
                            </p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px;">
                                Sincerely,<br/>
                                <strong>Jaaz Markets Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; border-top: 1px solid #000000; font-size: 11px; text-align: center;">
                            &copy; ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const emailVerificationText = (otp, name) => `
JAAZ MARKETS
Email Verification

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${name},

Please use the following verification code to complete your email verification:

VERIFICATION CODE
-----------------
${otp}

Valid for 10 minutes

If you did not request this verification code, please disregard this email.

Sincerely,
Jaaz Markets Team

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// PASSWORD RESET
const passwordResetEmailHTML = (otp, name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; padding: 30px 20px;">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #000000;">
                    <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #000000;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">JAAZ MARKETS</h1>
                            <p style="margin: 5px 0 0; font-size: 12px;">Password Reset Request</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            
                            <p style="margin: 0 0 10px; font-size: 14px;">Dear ${name},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
                                We received a request to reset your password. Please use the following verification code:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center" style="padding: 20px; border: 2px solid #000000; background-color: #f5f5f5;">
                                        <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold;">PASSWORD RESET CODE</p>
                                        <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                                        <p style="margin: 8px 0 0; font-size: 11px;">Valid for 10 minutes</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                                If you did not request a password reset, please contact our support team immediately at support@jaazmarkets.com
                            </p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px;">
                                Sincerely,<br/>
                                <strong>Jaaz Markets Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; border-top: 1px solid #000000; font-size: 11px; text-align: center;">
                            &copy; ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
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
JAAZ MARKETS
Password Reset Request

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${name},

We received a request to reset your password. Please use the following verification code:

PASSWORD RESET CODE
-------------------
${otp}

Valid for 10 minutes

If you did not request a password reset, please contact our support team immediately at support@jaazmarkets.com

Sincerely,
Jaaz Markets Team

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// MARGIN CALL WARNING
const marginCallEmailHTML = (userData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; padding: 30px 20px;">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #000000;">
                    <tr>
                        <td style="padding: 20px; border-bottom: 2px solid #000000; background-color: #f5f5f5;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">JAAZ MARKETS</h1>
                            <p style="margin: 5px 0 0; font-size: 14px; font-weight: bold;">URGENT: MARGIN CALL WARNING</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US')}</p>
                            
                            <p style="margin: 0 0 10px; font-size: 14px;">Dear ${userData.name},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; font-weight: bold;">
                                This is an urgent notification regarding your trading account. Your account has reached the margin call threshold.
                            </p>
                            
                            <table width="100%" cellpadding="8" cellspacing="0" style="border: 2px solid #000000; font-size: 13px; margin-bottom: 20px;">
                                <tr style="border-bottom: 1px solid #000000;">
                                    <td colspan="2" style="font-weight: bold; background-color: #f5f5f5; text-transform: uppercase; font-size: 12px;">
                                        ACCOUNT DETAILS
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="width: 40%; font-weight: bold; padding: 12px 8px;">Account Number:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px;">${userData.accountNumber}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Current Balance:</td>
                                    <td style="padding: 12px 8px;">${userData.currency} ${userData.balance.toFixed(2)}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Current Equity:</td>
                                    <td style="padding: 12px 8px;">${userData.currency} ${userData.equity.toFixed(2)}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Used Margin:</td>
                                    <td style="padding: 12px 8px;">${userData.currency} ${userData.usedMargin.toFixed(2)}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Margin Level:</td>
                                    <td style="padding: 12px 8px; font-weight: bold;">${userData.marginLevel.toFixed(2)}%</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; padding: 12px 8px;">Unrealized Loss:</td>
                                    <td style="padding: 12px 8px; font-weight: bold;">${userData.currency} ${userData.unrealizedLoss.toFixed(2)} (${userData.lossPercentage.toFixed(2)}%)</td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #000000; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 15px; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px; font-weight: bold; text-transform: uppercase;">IMMEDIATE ACTION REQUIRED:</p>
                                        <p style="margin: 0 0 8px;">1. Deposit additional funds to increase your margin level</p>
                                        <p style="margin: 0 0 8px;">2. Close some or all open positions to reduce exposure</p>
                                        <p style="margin: 0 0 8px;">3. Reduce position sizes to decrease margin requirement</p>
                                        <p style="margin: 0;">4. Contact our support team for assistance: support@jaazmarkets.com</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #000000; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 15px; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px; font-weight: bold; text-transform: uppercase;">IMPORTANT NOTICE:</p>
                                        <p style="margin: 0;">If your margin level continues to decline and reaches the stop-out level (typically 50%), your positions may be automatically closed by our system to prevent further losses. This action is taken to protect both you and the company from negative balance scenarios.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 10px; font-size: 14px;">Dashboard URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/dashboard</p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                                This is an automated notification. For immediate assistance, please contact our risk management team.
                            </p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px;">
                                Sincerely,<br/>
                                <strong>Jaaz Markets Risk Management</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; border-top: 2px solid #000000; font-size: 11px; text-align: center;">
                            &copy; ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const marginCallEmailText = (userData) => `
JAAZ MARKETS
URGENT: MARGIN CALL WARNING

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${new Date().toLocaleTimeString('en-US')}

Dear ${userData.name},

This is an urgent notification regarding your trading account. Your account has reached the margin call threshold.

ACCOUNT DETAILS
----------------
Account Number:    ${userData.accountNumber}
Current Balance:   ${userData.currency} ${userData.balance.toFixed(2)}
Current Equity:    ${userData.currency} ${userData.equity.toFixed(2)}
Used Margin:       ${userData.currency} ${userData.usedMargin.toFixed(2)}
Margin Level:      ${userData.marginLevel.toFixed(2)}%
Unrealized Loss:   ${userData.currency} ${userData.unrealizedLoss.toFixed(2)} (${userData.lossPercentage.toFixed(2)}%)

IMMEDIATE ACTION REQUIRED:
1. Deposit additional funds to increase your margin level
2. Close some or all open positions to reduce exposure
3. Reduce position sizes to decrease margin requirement
4. Contact our support team for assistance: support@jaazmarkets.com

IMPORTANT NOTICE:
If your margin level continues to decline and reaches the stop-out level (typically 50%), your positions may be automatically closed by our system to prevent further losses. This action is taken to protect both you and the company from negative balance scenarios.

Dashboard URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/dashboard

This is an automated notification. For immediate assistance, please contact our risk management team.

Sincerely,
Jaaz Markets Risk Management

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// SEND FUNCTIONS
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
            subject: 'Account Created - Login Credentials',
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

export const sendEmailVerificationOTP = async (email, otp, name) => {
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
            subject: 'Email Verification Code',
            html: emailVerificationHTML(otp, name),
            text: emailVerificationText(otp, name),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email verification sent:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error('Error sending verification email:', error);
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
            subject: 'Password Reset Code',
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

// TRADING ACCOUNT CREATION EMAIL
const tradingAccountCreatedHTML = (accountData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Courier New', Courier, monospace; background-color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 650px; margin: 0 auto; padding: 30px 20px;">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #000000;">
                    <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #000000;">
                            <h1 style="margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase;">JAAZ MARKETS</h1>
                            <p style="margin: 5px 0 0; font-size: 12px;">Trading Account Created</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px;">
                            <p style="margin: 0 0 15px; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            
                            <p style="margin: 0 0 10px; font-size: 14px;">Dear ${accountData.userName},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6;">
                                Your ${accountData.accountType} trading account has been successfully created. Please find your account credentials below.
                            </p>
                            
                            <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #000000; font-size: 13px; margin-bottom: 20px;">
                                <tr style="border-bottom: 1px solid #000000;">
                                    <td colspan="2" style="font-weight: bold; background-color: #f5f5f5; text-transform: uppercase; font-size: 12px;">
                                        ACCOUNT CREDENTIALS
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="width: 40%; font-weight: bold; padding: 12px 8px;">Account Number:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px;">${accountData.accountNumber}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Login:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px;">${accountData.login}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Platform:</td>
                                    <td style="padding: 12px 8px;">${accountData.platform}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Server:</td>
                                    <td style="padding: 12px 8px;">${accountData.server}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Account Type:</td>
                                    <td style="padding: 12px 8px;">${accountData.accountClass}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Leverage:</td>
                                    <td style="padding: 12px 8px;">${accountData.leverage}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid #cccccc;">
                                    <td style="font-weight: bold; padding: 12px 8px;">Currency:</td>
                                    <td style="padding: 12px 8px;">${accountData.currency}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; padding: 12px 8px;">Balance:</td>
                                    <td style="padding: 12px 8px;">${accountData.currency} ${accountData.balance}</td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="8" cellspacing="0" style="border: 2px solid #f97316; font-size: 13px; margin-bottom: 20px; background-color: #fff7ed;">
                                <tr style="border-bottom: 1px solid #f97316;">
                                    <td colspan="2" style="font-weight: bold; background-color: #fed7aa; text-transform: uppercase; font-size: 12px;">
                                        🔐 TRADING PASSWORDS
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid #fed7aa;">
                                    <td style="width: 40%; font-weight: bold; padding: 12px 8px;">Trader Password:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px; font-weight: bold; color: #c2410c;">${accountData.traderPassword}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight: bold; padding: 12px 8px;">Investor Password:</td>
                                    <td style="font-family: 'Courier New', monospace; padding: 12px 8px; font-weight: bold; color: #c2410c;">${accountData.investorPassword}</td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #000000; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 15px; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px; font-weight: bold; text-transform: uppercase;">Password Usage:</p>
                                        <p style="margin: 0 0 8px;"><strong>Trader Password:</strong> Use this for full trading access on ${accountData.platform} platform (place trades, modify orders, manage positions)</p>
                                        <p style="margin: 0;"><strong>Investor Password:</strong> Use this for read-only access on ${accountData.platform} platform (view trades and history only, cannot trade)</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 2px solid #dc2626; margin-bottom: 20px; background-color: #fef2f2;">
                                <tr>
                                    <td style="padding: 15px; font-size: 12px; line-height: 1.6;">
                                        <p style="margin: 0 0 10px; font-weight: bold; text-transform: uppercase; color: #dc2626;">⚠️ SECURITY NOTICE:</p>
                                        <p style="margin: 0 0 8px;">• Never share your Trader Password with anyone</p>
                                        <p style="margin: 0 0 8px;">• You can share the Investor Password with mentors/analysts for monitoring only</p>
                                        <p style="margin: 0 0 8px;">• Enable two-factor authentication in your account settings</p>
                                        <p style="margin: 0;">• Jaaz Markets will never ask for your password via email or phone</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 10px; font-size: 14px;">Dashboard URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/dashboard</p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6;">
                                Should you require any assistance, please contact our support team at support@jaazmarkets.com
                            </p>
                            
                            <p style="margin: 20px 0 0; font-size: 14px;">
                                Sincerely,<br/>
                                <strong>Jaaz Markets Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 15px; border-top: 1px solid #000000; font-size: 11px; text-align: center;">
                            &copy; ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const tradingAccountCreatedText = (accountData) => `
JAAZ MARKETS
Trading Account Created

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${accountData.userName},

Your ${accountData.accountType} trading account has been successfully created. Please find your account credentials below.

ACCOUNT CREDENTIALS
-------------------
Account Number:    ${accountData.accountNumber}
Login:             ${accountData.login}
Platform:          ${accountData.platform}
Server:            ${accountData.server}
Account Type:      ${accountData.accountClass}
Leverage:          ${accountData.leverage}
Currency:          ${accountData.currency}
Balance:           ${accountData.currency} ${accountData.balance}

TRADING PASSWORDS
-----------------
Trader Password:   ${accountData.traderPassword}
Investor Password: ${accountData.investorPassword}

PASSWORD USAGE:
Trader Password: Use this for full trading access on ${accountData.platform} platform (place trades, modify orders, manage positions)
Investor Password: Use this for read-only access on ${accountData.platform} platform (view trades and history only, cannot trade)

SECURITY NOTICE:
• Never share your Trader Password with anyone
• You can share the Investor Password with mentors/analysts for monitoring only
• Enable two-factor authentication in your account settings
• Jaaz Markets will never ask for your password via email or phone

Dashboard URL: ${process.env.FRONTEND_URL || 'https://jaazmarkets.com'}/dashboard

Should you require any assistance, please contact our support team at support@jaazmarkets.com

Sincerely,
Jaaz Markets Team

---
© ${new Date().getFullYear()} Jaaz Markets. All rights reserved.
`;

// Export function
export const sendTradingAccountCreatedEmail = async (accountData) => {
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
            to: accountData.email,
            subject: `${accountData.accountType} Trading Account Created - ${accountData.accountNumber}`,
            html: tradingAccountCreatedHTML(accountData),
            text: tradingAccountCreatedText(accountData),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Trading account creation email sent:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error('Error sending trading account email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export const sendMarginCallEmail = async (userData) => {
    try {
        if (!transporter || !isVerified) {
            const initialized = await initializeTransporter();
            if (!initialized) {
                throw new Error('Email service is not available');
            }
        }

        const mailOptions = {
            from: {
                name: 'Jaaz Markets Risk Management',
                address: process.env.EMAIL_USER
            },
            to: userData.email,
            subject: 'URGENT: Margin Call Warning - Immediate Action Required',
            html: marginCallEmailHTML(userData),
            text: marginCallEmailText(userData),
            priority: 'high',
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Margin call email sent:', info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error('Error sending margin call email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default {
    sendRegistrationEmail,
    sendPasswordResetEmail,
    sendEmailVerificationOTP,
    sendMarginCallEmail,
    sendTradingAccountCreatedEmail,
    generateOTP,
    generateTraderPassword,
    generateInvestorPassword
};
