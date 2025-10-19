// app/trust/security/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import SecurityOverview from '@/components/SecurityOverview'
import SecurityFeatures from '@/components/SecurityFeatures'
import SecurityCertifications from '@/components/SecurityCertifications'
import SecurityBestPractices from '@/components/SecurityBestPractices'
import SecuritySupport from '@/components/SecuritySupport'
import React from 'react'

const SecurityOverviewData = {
    heading: 'Multi-Layer Security',
    description: 'Our comprehensive security framework combines advanced technology, strict protocols, and continuous monitoring to ensure your complete protection.',
    features: [
        {
            iconName: 'Shield',
            title: '256-bit SSL Encryption',
            description: 'All data transmitted between your device and our servers is protected with military-grade encryption',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            iconName: 'Smartphone',
            title: 'Two-Factor Authentication',
            description: 'Enhanced account security with SMS and authenticator app-based 2FA protection',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            iconName: 'Eye',
            title: '24/7 Security Monitoring',
            description: 'Round-the-clock surveillance and real-time threat detection systems',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange'
        },
        {
            iconName: 'Server',
            title: 'Secure Data Centers',
            description: 'Tier IV data centers with redundant systems and physical security controls',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        }
    ]
}

const SecurityFeaturesData = {
    heading: 'Advanced Security Features',
    description: 'Comprehensive security measures designed to protect every aspect of your trading experience.',
    sections: [
        {
            title: 'Data Protection',
            checkColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            features: [
                {
                    title: 'End-to-End Encryption',
                    description: 'All sensitive data is encrypted both in transit and at rest using AES-256 encryption standards.'
                },
                {
                    title: 'GDPR Compliance',
                    description: 'Full compliance with European data protection regulations ensuring your privacy rights.'
                },
                {
                    title: 'Secure Data Storage',
                    description: 'Personal and financial data stored in geographically distributed, secured data centers.'
                },
                {
                    title: 'Regular Backups',
                    description: 'Automated daily backups with point-in-time recovery capabilities to ensure data integrity.'
                }
            ]
        },
        {
            title: 'Access Control',
            checkColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            features: [
                {
                    title: 'Multi-Factor Authentication',
                    description: 'Mandatory 2FA for account access with support for SMS, email, and authenticator apps.'
                },
                {
                    title: 'IP Whitelisting',
                    description: 'Restrict account access to specific IP addresses for enhanced security control.'
                },
                {
                    title: 'Session Management',
                    description: 'Automatic session timeouts and concurrent session limits to prevent unauthorized access.'
                },
                {
                    title: 'Device Recognition',
                    description: 'Advanced device fingerprinting to detect and prevent unauthorized login attempts.'
                }
            ]
        }
    ]
}

const SecurityCertificationsData = {
    heading: 'Security Certifications',
    description: 'Our commitment to security is validated by industry-leading certifications and compliance standards.',
    certifications: [
        {
            name: 'ISO 27001',
            shortName: 'ISO',
            description: 'Information security management system certification ensuring systematic approach to data protection.',
            bgColor: 'bg-blue-100 /30',
            textColor: 'text-blue-600'
        },
        {
            name: 'PCI DSS',
            shortName: 'PCI',
            description: 'Payment Card Industry Data Security Standard compliance for secure payment processing.',
            bgColor: 'bg-green-100 /30',
            textColor: 'text-green-600'
        },
        {
            name: 'SOC 2 Type II',
            shortName: 'SOC',
            description: 'Service Organization Control 2 certification for security, availability, and confidentiality.',
            bgColor: 'bg-purple-100 /30',
            textColor: 'text-purple-600'
        },
        {
            name: 'Extended Validation SSL',
            shortName: 'SSL',
            description: 'Highest level SSL certificate providing maximum trust and encryption strength.',
            bgColor: 'bg-primary-orange/10',
            textColor: 'text-primary-orange'
        }
    ]
}

const SecurityBestPracticesData = {
    heading: 'Your Security Best Practices',
    description: 'Follow these security guidelines to maintain the highest level of protection for your trading account.',
    practices: [
        {
            iconName: 'Edit',
            title: 'Strong Passwords',
            iconBg: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            tips: [
                'Use at least 12 characters',
                'Mix uppercase and lowercase',
                'Include numbers and symbols',
                'Avoid personal information'
            ]
        },
        {
            iconName: 'Smartphone',
            title: 'Enable Two-Factor Authentication',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            tips: [
                'Use authenticator apps (recommended)',
                'Keep backup codes safe',
                'Update phone numbers regularly',
                'Never share 2FA codes'
            ]
        },
        {
            iconName: 'Shield',
            title: 'Safe Trading Practices',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            tips: [
                'Always log out after trading',
                'Avoid public Wi-Fi for trading',
                'Monitor account activity regularly',
                'Report suspicious activity immediately'
            ]
        }
    ]
}

const SecuritySupportData = {
    heading: 'Security Support',
    description: 'Our security team is available 24/7 to assist with any security-related concerns or incidents.',
    contacts: [
        {
            title: 'Email Support',
            info: 'info@jaazmarkets.com',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        },
        {
            title: 'Live Chat',
            info: 'Available 24/7 in client portal',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        },
        {
            title: 'Emergency Hotline',
            info: '+1-844-694-2090',
            bgColor: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
    ],
    alert: {
        title: 'Security Alert',
        message: 'Jaaz Markets will never ask for your password, PIN, or 2FA codes via email or phone. If you receive such requests, please contact our security team immediately.'
    }
}

const ctaData = {
    heading: 'Start Trading Securely',
    description: 'Join thousands of traders who trust our platform with their investments. Open your secure trading account today.',
    buttons: [
        {
            text: 'Open Secure Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'primary',
            icon: 'user',
        },
        // {
        //     text: 'View Regulations',
        //     href: '/trust/regulation',
        //     variant: 'secondary',
        //     icon: 'monitor',
        // },
        {
            text: 'Try Demo Account',
            href: '/demo',
            variant: 'secondary',
            icon: 'smile',
        },
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner />
            <SecurityOverview data={SecurityOverviewData} />
            <SecurityFeatures data={SecurityFeaturesData} />
            <SecurityCertifications data={SecurityCertificationsData} />
            <SecurityBestPractices data={SecurityBestPracticesData} />
            <SecuritySupport data={SecuritySupportData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
