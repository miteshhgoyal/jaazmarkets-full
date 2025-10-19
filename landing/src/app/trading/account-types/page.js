// app/trading/account-types/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import AccountTypesComparison from '@/components/AccountTypesComparison'
import DetailedComparisonTable from '@/components/DetailedComparisonTable'
import React from 'react'

const AccountTypesComparisonData = {
    heading: 'Find Your Perfect Account Type',
    description: 'Compare our three account types and choose the one that best suits your trading goals and experience level.',
    disclaimer: 'All spreads, commissions, and leverage ratios shown are typical/indicative values for illustration purposes only. Actual trading conditions may vary based on market conditions, account equity, and regulatory requirements. Minimum deposits are subject to change. Trading conditions are subject to modification without prior notice.',
    accounts: [
        {
            name: 'Standard Account',
            subtitle: 'Perfect for beginners and casual traders',
            price: '$100',
            priceLabel: 'Minimum deposit',
            priceColor: 'text-primary-orange',
            iconName: 'User',
            iconBg: 'bg-blue-100/30',
            iconColor: 'text-blue-600',
            features: [
                { label: 'Spreads from', value: '1.0 pips' },
                { label: 'Commission', value: '$0' },
                { label: 'Max Leverage', value: '1:500' },
                { label: 'Min Lot Size', value: '0.01' }
            ],
            benefits: [
                'No commission trading',
                'All trading platforms',
                '24/7 customer support',
                'Educational resources'
            ],
            buttonText: 'Open Standard Account',
            buttonHref: 'https://client.jaazmarkets.com/account?tab=register',
            buttonColor: 'border-blue-600',
            buttonTextColor: 'text-blue-600',
            buttonHoverBg: 'bg-blue-600'
        },
        {
            name: 'Raw Account',
            subtitle: 'Ideal for active traders',
            price: '$500',
            priceLabel: 'Minimum deposit',
            priceColor: 'text-primary-orange',
            iconName: 'Zap',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            featured: true,
            badge: 'Most Popular',
            features: [
                { label: 'Spreads from', value: '0.0 pips', valueClass: 'font-semibold text-primary-orange' },
                { label: 'Commission', value: '$3.50/lot' },
                { label: 'Max Leverage', value: '1:500' },
                { label: 'Min Lot Size', value: '0.01' }
            ],
            benefits: [
                'Institutional spreads',
                'Ultra-fast execution',
                'Priority customer support',
                'Advanced trading tools'
            ],
            buttonText: 'Open Raw Account',
            buttonHref: 'https://client.jaazmarkets.com/account?tab=register'
        },
        {
            name: 'Pro Account',
            subtitle: 'For professional traders',
            price: '$10,000',
            priceLabel: 'Minimum deposit',
            priceColor: 'text-primary-orange',
            iconName: 'Star',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            features: [
                { label: 'Spreads from', value: '-0.1 pips', valueClass: 'font-semibold text-purple-600' },
                { label: 'Commission', value: '$2.50/lot' },
                { label: 'Max Leverage', value: '1:1000', valueClass: 'font-semibold text-purple-600' },
                { label: 'Min Lot Size', value: '0.01' }
            ],
            benefits: [
                'Negative spread rebates',
                'Dedicated account manager',
                'VIP trading conditions',
                'Exclusive market analysis'
            ],
            buttonText: 'Open Pro Account',
            buttonHref: 'https://client.jaazmarkets.com/account?tab=register',
            buttonColor: 'border-purple-600',
            buttonTextColor: 'text-purple-600',
            buttonHoverBg: 'bg-purple-600'
        }
    ]
}

const DetailedComparisonData = {
    heading: 'Detailed Comparison',
    description: 'Compare all account features side by side to make the best choice for your trading needs.',
    tableHeaders: [
        'Feature',
        { title: 'Standard', color: 'text-blue-600' },
        { title: 'Raw', color: 'text-primary-orange' },
        { title: 'Pro', color: 'text-purple-600' }
    ],
    tableRows: [
        [
            'Minimum Deposit',
            '$100',
            '$500',
            '$10,000'
        ],
        [
            'EUR/USD Spread',
            '1.0 pips',
            { value: '0.0 pips', className: 'text-primary-orange font-bold' },
            { value: '-0.1 pips', className: 'text-purple-600 font-bold' }
        ],
        [
            'Commission',
            '$0',
            '$3.50/lot',
            '$2.50/lot'
        ],
        [
            'Maximum Leverage',
            '1:500',
            '1:500',
            { value: '1:1000', className: 'text-purple-600 font-bold' }
        ],
        [
            'Minimum Lot Size',
            '0.01',
            '0.01',
            '0.01'
        ],
        [
            'Expert Advisors',
            { icon: 'M5 13l4 4L19 7', color: 'text-green-500' },
            { icon: 'M5 13l4 4L19 7', color: 'text-green-500' },
            { icon: 'M5 13l4 4L19 7', color: 'text-green-500' }
        ],
        [
            'Dedicated Account Manager',
            { icon: 'M6 18L18 6M6 6l12 12', color: 'text-red-500' },
            { icon: 'M6 18L18 6M6 6l12 12', color: 'text-red-500' },
            { icon: 'M5 13l4 4L19 7', color: 'text-green-500' }
        ]
    ],
    disclaimer: '* All trading conditions shown are indicative and subject to change based on market conditions and regulatory requirements. Leverage availability depends on client classification and regulatory jurisdiction.'
}

const ctaData = {
    heading: 'Ready to Start Trading?',
    description: 'Choose your account type and join thousands of traders who trust our platform for their trading success.',
    buttons: [
        {
            text: 'Open Live Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'primary',
            icon: 'user',
        },
        {
            text: 'Try Demo Account',
            href: '/demo',
            variant: 'secondary',
            icon: 'monitor',
        },
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner />
            <AccountTypesComparison data={AccountTypesComparisonData} />
            <DetailedComparisonTable data={DetailedComparisonData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
