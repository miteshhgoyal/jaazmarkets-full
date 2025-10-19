import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import LegalDocuments from '@/components/company/LegalDocuments'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Open Live Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "View Documents",
            link: "#legal-documents",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const legalDocumentsData = {
    heading: 'Important Legal Information',
    description: 'Please review all legal documents carefully before opening an account. These documents outline your rights, responsibilities, and the terms of service when trading with Jaaz Markets.',
    documents: [
        {
            title: 'Terms & Conditions',
            description: 'General terms and conditions governing the use of our website and services.',
            iconName: 'FileText',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            features: [
                'Website usage policies',
                'User responsibilities',
                'Intellectual property rights'
            ],
            buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
            link: '/legal/terms-conditions'
        },
        {
            title: 'Privacy Policy',
            description: 'How we collect, use, and protect your personal information.',
            iconName: 'Lock',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            features: [
                'Data collection practices',
                'Cookie usage policy',
                'User privacy rights'
            ],
            buttonStyle: 'bg-primary-orange text-white hover:bg-primary-orange/90',
            link: '/legal/privacy-policy'
        },
        {
            title: 'Risk Disclosure',
            description: 'Important information about the risks associated with financial trading.',
            iconName: 'AlertTriangle',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            features: [
                'Market risk factors',
                'Leverage risks',
                'Trading disclaimers'
            ],
            buttonStyle: 'bg-yellow-600 text-white hover:bg-yellow-700',
            link: '/legal/risk-disclosure'
        },
        {
            title: 'AML/KYC Policy',
            description: 'Anti-money laundering and know your customer compliance procedures.',
            iconName: 'Shield',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            features: [
                'Identity verification requirements',
                'Document submission guidelines',
                'Compliance procedures'
            ],
            buttonStyle: 'bg-green-600 text-white hover:bg-green-700',
            link: '/legal/aml-kyc-policy'
        }
    ],
    quickLinks: {
        heading: 'Quick Access to All Legal Documents',
        links: [
            {
                text: 'Terms & Conditions',
                href: '/legal/terms-conditions',
                iconName: 'FileText'
            },
            {
                text: 'Privacy Policy',
                href: '/legal/privacy-policy',
                iconName: 'Lock'
            },
            {
                text: 'Risk Disclosure',
                href: '/legal/risk-disclosure',
                iconName: 'AlertTriangle'
            },
            {
                text: 'AML/KYC Policy',
                href: '/legal/aml-kyc-policy',
                iconName: 'Shield'
            }
        ]
    },
    additionalInfo: {
        heading: 'Additional Legal Information',
        sections: [
            {
                title: 'Regulatory Compliance',
                description: 'Jaaz Markets operates under strict regulatory oversight and maintains full compliance with international financial regulations. We are committed to transparency and client protection.',
                features: [
                    'Licensed financial services provider',
                    'Regular regulatory audits'
                ]
            },
            {
                title: 'Data Protection',
                description: 'We maintain the highest standards of data protection and privacy. Your personal information is handled in accordance with GDPR and other applicable privacy laws.',
                features: [
                    'GDPR compliant',
                    'Secure data handling'
                ]
            }
        ]
    },
    riskWarning: {
        title: 'Risk Warning',
        boldText: 'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.',
        description: 'You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money. Past performance is not indicative of future results. Please ensure you fully understand the risks involved and seek independent advice if necessary.'
    }
}

const ctaData = {
    heading: 'Legal Questions?',
    description: 'If you have any questions about our legal documents or need clarification on any terms, our legal team is here to help.',
    buttons: [
        {
            text: "Contact Legal Team",
            href: "/contact",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "View FAQ",
            href: "/faq",
            variant: "secondary",
            icon: "arrow"
        }
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <LegalDocuments data={legalDocumentsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
