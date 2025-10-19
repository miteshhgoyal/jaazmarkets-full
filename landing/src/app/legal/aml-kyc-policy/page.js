import React from 'react'
import LegalHero from '@/components/legal/LegalHero'
import LegalContent from '@/components/legal/LegalContent'
import LegalCTA from '@/components/legal/LegalCTA'

const heroData = {
    title: 'AML/KYC Policy',
    subtitle: 'Anti-Money Laundering & Know Your Customer',
    lastUpdated: 'Our Commitment to Financial Security',
    backgroundColor: 'bg-gradient-to-br from-gray-900 to-gray-800',
    textColor: 'text-gray-300',
    iconName: 'Shield'
}

const contentData = {
    introduction: 'Jaaz Markets LTD is committed to preventing money laundering, terrorist financing, and other financial crimes. This Anti-Money Laundering (AML) and Know Your Customer (KYC) Policy outlines our procedures for client identification, verification, and ongoing monitoring. We maintain a zero-tolerance approach to money laundering and strictly comply with all applicable laws and regulations in the jurisdictions where we operate.',
    tableOfContents: [
        { id: 'introduction', title: 'Introduction and Legal Framework' },
        { id: 'kyc-procedures', title: 'KYC Procedures' },
        { id: 'customer-due-diligence', title: 'Customer Due Diligence' },
        { id: 'ongoing-monitoring', title: 'Ongoing Monitoring' },
        { id: 'suspicious-activities', title: 'Suspicious Activity Reporting' },
        { id: 'record-keeping', title: 'Record Keeping' },
        { id: 'sanctions-screening', title: 'Sanctions Screening' },
        { id: 'training', title: 'Training and Compliance' },
        { id: 'client-obligations', title: 'Client Obligations' },
        { id: 'consequences', title: 'Consequences of Non-Compliance' }
    ],
    sections: [
        {
            id: 'introduction',
            title: '1. Introduction and Legal Framework',
            content: [
                {
                    type: 'paragraph',
                    text: 'This policy is designed to ensure compliance with international AML/CFT standards and the laws of the Comoros Union where Jaaz Markets LTD is registered.'
                },
                {
                    type: 'subtitle',
                    text: '1.1 Purpose'
                },
                {
                    type: 'list',
                    items: [
                        'Prevent the use of our services for money laundering or terrorist financing',
                        'Protect our reputation and maintain the integrity of financial markets',
                        'Comply with legal and regulatory requirements',
                        'Detect and report suspicious activities'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '1.2 Definitions'
                },
                {
                    type: 'list',
                    items: [
                        '<strong>Money Laundering:</strong> The process of making illegally-gained proceeds appear legal',
                        '<strong>Terrorist Financing:</strong> Providing financial support to terrorist activities',
                        '<strong>KYC:</strong> Know Your Customer - procedures to verify client identity',
                        '<strong>CDD:</strong> Customer Due Diligence - assessment of money laundering risks',
                        '<strong>PEP:</strong> Politically Exposed Person - individuals with prominent public functions'
                    ]
                }
            ]
        },
        {
            id: 'kyc-procedures',
            title: '2. KYC Procedures',
            content: [
                {
                    type: 'subtitle',
                    text: '2.1 Account Opening Requirements'
                },
                {
                    type: 'paragraph',
                    text: 'All clients must provide the following information:'
                },
                {
                    type: 'grid',
                    columns: 'grid-cols-1 md:grid-cols-2',
                    items: [
                        {
                            title: 'Individual Clients',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            list: [
                                'Full legal name',
                                'Date and place of birth',
                                'Current residential address',
                                'Nationality and tax residence',
                                'Contact information',
                                'Employment status and income source'
                            ]
                        },
                        {
                            title: 'Corporate Clients',
                            bgColor: 'bg-gray-50',
                            titleColor: 'text-gray-900',
                            textColor: 'text-gray-700',
                            list: [
                                'Company name and registration number',
                                'Registered address',
                                'Business nature and activities',
                                'Directors and beneficial owners',
                                'Financial statements',
                                'Corporate structure'
                            ]
                        }
                    ]
                },
                {
                    type: 'subtitle',
                    text: '2.2 Identity Verification Documents'
                },
                {
                    type: 'warning',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border border-yellow-200',
                    textColor: 'text-yellow-800',
                    strongText: 'Important: ',
                    text: 'All documents must be valid, clearly readable, and show all four corners of the document.'
                },
                {
                    type: 'paragraph',
                    text: '<strong>Acceptable Identity Documents:</strong>'
                },
                {
                    type: 'list',
                    items: [
                        'Valid passport (preferred)',
                        'National identity card (both sides)',
                        'Driver\'s license (if includes photo and date of birth)'
                    ]
                },
                {
                    type: 'paragraph',
                    text: '<strong>Acceptable Proof of Address (dated within 3 months):</strong>'
                },
                {
                    type: 'list',
                    items: [
                        'Utility bill (electricity, water, gas)',
                        'Bank statement',
                        'Government-issued document',
                        'Tenancy agreement'
                    ]
                }
            ]
        },
        {
            id: 'customer-due-diligence',
            title: '3. Customer Due Diligence (CDD)',
            content: [
                {
                    type: 'subtitle',
                    text: '3.1 Risk Assessment'
                },
                {
                    type: 'paragraph',
                    text: 'We assess each client\'s risk level based on:'
                },
                {
                    type: 'list',
                    items: [
                        'Geographic location and country of residence',
                        'Nature of business or employment',
                        'Expected transaction volume and frequency',
                        'Source of funds and wealth',
                        'PEP status or association with PEPs'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '3.2 Enhanced Due Diligence (EDD)'
                },
                {
                    type: 'paragraph',
                    text: 'Enhanced measures apply to high-risk clients, including:'
                },
                {
                    type: 'list',
                    items: [
                        'Additional documentation requirements',
                        'Source of wealth verification',
                        'More frequent account reviews',
                        'Senior management approval for account opening',
                        'Restricted transaction limits until full verification'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '3.3 Simplified Due Diligence'
                },
                {
                    type: 'paragraph',
                    text: 'Simplified measures may apply to low-risk clients from well-regulated jurisdictions, subject to regulatory approval.'
                }
            ]
        },
        {
            id: 'ongoing-monitoring',
            title: '4. Ongoing Monitoring',
            content: [
                {
                    type: 'paragraph',
                    text: 'We continuously monitor client accounts for:'
                },
                {
                    type: 'grid',
                    columns: 'grid-cols-1 md:grid-cols-2',
                    items: [
                        {
                            title: 'Transaction Monitoring',
                            bgColor: 'bg-blue-50',
                            titleColor: 'text-blue-900',
                            textColor: 'text-blue-800',
                            list: [
                                'Unusual transaction patterns',
                                'Large or frequent deposits/withdrawals',
                                'Transactions inconsistent with client profile',
                                'Round number transactions'
                            ]
                        },
                        {
                            title: 'Account Monitoring',
                            bgColor: 'bg-blue-50',
                            titleColor: 'text-blue-900',
                            textColor: 'text-blue-800',
                            list: [
                                'Dormant account reactivation',
                                'Multiple account relationships',
                                'Frequent changes to account details',
                                'Login from unusual locations'
                            ]
                        }
                    ]
                },
                {
                    type: 'subtitle',
                    text: '4.1 Periodic Reviews'
                },
                {
                    type: 'paragraph',
                    text: 'Account reviews are conducted based on risk level:'
                },
                {
                    type: 'list',
                    items: [
                        '<strong>High Risk:</strong> Every 6 months',
                        '<strong>Medium Risk:</strong> Annually',
                        '<strong>Low Risk:</strong> Every 2 years'
                    ]
                }
            ]
        },
        {
            id: 'suspicious-activities',
            title: '5. Suspicious Activity Reporting',
            content: [
                {
                    type: 'subtitle',
                    text: '5.1 Red Flags'
                },
                {
                    type: 'paragraph',
                    text: 'Examples of suspicious activities include:'
                },
                {
                    type: 'list',
                    items: [
                        'Client reluctant to provide KYC information',
                        'Use of falsified or suspicious documents',
                        'Unusual concern about compliance procedures',
                        'Deposits followed by immediate withdrawal requests',
                        'Trading patterns suggesting market manipulation',
                        'Third-party funding without clear relationship'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '5.2 Reporting Procedures'
                },
                {
                    type: 'warning',
                    bgColor: 'bg-red-50',
                    borderColor: 'border border-red-200',
                    textColor: 'text-red-800',
                    strongText: 'Important: ',
                    text: 'Staff must report suspicious activities immediately to the Compliance Officer. Client tipping-off is strictly prohibited.'
                }
            ]
        },
        {
            id: 'record-keeping',
            title: '6. Record Keeping',
            content: [
                {
                    type: 'paragraph',
                    text: 'We maintain comprehensive records including:'
                },
                {
                    type: 'list',
                    items: [
                        'All KYC documentation and verification records',
                        'Transaction records and account statements',
                        'Correspondence with clients',
                        'Internal suspicious activity reports',
                        'Risk assessment documentation'
                    ]
                },
                {
                    type: 'paragraph',
                    text: '<strong>Retention Period:</strong> All records are retained for a minimum of 5 years after the termination of the business relationship or completion of the transaction.'
                }
            ]
        },
        {
            id: 'sanctions-screening',
            title: '7. Sanctions Screening',
            content: [
                {
                    type: 'paragraph',
                    text: 'We screen all clients against:'
                },
                {
                    type: 'list',
                    items: [
                        'UN Security Council Sanctions List',
                        'EU Consolidated Sanctions List',
                        'OFAC Specially Designated Nationals List',
                        'Local sanctions lists',
                        'PEP databases',
                        'Adverse media databases'
                    ]
                },
                {
                    type: 'paragraph',
                    text: 'Screening is performed at account opening and regularly thereafter. Positive matches result in account restrictions pending investigation.'
                }
            ]
        },
        {
            id: 'training',
            title: '8. Training and Compliance',
            content: [
                {
                    type: 'subtitle',
                    text: '8.1 Staff Training'
                },
                {
                    type: 'paragraph',
                    text: 'All employees receive:'
                },
                {
                    type: 'list',
                    items: [
                        'Initial AML/KYC training upon joining',
                        'Annual refresher training',
                        'Updates on regulatory changes',
                        'Role-specific compliance training'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '8.2 Compliance Monitoring'
                },
                {
                    type: 'paragraph',
                    text: 'Our Compliance Officer conducts regular audits to ensure policy adherence and effectiveness. Any deficiencies are promptly addressed.'
                }
            ]
        },
        {
            id: 'client-obligations',
            title: '9. Client Obligations',
            content: [
                {
                    type: 'paragraph',
                    text: 'Clients must:'
                },
                {
                    type: 'list',
                    items: [
                        'Provide accurate and complete information',
                        'Submit genuine documents for verification',
                        'Update information when circumstances change',
                        'Cooperate with periodic reviews',
                        'Explain unusual transactions when requested',
                        'Not use accounts for illegal activities'
                    ]
                },
                {
                    type: 'warning',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border border-yellow-200',
                    textColor: 'text-yellow-800',
                    strongText: 'Note: ',
                    text: 'Failure to comply with these obligations may result in account restrictions or closure.'
                }
            ]
        },
        {
            id: 'consequences',
            title: '10. Consequences of Non-Compliance',
            content: [
                {
                    type: 'subtitle',
                    text: '10.1 Account Restrictions'
                },
                {
                    type: 'paragraph',
                    text: 'We may impose the following restrictions:'
                },
                {
                    type: 'list',
                    items: [
                        'Freeze account pending investigation',
                        'Restrict deposits or withdrawals',
                        'Limit trading activities',
                        'Require additional documentation',
                        'Close positions and return funds'
                    ]
                },
                {
                    type: 'subtitle',
                    text: '10.2 Reporting to Authorities'
                },
                {
                    type: 'paragraph',
                    text: 'We are legally obligated to report suspicious activities to relevant authorities without notifying the client. This may result in:'
                },
                {
                    type: 'list',
                    items: [
                        'Investigation by law enforcement',
                        'Asset freezing orders',
                        'Criminal prosecution',
                        'Permanent exclusion from financial services'
                    ]
                }
            ]
        }
    ],
    contactInfo: {
        title: 'Compliance Contact',
        description: 'For questions about our AML/KYC procedures or to report concerns:',
        bgColor: 'bg-blue-50',
        details: [
            '<strong>Compliance Officer</strong>',
            '<strong>Email:</strong> info@jaazmarkets.com',
            '<strong>Phone:</strong> +1-844-694-2090',
            '<strong>Address:</strong> Jaaz Markets LTD<br>Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia'
        ]
    },
    versionHistory: [
        { version: 'Version 1.0', details: 'July 2025 - Initial policy' },
        { version: 'Last Review', details: 'December 2024' },
        { version: 'Next Review', details: 'December 2025' }
    ]
}

const ctaData = {
    heading: 'Complete Your Verification',
    description: 'Start trading by completing our secure KYC process',
    backgroundColor: 'bg-gray-100',
    buttons: [
        {
            text: 'Open Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
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
