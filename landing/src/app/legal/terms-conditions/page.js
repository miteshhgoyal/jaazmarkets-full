import React from 'react'
import LegalHero from '@/components/legal/LegalHero'
import LegalContent from '@/components/legal/LegalContent'
import LegalCTA from '@/components/legal/LegalCTA'

const heroData = {
    title: 'Terms & Conditions',
    subtitle: 'Your Agreement with Jaaz Markets',
    effectiveDate: 'July 1, 2025',
    lastUpdated: 'December 2024',
    backgroundColor: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textColor: 'text-gray-300',
    iconName: 'FileText'
}

const contentData = {
    companyInfo: [
        { label: 'Company Name', value: 'Jaaz Markets LTD' },
        { label: 'Registration Number', value: '2025-00595' },
        { label: 'Registered Address', value: 'Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia' },
        { label: 'Website', value: 'www.jaazmarkets.com' }
    ],
    tableOfContents: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'definitions', title: 'Definitions' },
        { id: 'services', title: 'Services' },
        { id: 'account-opening', title: 'Account Opening' },
        { id: 'trading-rules', title: 'Trading Rules' },
        { id: 'fees', title: 'Fees and Charges' },
        { id: 'risk-disclosure', title: 'Risk Disclosure' },
        { id: 'liability', title: 'Limitation of Liability' },
        { id: 'termination', title: 'Termination' },
        { id: 'governing-law', title: 'Governing Law' }
    ],
    sections: [
        {
            id: 'introduction',
            title: '1. Introduction',
            content: [
                {
                    type: 'paragraph',
                    text: 'These Terms and Conditions ("Terms") govern your use of the services provided by Jaaz Markets LTD ("Company", "we", "us", or "our"). By opening an account and using our services, you agree to be bound by these Terms.'
                },
                {
                    type: 'paragraph',
                    text: 'The Company is registered in the Comoros Union and provides online trading services in foreign exchange, contracts for difference (CFDs), and other financial instruments.'
                },
                {
                    type: 'paragraph',
                    text: 'Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you should not use our services.'
                }
            ]
        },
        {
            id: 'definitions',
            title: '2. Definitions',
            content: [
                {
                    type: 'list',
                    items: [
                        '<strong>"Account"</strong> means your trading account with Jaaz Markets LTD.',
                        '<strong>"Client"</strong> means any individual or entity that has opened an Account.',
                        '<strong>"Platform"</strong> means the MetaTrader 5 (MT5) trading platform and any other trading platforms we provide.',
                        '<strong>"Services"</strong> means all services provided by the Company, including trading services, educational resources, and customer support.',
                        '<strong>"CFD"</strong> means Contract for Difference.',
                        '<strong>"Margin"</strong> means the funds required to open and maintain a trading position.',
                        '<strong>"Leverage"</strong> means the ratio of the position value to the required margin.'
                    ]
                }
            ]
        },
        {
            id: 'services',
            title: '3. Services',
            content: [
                {
                    type: 'subtitle',
                    text: '3.1 Trading Services'
                },
                {
                    type: 'paragraph',
                    text: 'We provide execution-only services for trading in:'
                },
                {
                    type: 'list',
                    items: [
                        'Foreign Exchange (Forex)',
                        'Precious Metals (Gold, Silver)',
                        'Stock Indices',
                        'Individual Stocks',
                        'Cryptocurrencies',
                        'Commodities'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '3.2 Platform Access'
                },
                {
                    type: 'paragraph',
                    text: 'We provide access to trading platforms including MetaTrader 5 (MT5) for desktop, web, and mobile devices.'
                },
                {
                    type: 'subtitle',
                    text: '3.3 Educational Resources'
                },
                {
                    type: 'paragraph',
                    text: 'We may provide educational materials, market analysis, and trading tools. These are for informational purposes only and do not constitute investment advice.'
                }
            ]
        },
        {
            id: 'account-opening',
            title: '4. Account Opening',
            content: [
                {
                    type: 'subtitle',
                    text: '4.1 Eligibility'
                },
                {
                    type: 'paragraph',
                    text: 'To open an account, you must:'
                },
                {
                    type: 'list',
                    items: [
                        'Be at least 18 years of age',
                        'Have full legal capacity to enter into this agreement',
                        'Not be a resident of a restricted jurisdiction',
                        'Provide accurate and complete information'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '4.2 Verification'
                },
                {
                    type: 'paragraph',
                    text: 'You must provide valid identification documents and proof of address as part of our Know Your Customer (KYC) procedures. We reserve the right to request additional documentation at any time.'
                },
                {
                    type: 'subtitle',
                    text: '4.3 Account Security'
                },
                {
                    type: 'paragraph',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account.'
                }
            ]
        },
        {
            id: 'trading-rules',
            title: '5. Trading Rules',
            content: [
                {
                    type: 'subtitle',
                    text: '5.1 Order Execution'
                },
                {
                    type: 'paragraph',
                    text: 'We execute orders based on our Order Execution Policy. Market conditions may affect execution speed and pricing.'
                },
                {
                    type: 'subtitle',
                    text: '5.2 Leverage and Margin'
                },
                {
                    type: 'paragraph',
                    text: 'Leverage ratios and margin requirements vary by instrument and account type. You must maintain sufficient margin to keep positions open.'
                },
                {
                    type: 'subtitle',
                    text: '5.3 Prohibited Activities'
                },
                {
                    type: 'paragraph',
                    text: 'The following activities are prohibited:'
                },
                {
                    type: 'list',
                    items: [
                        'Market manipulation or abusive trading strategies',
                        'Use of automated trading systems without prior approval',
                        'Arbitrage trading exploiting system latencies',
                        'Any form of fraudulent or illegal activity'
                    ]
                }
            ]
        },
        {
            id: 'fees',
            title: '6. Fees and Charges',
            content: [
                {
                    type: 'paragraph',
                    text: 'You agree to pay all applicable fees and charges, including but not limited to:'
                },
                {
                    type: 'list',
                    items: [
                        'Spreads on trading instruments',
                        'Overnight financing charges (swaps)',
                        'Deposit and withdrawal fees (where applicable)',
                        'Inactivity fees after extended periods of no trading',
                        'Currency conversion fees'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'Current fees are displayed on our website and trading platform. We reserve the right to modify fees with prior notice.'
                }
            ]
        },
        {
            id: 'risk-disclosure',
            title: '7. Risk Disclosure',
            content: [
                {
                    type: 'warning',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    strongText: 'WARNING: ',
                    text: 'Trading CFDs and forex involves significant risk and can result in the loss of your entire investment. You should not invest money that you cannot afford to lose.',
                    fontWeight: 'font-semibold'
                },
                {
                    type: 'paragraph',
                    text: 'By using our services, you acknowledge that you understand and accept the risks involved in trading leveraged products. Please refer to our separate Risk Disclosure document for detailed information.'
                }
            ]
        },
        {
            id: 'liability',
            title: '8. Limitation of Liability',
            content: [
                {
                    type: 'paragraph',
                    text: 'To the maximum extent permitted by law, the Company shall not be liable for any losses, damages, or costs arising from:'
                },
                {
                    type: 'list',
                    items: [
                        'Market movements or trading losses',
                        'Technical failures or system outages beyond our control',
                        'Your failure to maintain adequate account security',
                        'Force majeure events',
                        'Actions or omissions of third parties'
                    ]
                }
            ]
        },
        {
            id: 'termination',
            title: '9. Termination',
            content: [
                {
                    type: 'paragraph',
                    text: 'Either party may terminate this agreement with written notice. Upon termination:'
                },
                {
                    type: 'list',
                    items: [
                        'All open positions will be closed',
                        'Pending orders will be cancelled',
                        'Account balance will be returned after deducting any fees owed'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'We may terminate immediately if you breach these Terms or engage in prohibited activities.'
                }
            ]
        },
        {
            id: 'governing-law',
            title: '10. Governing Law',
            content: [
                {
                    type: 'paragraph',
                    text: 'These Terms are governed by the laws of the Comoros Union. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Comoros Union.'
                },
                {
                    type: 'paragraph',
                    text: 'We encourage clients to first contact our customer support team to resolve any issues before pursuing legal action.'
                }
            ]
        }
    ],
    contactInfo: {
        title: 'Contact Us',
        description: 'If you have questions about these Terms & Conditions, please contact us:',
        bgColor: 'bg-gray-50',
        details: [
            '<strong>Email:</strong> info@jaazmarkets.com',
            '<strong>Phone:</strong> +1-844-694-2090',
            '<strong>Address:</strong> Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia'
        ]
    },
    versionHistory: [
        { version: 'Version 1.0', details: 'July 1, 2025 - Initial version' },
        { version: 'Version 1.1', details: 'December 2024 - Updated company information' }
    ]
}

const ctaData = {
    heading: 'Ready to Start Trading?',
    description: 'Open your account today and access global markets with confidence',
    backgroundColor: 'bg-gray-100',
    buttons: [
        {
            text: 'Open Live Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            style: 'bg-primary-orange text-white hover:bg-primary-orange/90'
        },
        {
            text: 'Contact Support',
            href: '/contact',
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
