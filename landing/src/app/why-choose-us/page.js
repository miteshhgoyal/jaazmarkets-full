import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import PlatformFeatures from '@/components/PlatformFeatures'
import AwardsSection from '@/components/company/AwardsSection'
import ComparisonTable from '@/components/company/ComparisonTable'
import ClientSuccessStats from '@/components/company/ClientSuccessStats'
import React from 'react'

const PlatformFeaturesData = {
    heading: 'What Sets Us Apart',
    description: 'Discover the competitive advantages that make Jaaz Markets the trusted choice for serious traders.',
    features: [
        {
            title: 'Lightning Fast Execution',
            description: 'Execute trades in under 50ms with our advanced infrastructure and optimized trading servers.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            benefits: ['Average execution: 47ms', '99.9% order success rate', 'No requotes or slippage']
        },
        {
            title: 'Unbeatable Spreads',
            description: 'Trade with some of the tightest spreads in the industry, maximizing your profit potential.',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            benefits: ['EUR/USD from 0.0 pips', 'GBP/USD from 0.1 pips', 'Gold from 0.2 pips']
        },
        {
            title: 'Cutting-Edge Technology',
            description: 'Trade with the latest MT5 platform featuring advanced charting tools and automated trading.',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            benefits: ['Full MT5 functionality', 'Expert Advisors support', 'Advanced charting tools']
        },
        {
            title: 'Fully Regulated',
            description: 'Trade with confidence knowing your funds are protected by top-tier regulation and segregated accounts.',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            benefits: ['FCA regulated', 'Segregated client funds', 'Investor compensation']
        },
        {
            title: '24/7 Expert Support',
            description: 'Get immediate assistance from our multilingual support team whenever you need it.',
            bgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
            benefits: ['24/7 live chat', 'Multilingual support', 'Dedicated account managers']
        },
        {
            title: 'Instant Funding',
            description: 'Fund your account instantly with multiple payment methods and start trading immediately.',
            bgColor: 'bg-teal-100',
            iconColor: 'text-teal-600',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            benefits: ['Instant deposits', 'Same-day withdrawals', 'Multiple payment methods']
        }
    ]
}

// Award Section Data
const awardsData = {
    heading: {
        start: 'Industry',
        highlight: 'Recognition'
    },
    description: 'Our commitment to excellence has been recognized by leading industry bodies and publications.',
    awards: [
        {
            title: 'Best Execution',
            source: 'Forex Industry Awards 2023',
            iconName: 'Star',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Most Trusted Broker',
            source: 'Trading Excellence 2023',
            iconName: 'CheckCircle',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Fastest Growing',
            source: 'FinTech Breakthrough 2023',
            iconName: 'Zap',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            title: 'Best Education',
            source: 'Global Forex Awards 2023',
            iconName: 'BookOpen',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        }
    ]
}

// Comparison Table Data
const comparisonData = {
    heading: {
        start: 'See How We',
        highlight: 'Compare'
    },
    description: 'Compare Jaaz Markets against other leading brokers and see why we stand out.',
    features: [
        {
            name: 'Minimum Spread (EUR/USD)',
            us: { type: 'text', value: '0.0 pips' },
            competitorA: { type: 'text', value: '0.6 pips' },
            competitorB: { type: 'text', value: '0.8 pips' }
        },
        {
            name: 'Execution Speed',
            us: { type: 'text', value: '< 50ms' },
            competitorA: { type: 'text', value: '200ms' },
            competitorB: { type: 'text', value: '150ms' }
        },
        {
            name: '24/7 Support',
            us: { type: 'boolean', value: true },
            competitorA: { type: 'boolean', value: false },
            competitorB: { type: 'boolean', value: true }
        },
        {
            name: 'Instant Withdrawals',
            us: { type: 'boolean', value: true },
            competitorA: { type: 'boolean', value: false },
            competitorB: { type: 'boolean', value: false }
        },
        {
            name: 'Regulation',
            us: { type: 'text', value: 'FCA' },
            competitorA: { type: 'text', value: 'CySEC' },
            competitorB: { type: 'text', value: 'ASIC' }
        }
    ]
}

// Client Success Stats Data
const clientStatsData = {
    heading: {
        start: 'Trusted by',
        highlight: 'Traders Worldwide'
    },
    description: 'Our numbers speak for themselves. Join thousands of successful traders who have chosen Jaaz Markets.',
    stats: [
        {
            value: '50,000+',
            title: 'Active Traders',
            description: 'Trusted by traders worldwide'
        },
        {
            value: '$2.5B+',
            title: 'Monthly Volume',
            description: 'In trading volume processed'
        },
        {
            value: '99.9%',
            title: 'Uptime',
            description: 'Platform reliability'
        },
        {
            value: '< 1 min',
            title: 'Withdrawal Time',
            description: 'Average processing time'
        }
    ]
}


const page = () => {
    return (
        <main>
            <StartTradingBanner />
            <PlatformFeatures data={PlatformFeaturesData} />
            <AwardsSection data={awardsData} />
            <ComparisonTable data={comparisonData} />
            <ClientSuccessStats data={clientStatsData} />
            <StartTradingCTA />
        </main>
    )
}

export default page
