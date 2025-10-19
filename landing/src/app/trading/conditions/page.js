// app/trading/conditions/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import TradingConditionsFeatures from '@/components/TradingConditionsFeatures'
import MultipleSpreadsTable from '@/components/MultipleSpreadsTable'
import TradingInstruments from '@/components/TradingInstruments'
import React from 'react'

const TradingConditionsFeaturesData = {
    heading: 'World-Class Trading Conditions',
    description: 'Maximize your trading potential with our industry-leading conditions designed for serious traders.',
    features: [
        {
            iconName: 'Zap',
            title: 'Ultra-Fast Execution',
            value: '< 50ms',
            valueColor: 'text-primary-orange',
            description: 'Average execution speed with 99.9% order success rate',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange'
        },
        {
            iconName: 'BarChart3',
            title: 'Competitive Spreads',
            value: '0.0',
            valueColor: 'text-primary-orange',
            description: 'Pips spread on EUR/USD with Raw accounts',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            iconName: 'TrendingUp',
            title: 'Flexible Leverage',
            value: 'Up to 1:1000*',
            valueColor: 'text-primary-orange',
            description: 'Maximum leverage for eligible Pro accounts',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            iconName: 'Globe',
            title: 'Trading Instruments',
            value: '100+',
            valueColor: 'text-primary-orange',
            description: 'Forex pairs, commodities, indices, and crypto',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        }
    ]
}

const MultipleSpreadsTableData = {
    heading: 'Typical Spreads',
    description: 'Example spreads across our most popular trading instruments for illustration purposes.',
    disclaimer: 'All spreads shown are typical/indicative values for illustration purposes only. Actual spreads are variable and may differ significantly based on market conditions, volatility, liquidity, and time of day. Spreads may widen during news events, market openings/closings, or periods of low liquidity.',
    tables: [
        {
            title: 'Forex Spreads',
            headers: [
                'Currency Pair',
                { title: 'Standard', color: 'text-blue-600' },
                { title: 'Raw', color: 'text-primary-orange' },
                { title: 'Pro', color: 'text-purple-600' }
            ],
            rows: [
                [
                    'EUR/USD',
                    '1.0 pips',
                    { value: '0.0 pips', className: 'text-primary-orange font-bold' },
                    { value: '-0.1 pips', className: 'text-purple-600 font-bold' }
                ],
                [
                    'GBP/USD',
                    '1.2 pips',
                    '0.1 pips',
                    '0.0 pips'
                ],
                [
                    'USD/JPY',
                    '1.0 pips',
                    '0.0 pips',
                    '-0.1 pips'
                ],
                [
                    'AUD/USD',
                    '1.5 pips',
                    '0.2 pips',
                    '0.1 pips'
                ]
            ]
        },
        {
            title: 'Commodities Spreads',
            headers: [
                'Commodity',
                { title: 'Standard', color: 'text-blue-600' },
                { title: 'Raw', color: 'text-primary-orange' },
                { title: 'Pro', color: 'text-purple-600' }
            ],
            rows: [
                [
                    'Gold',
                    '0.5 pips',
                    '0.2 pips',
                    '0.1 pips'
                ],
                [
                    'Silver',
                    '3.0 pips',
                    '2.5 pips',
                    '2.0 pips'
                ],
                [
                    'Crude Oil',
                    '4.0 pips',
                    '3.0 pips',
                    '2.5 pips'
                ]
            ]
        },
        {
            title: 'Indices Spreads',
            headers: [
                'Index',
                { title: 'Standard', color: 'text-blue-600' },
                { title: 'Raw', color: 'text-primary-orange' },
                { title: 'Pro', color: 'text-purple-600' }
            ],
            rows: [
                [
                    'US30',
                    '2.0 pts',
                    '1.5 pts',
                    '1.0 pts'
                ],
                [
                    'US500',
                    '0.8 pts',
                    '0.5 pts',
                    '0.3 pts'
                ],
                [
                    'GER30',
                    '2.0 pts',
                    '1.5 pts',
                    '1.0 pts'
                ]
            ]
        }
    ]
}

const TradingInstrumentsData = {
    heading: '100+ Trading Instruments',
    description: 'Diversify your portfolio with our comprehensive range of trading instruments across multiple asset classes.',
    instruments: [
        {
            iconName: 'DollarSign',
            title: 'Forex',
            count: '55+',
            description: 'Major, minor, and exotic currency pairs',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            iconName: 'Star',
            title: 'Commodities',
            count: '25+',
            description: 'Precious metals, energy, and agricultural products',
            iconBg: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600'
        },
        {
            iconName: 'BarChart3',
            title: 'Indices',
            count: '15+',
            description: 'Global stock market indices',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            iconName: 'Zap',
            title: 'Crypto',
            count: '10+',
            description: 'Major cryptocurrencies against USD',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        }
    ]
}

const ctaData = {
    heading: 'Experience Superior Trading Conditions',
    description: 'Start trading with industry-leading spreads and lightning-fast execution. Open your account today.',
    buttons: [
        {
            text: 'Open Live Account',
            href: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'primary',
            icon: 'user',
        },
        {
            text: 'Compare Accounts',
            href: '/trading/account-types',
            variant: 'secondary',
            icon: 'monitor',
        },
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner />
            <TradingConditionsFeatures data={TradingConditionsFeaturesData} />
            <MultipleSpreadsTable data={MultipleSpreadsTableData} />
            <TradingInstruments data={TradingInstrumentsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
