import CybersecurityHero from '@/components/CyberSecurityHero'
import CyberThreats from '@/components/CyberThreats'
import ScamExamples from '@/components/ScamExamples'
import ProtectionTips from '@/components/ProtectionTips'
import CyberSecuritySupport from '@/components/CyberSecuritySupport'
import React from 'react'

const heroButtons = [
    {
        text: 'Learn About Threats',
        link: '#threats',
        variant: 'primary'
    },
    {
        text: 'Protection Tips',
        link: '#protection',
        variant: 'secondary'
    }
]

const CyberThreatsData = {
    heading: 'Common Cybersecurity Threats',
    description: 'Understanding these threats is the first step to protecting yourself from financial fraud and identity theft.',
    threats: [
        {
            title: 'Phishing Emails',
            description: 'Fake emails designed to steal your login credentials and personal information by impersonating legitimate companies.',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
            icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        },
        {
            title: 'Fake Brokers',
            description: 'Unregulated trading platforms that steal deposits and personal data while appearing legitimate.',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.944-.833-2.714 0L3.1 16.5c-.77.833.192 2.5 1.732 2.5z'
        },
        {
            title: 'Social Engineering',
            description: 'Manipulation tactics used to trick you into revealing sensitive information or transferring money.',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        },
        {
            title: 'Malware & Viruses',
            description: 'Malicious software that can steal passwords, monitor trading activity, and access financial accounts.',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Identity Theft',
            description: 'Criminals using stolen personal information to open accounts and commit fraud in your name.',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
        },
        {
            title: 'Pump & Dump Schemes',
            description: 'Artificial inflation of asset prices through false recommendations, followed by selling at inflated prices.',
            bgColor: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
        }
    ]
}

const ScamExamplesData = {
    heading: 'Real Scam Examples',
    description: 'Learn to recognize these common scam tactics to protect yourself and your investments.',
    examples: [
        {
            title: 'Fake Support Phone Call',
            description: '"Hello, this is John from Jaaz Markets support. We\'ve detected suspicious activity on your account. Please provide your login credentials immediately to secure your account."',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-100',
            iconColor: 'text-red-600',
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
            alertBg: 'bg-red-50',
            alertBorder: 'border-red-200',
            alertText: 'text-red-800',
            listText: 'text-red-700',
            redFlags: [
                'Unsolicited call asking for credentials',
                'Urgency and pressure tactics',
                'No verification of your identity first'
            ]
        },
        {
            title: 'Phishing Email',
            description: '"Urgent: Your Jaaz Markets account will be suspended in 24 hours. Click here to verify your account: jaaz-markets-verify.net"',
            borderColor: 'border-orange-500',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            alertBg: 'bg-orange-50',
            alertBorder: 'border-orange-200',
            alertText: 'text-orange-800',
            listText: 'text-orange-700',
            redFlags: [
                'Suspicious URL (not jaazmarkets.com)',
                'False urgency ("24 hours")',
                'Poor grammar or spelling',
                'Generic greeting'
            ]
        },
        {
            title: 'Too-Good-To-Be-True Investment',
            description: '"Exclusive opportunity! Guaranteed 50% returns in 30 days with our AI trading bot. Limited spots available - invest now!"',
            borderColor: 'border-purple-500',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            alertBg: 'bg-purple-50',
            alertBorder: 'border-purple-200',
            alertText: 'text-purple-800',
            listText: 'text-purple-700',
            redFlags: [
                'Guaranteed returns (impossible in trading)',
                'Unrealistic profit promises',
                'False scarcity ("limited spots")',
                'Pressure to invest immediately'
            ]
        }
    ]
}

const ProtectionTipsData = {
    heading: 'How to Stay Protected',
    description: 'Follow these essential security practices to keep your trading account and personal information safe.',
    sections: [
        {
            title: 'Account Security',
            bgColor: 'bg-blue-500',
            icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
            tips: [
                'Use strong, unique passwords with at least 12 characters',
                'Enable two-factor authentication (2FA) on all accounts',
                'Never share login credentials with anyone',
                'Log out completely when finished trading',
                'Monitor account activity regularly for unauthorized transactions'
            ]
        },
        {
            title: 'Email & Communication',
            bgColor: 'bg-green-500',
            icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            tips: [
                'Always verify the sender\'s email address (official domain: jaazmarkets.com)',
                'Never click suspicious links or download attachments from unknown sources',
                'Type website URLs directly into your browser instead of clicking links',
                'Be suspicious of urgent requests for personal information',
                'Contact us directly if you receive suspicious communications'
            ]
        },
        {
            title: 'Device Security',
            bgColor: 'bg-purple-500',
            icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            tips: [
                'Keep your operating system and browser updated',
                'Use reputable antivirus software',
                'Avoid trading on public Wi-Fi networks',
                'Lock your device when not in use',
                'Only download the MT5 app from official app stores'
            ]
        },
        {
            title: 'Investment Safety',
            bgColor: 'bg-yellow-500',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            tips: [
                'Verify broker regulation and licensing before investing',
                'Be skeptical of "guaranteed returns" or "risk-free" investments',
                'Never invest more than you can afford to lose',
                'Research and understand any investment before committing funds',
                'Avoid high-pressure sales tactics or time-limited offers'
            ]
        }
    ]
}

const SecuritySupportData = {
    heading: 'Need Help or Reporting Suspicious Activity?',
    description: 'If you\'ve encountered a potential scam or need assistance with security concerns, our support team is here to help you stay protected.',
    supportOptions: [
        {
            title: '24/7 Support Hotline',
            description: 'Speak directly with our security specialists',
            contact: '+1-844-694-2090',
            contactSize: 'text-2xl',
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
        },
        {
            title: 'Security Email',
            description: 'Report suspicious activity or get help',
            contact: 'info@jaazmarkets.com',
            contactSize: 'text-xl',
            icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
        }
    ],
    buttons: [
        {
            text: 'Contact Support Team',
            link: '/contact',
            variant: 'primary'
        },
        {
            text: 'Security FAQ',
            link: '/faq',
            variant: 'secondary'
        }
    ]
}

const page = () => {
    return (
        <main>
            <CybersecurityHero buttons={heroButtons} />
            <CyberThreats data={CyberThreatsData} />
            <ScamExamples data={ScamExamplesData} />
            <ProtectionTips data={ProtectionTipsData} />
            <CyberSecuritySupport data={SecuritySupportData} />
        </main>
    )
}

export default page
