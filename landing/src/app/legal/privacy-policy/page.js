import React from 'react'
import LegalHero from '@/components/legal/LegalHero'
import LegalContent from '@/components/legal/LegalContent'
import LegalCTA from '@/components/legal/LegalCTA'

const heroData = {
    title: 'Privacy Policy',
    subtitle: 'Your Privacy is Our Priority',
    lastUpdated: 'December 2024',
    backgroundColor: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textColor: 'text-gray-300',
    iconName: 'Lock'
}

const contentData = {
    introduction: 'Jaaz Markets LTD ("we", "our", or "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, share, and protect your information when you use our services and visit our website.',
    tableOfContents: [
        { id: 'information-we-collect', title: 'Information We Collect' },
        { id: 'how-we-use', title: 'How We Use Your Information' },
        { id: 'data-sharing', title: 'Data Sharing and Disclosure' },
        { id: 'data-security', title: 'Data Security' },
        { id: 'data-retention', title: 'Data Retention' },
        { id: 'your-rights', title: 'Your Rights' },
        { id: 'cookies', title: 'Cookies and Tracking' },
        { id: 'international-transfers', title: 'International Data Transfers' },
        { id: 'children', title: 'Children\'s Privacy' },
        { id: 'contact', title: 'Contact Information' }
    ],
    sections: [
        {
            id: 'information-we-collect',
            title: '1. Information We Collect',
            content: [
                {
                    type: 'subtitle',
                    text: '1.1 Personal Information'
                },
                {
                    type: 'paragraph',
                    text: 'When you open an account with us, we collect:'
                },
                {
                    type: 'list',
                    items: [
                        'Full name and date of birth',
                        'Residential address and country of residence',
                        'Email address and phone number',
                        'Government-issued ID (passport, driver\'s license, or national ID)',
                        'Proof of address (utility bill or bank statement)',
                        'Tax identification number',
                        'Employment status and income information',
                        'Trading experience and financial knowledge'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '1.2 Financial Information'
                },
                {
                    type: 'paragraph',
                    text: 'To process transactions, we collect:'
                },
                {
                    type: 'list',
                    items: [
                        'Bank account details',
                        'Credit/debit card information',
                        'Transaction history',
                        'Trading activity and positions',
                        'Account balance and equity'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '1.3 Technical Information'
                },
                {
                    type: 'paragraph',
                    text: 'When you use our services, we automatically collect:'
                },
                {
                    type: 'list',
                    items: [
                        'IP address and device information',
                        'Browser type and version',
                        'Operating system',
                        'Login times and session duration',
                        'Pages visited and features used',
                        'Trading platform usage data'
                    ]
                }
            ]
        },
        {
            id: 'how-we-use',
            title: '2. How We Use Your Information',
            content: [
                {
                    type: 'paragraph',
                    text: 'We use your information for the following purposes:'
                },
                {
                    type: 'subtitle',
                    text: '2.1 Service Provision'
                },
                {
                    type: 'list',
                    items: [
                        'Open and manage your trading account',
                        'Execute trading orders and transactions',
                        'Process deposits and withdrawals',
                        'Provide customer support',
                        'Send important account notifications'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '2.2 Legal and Regulatory Compliance'
                },
                {
                    type: 'list',
                    items: [
                        'Verify your identity (KYC procedures)',
                        'Prevent money laundering and fraud (AML)',
                        'Comply with regulatory reporting requirements',
                        'Respond to legal requests and court orders'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '2.3 Business Operations'
                },
                {
                    type: 'list',
                    items: [
                        'Improve our services and platform functionality',
                        'Conduct market research and analysis',
                        'Send marketing communications (with your consent)',
                        'Manage risk and detect suspicious activities'
                    ]
                }
            ]
        },
        {
            id: 'data-sharing',
            title: '3. Data Sharing and Disclosure',
            content: [
                {
                    type: 'paragraph',
                    text: 'We may share your information with:'
                },
                {
                    type: 'subtitle',
                    text: '3.1 Service Providers'
                },
                {
                    type: 'list',
                    items: [
                        'Payment processors for transaction processing',
                        'Technology providers for platform maintenance',
                        'Identity verification services',
                        'Cloud storage providers',
                        'Email and communication service providers'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '3.2 Legal and Regulatory Bodies'
                },
                {
                    type: 'list',
                    items: [
                        'Financial regulators and supervisory authorities',
                        'Law enforcement agencies',
                        'Courts and tribunals',
                        'Tax authorities'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '3.3 Business Transfers'
                },
                {
                    type: 'paragraph',
                    text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.'
                },
                {
                    type: 'warning',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800',
                    strongText: 'Note: ',
                    text: 'We never sell your personal information to third parties for marketing purposes.'
                }
            ]
        },
        {
            id: 'data-security',
            title: '4. Data Security',
            content: [
                {
                    type: 'paragraph',
                    text: 'We implement robust security measures to protect your information:'
                },
                {
                    type: 'list',
                    items: [
                        '256-bit SSL encryption for data transmission',
                        'Secure data centers with physical access controls',
                        'Regular security audits and penetration testing',
                        'Employee training on data protection',
                        'Multi-factor authentication for account access',
                        'Firewalls and intrusion detection systems'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'Despite our security measures, no system is completely secure. We encourage you to protect your account credentials and notify us immediately of any unauthorized access.'
                }
            ]
        },
        {
            id: 'data-retention',
            title: '5. Data Retention',
            content: [
                {
                    type: 'paragraph',
                    text: 'We retain your personal information for as long as necessary to:'
                },
                {
                    type: 'list',
                    items: [
                        'Provide our services to you',
                        'Comply with legal and regulatory requirements',
                        'Resolve disputes and enforce agreements',
                        'Maintain business records'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'Typically, we retain client records for a minimum of 5 years after account closure, as required by financial regulations. Some information may be retained longer if necessary for legal purposes.'
                }
            ]
        },
        {
            id: 'your-rights',
            title: '6. Your Rights',
            content: [
                {
                    type: 'paragraph',
                    text: 'You have the following rights regarding your personal data:'
                },
                {
                    type: 'grid',
                    columns: 'grid-cols-1 md:grid-cols-2',
                    items: [
                        {
                            title: 'Access',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Request a copy of your personal data we hold'
                        },
                        {
                            title: 'Correction',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Request correction of inaccurate or incomplete data'
                        },
                        {
                            title: 'Deletion',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Request deletion of your data (subject to legal requirements)'
                        },
                        {
                            title: 'Portability',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Receive your data in a structured, machine-readable format'
                        },
                        {
                            title: 'Objection',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Object to certain processing of your data'
                        },
                        {
                            title: 'Restriction',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            content: 'Request restriction of processing in certain circumstances'
                        }
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'To exercise these rights, please contact our Data Protection Officer at info@jaazmarkets.com.'
                }
            ]
        },
        {
            id: 'cookies',
            title: '7. Cookies and Tracking',
            content: [
                {
                    type: 'paragraph',
                    text: 'We use cookies and similar technologies to:'
                },
                {
                    type: 'list',
                    items: [
                        'Remember your preferences and settings',
                        'Authenticate your login sessions',
                        'Analyze website traffic and usage patterns',
                        'Improve website functionality and user experience',
                        'Deliver targeted marketing (with consent)'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'Types of Cookies We Use'
                },
                {
                    type: 'table',
                    headers: ['Type', 'Purpose', 'Duration'],
                    rows: [
                        ['Essential', 'Required for website functionality', 'Session'],
                        ['Analytics', 'Understand user behavior', '2 years'],
                        ['Preferences', 'Remember user settings', '1 year'],
                        ['Marketing', 'Deliver relevant advertisements', '90 days']
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'You can manage cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality.'
                }
            ]
        },
        {
            id: 'international-transfers',
            title: '8. International Data Transfers',
            content: [
                {
                    type: 'paragraph',
                    text: 'As an international broker, we may transfer your data to countries outside your jurisdiction for the following purposes:'
                },
                {
                    type: 'list',
                    items: [
                        'Processing transactions through global payment networks',
                        'Storing data in cloud services',
                        'Providing customer support across time zones',
                        'Complying with regulatory requirements'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and data processing agreements.'
                }
            ]
        },
        {
            id: 'children',
            title: '9. Children\'s Privacy',
            content: [
                {
                    type: 'paragraph',
                    text: 'Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.'
                }
            ]
        },
        {
            id: 'contact',
            title: '10. Contact Information',
            content: [
                {
                    type: 'paragraph',
                    text: 'If you have questions about this Privacy Policy or how we handle your data, please contact us:'
                }
            ]
        }
    ],
    contactInfo: {
        title: 'Data Protection Officer',
        description: '',
        bgColor: 'bg-gray-50',
        details: [
            '<strong>Email:</strong> info@jaazmarkets.com',
            '<strong>Phone:</strong> +1-844-694-2090',
            '<strong>Address:</strong> Jaaz Markets LTD<br>Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia'
        ]
    }
}

const ctaData = {
    heading: 'Have Questions?',
    description: 'Our team is here to help with any privacy concerns',
    backgroundColor: 'bg-gray-100',
    buttons: [
        {
            text: 'Contact Support',
            href: '/contact',
            style: 'bg-primary-orange text-white hover:bg-primary-orange/90'
        },
        {
            text: 'View All Legal Documents',
            href: '/legal',
            style: 'border-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white'
        }
    ]
}

const page = () => {
    return (
        <main>
            <LegalHero data={heroData} />
            <LegalContent data={contentData} />
            <LegalCTA data={ctaData} />
        </main>
    )
}

export default page
