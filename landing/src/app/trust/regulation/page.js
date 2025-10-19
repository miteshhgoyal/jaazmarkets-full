// app/trust/regulation/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import RegulatoryCompliance from '@/components/RegulatoryCompliance'
import RegulatoryLicenses from '@/components/RegulatoryLicenses'
import ClientProtection from '@/components/ClientProtection'
import RegulatoryReporting from '@/components/RegulatoryReporting'
import React from 'react'

const bannerProps = {

    buttons: [
        {
            text: "Open Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "View Licenses",
            link: "/licenses",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const RegulatoryComplianceData = {
    heading: 'Regulatory Compliance',
    description: 'We adhere to the highest regulatory standards to protect your interests and ensure fair trading conditions.',
    features: [
        {
            iconName: 'Shield',
            title: 'Client Fund Protection',
            description: 'Segregated accounts ensure your funds are protected and separate from company assets',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            iconName: 'Lock',
            title: 'Negative Balance Protection',
            description: 'Never lose more than your account balance with our negative balance protection',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            iconName: 'Target',
            title: 'Data Protection',
            description: 'Your personal and financial data is protected with industry-standard encryption',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange'
        },
        {
            iconName: 'CheckCircle',
            title: 'Regular Audits',
            description: 'Independent audits ensure compliance and financial transparency',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        }
    ]
}

const RegulatoryLicensesData = {
    heading: 'Our Regulatory License',
    description: 'Jaaz Markets LTD operates under regulatory oversight to ensure transparent and secure trading services.',
    licenses: [
        {
            title: 'Comoros Union Registration',
            subtitle: 'Island of Mohéli - Comoros Union',
            shortName: 'KM',
            bgColor: 'bg-blue-100 /30',
            textColor: 'text-blue-600',
            details: [
                { label: 'Company Name:', value: 'Jaaz Markets LTD' },
                { label: 'Registration Number:', value: '2025-00595' },
                { label: 'Status:', value: 'Active', valueClass: 'text-green-600' },
                { label: 'Registered Office:', value: 'Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia' },
                { label: 'Jurisdiction:', value: 'Island of Mohéli' }
            ],
            features: [
                'Registered Company',
                'Client Fund Segregation',
                'Transparent Operations'
            ]
        }
    ]
}

const ClientProtectionData = {
    heading: 'What This Means For You',
    description: 'Our regulatory compliance provides you with multiple layers of protection and peace of mind when trading.',
    sections: [
        {
            title: 'Fund Security',
            checkBg: 'bg-green-100 /30',
            checkColor: 'text-green-600',
            protections: [
                {
                    title: 'Segregated Accounts',
                    description: 'Your funds are held in segregated accounts, separate from company operational funds, ensuring they cannot be used for any other purpose.'
                },
                {
                    title: 'Tier 1 Banks',
                    description: 'Client funds are deposited with top-rated financial institutions, providing an additional layer of security.'
                },
                {
                    title: 'Insurance Coverage',
                    description: 'Professional indemnity and civil liability insurance provide additional protection for client assets.'
                }
            ]
        },
        {
            title: 'Trading Protection',
            checkBg: 'bg-blue-100 /30',
            checkColor: 'text-blue-600',
            protections: [
                {
                    title: 'Fair Execution',
                    description: 'Best execution policies ensure you receive fair pricing and transparent order execution at all times.'
                },
                {
                    title: 'Dispute Resolution',
                    description: 'Access to independent dispute resolution services and regulatory complaint procedures.'
                },
                {
                    title: 'Negative Balance Protection',
                    description: 'Retail clients are protected from negative balances, ensuring you can never lose more than your account balance.'
                }
            ]
        }
    ]
}

const RegulatoryReportingData = {
    heading: 'Transparency & Reporting',
    description: 'We maintain the highest standards of transparency through regular reporting and independent audits.',
    reports: [
        {
            title: 'Financial Reports',
            description: 'Annual audited financial statements published by independent auditors',
            linkText: 'View Reports',
            link: '#',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
            title: 'Regulatory Filings',
            description: 'Regular submissions to regulatory authorities demonstrating compliance',
            linkText: 'View Filings',
            link: '#',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
            title: 'Risk Disclosures',
            description: 'Comprehensive risk warnings and disclosures for informed trading decisions',
            linkText: 'View Disclosures',
            link: '/legal',
            bgColor: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        }
    ]
}

const ctaData = {
    heading: 'Trade with Confidence',
    description: 'Start trading today knowing your funds are protected by multiple regulatory frameworks and industry-leading security measures.',
    buttons: [
        {
            text: 'Open Protected Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'primary',
            icon: 'user',
        },
        {
            text: 'Contact Compliance',
            href: '/contact',
            variant: 'secondary',
            icon: 'monitor',
        },
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <RegulatoryCompliance data={RegulatoryComplianceData} />
            <RegulatoryLicenses data={RegulatoryLicensesData} />
            <ClientProtection data={ClientProtectionData} />
            <RegulatoryReporting data={RegulatoryReportingData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
