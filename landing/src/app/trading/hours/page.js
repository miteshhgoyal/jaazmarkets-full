// app/trading/hours/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import ServerTimeDisplay from '@/components/ServerTimeDisplay'
import TradingHoursTables from '@/components/TradingHoursTables'
import TradingHoursSupport from '@/components/TradingHoursSupport'
import React from 'react'

const ServerTimeDisplayData = {
    heading: 'Current Server Time',
    description: 'GMT+0 (Server Time)',
    stats: [
        {
            title: '24/5 Trading',
            description: 'Sunday 22:00 - Friday 22:00 GMT'
        },
        {
            title: 'Multiple Sessions',
            description: 'Asia, Europe, America & Pacific'
        },
        {
            title: 'Extended Hours',
            description: 'Some instruments trade beyond standard hours'
        }
    ]
}

const TradingHoursTablesData = {
    heading: 'Trading Hours by Market',
    description: 'All times are shown in GMT+0 (Greenwich Mean Time). Please note that trading hours may vary during holidays and daylight saving time changes.',
    markets: [
        {
            title: 'Forex Markets',
            subtitle: 'Major currency pairs available 24/5',
            bgColor: 'from-blue-500 to-blue-600',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            headers: ['Session', 'Open Time (GMT)', 'Close Time (GMT)', 'Status'],
            rows: [
                {
                    name: 'Sydney Session',
                    openTime: '22:00 Sunday',
                    closeTime: '07:00 Monday',
                    statusKey: 'sydney'
                },
                {
                    name: 'Tokyo Session',
                    openTime: '00:00',
                    closeTime: '09:00',
                    statusKey: 'tokyo'
                },
                {
                    name: 'London Session',
                    openTime: '08:00',
                    closeTime: '17:00',
                    statusKey: 'london'
                },
                {
                    name: 'New York Session',
                    openTime: '13:00',
                    closeTime: '22:00 Friday',
                    statusKey: 'newyork'
                }
            ]
        },
        {
            title: 'Global Indices',
            subtitle: 'Stock indices from major exchanges',
            bgColor: 'from-purple-500 to-purple-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            headers: ['Index', 'Symbol', 'Trading Hours (GMT)', 'Status'],
            rows: [
                {
                    name: 'S&P 500',
                    symbol: 'US500',
                    hours: '14:30 - 21:00',
                    statusKey: 'usStocks'
                },
                {
                    name: 'NASDAQ',
                    symbol: 'US100',
                    hours: '14:30 - 21:00',
                    statusKey: 'usStocks'
                },
                {
                    name: 'FTSE 100',
                    symbol: 'UK100',
                    hours: '08:00 - 16:30',
                    status: 'Active'
                },
                {
                    name: 'DAX',
                    symbol: 'GER40',
                    hours: '07:00 - 21:00',
                    status: 'Active'
                },
                {
                    name: 'Nikkei 225',
                    symbol: 'JPN225',
                    hours: '00:00 - 06:00, 07:30 - 14:00',
                    status: 'Break'
                }
            ]
        },
        {
            title: 'Commodities & Metals',
            subtitle: 'Energy, precious metals, and agricultural products',
            bgColor: 'from-yellow-500 to-yellow-600',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 10l3-3 3 3',
            headers: ['Commodity', 'Symbol', 'Trading Hours (GMT)', 'Status'],
            rows: [
                {
                    name: 'Gold',
                    symbol: 'XAUUSD',
                    hours: '22:00 Sun - 21:00 Fri',
                    status: 'Active'
                },
                {
                    name: 'Silver',
                    symbol: 'XAGUSD',
                    hours: '22:00 Sun - 21:00 Fri',
                    status: 'Active'
                },
                {
                    name: 'Crude Oil',
                    symbol: 'USOIL',
                    hours: '23:00 Sun - 22:00 Fri',
                    status: 'Inactive'
                },
                {
                    name: 'Natural Gas',
                    symbol: 'NATGAS',
                    hours: '23:00 Sun - 22:00 Fri',
                    status: 'Inactive'
                }
            ]
        },
        {
            title: 'Cryptocurrencies',
            subtitle: 'Digital assets available 24/7',
            bgColor: 'from-orange-500 to-red-600',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            headers: ['Cryptocurrency', 'Symbol', 'Trading Hours', 'Status'],
            rows: [
                {
                    name: 'Bitcoin',
                    symbol: 'BTCUSD',
                    hours: '24/7',
                    status: 'Always Open'
                },
                {
                    name: 'Ethereum',
                    symbol: 'ETHUSD',
                    hours: '24/7',
                    status: 'Always Open'
                },
                {
                    name: 'Ripple',
                    symbol: 'XRPUSD',
                    hours: '24/7',
                    status: 'Always Open'
                },
                {
                    name: 'Litecoin',
                    symbol: 'LTCUSD',
                    hours: '24/7',
                    status: 'Always Open'
                }
            ]
        }
    ]
}

const TradingHoursSupportData = {
    heading: 'Need Help with Trading Hours?',
    description: 'Our support team is available 24/5 to help you understand market hours, trading sessions, and optimal trading times for your strategy.',
    supportFeatures: [
        {
            title: '24/5 Support',
            description: 'Get assistance whenever markets are open, across all time zones.',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Live Chat & Phone',
            description: 'Multiple contact options for quick resolution of your queries.',
            icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
        },
        {
            title: 'Trading Guides',
            description: 'Access comprehensive guides on optimal trading times and market sessions.',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        }
    ],
    buttonText: 'Contact Support',
    buttonHref: '/contact',
    platformInfo: {
        title: 'Global Market Access',
        description: 'Trade across multiple time zones with extended market hours'
    }
}

const ctaData = {
    heading: 'Ready to Trade 24/5?',
    description: 'Access global markets across all time zones with competitive spreads and professional execution.',
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
            <ServerTimeDisplay data={ServerTimeDisplayData} />
            <TradingHoursTables data={TradingHoursTablesData} />
            <TradingHoursSupport data={TradingHoursSupportData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
