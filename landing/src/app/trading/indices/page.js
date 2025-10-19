import React from 'react';
import TradingFeatures from '@/components/TradingFeatures';
import TradingCategories from '@/components/TradingCategories';
import TradingSpreadsTable from '@/components/TradingSpreadsTable';
import TradingExample from '@/components/TradingExample';
import StartTradingBanner from '@/components/StartTradingBanner';
import StartTradingCTA from '@/components/StartTradingCTA';

export default function IndicesPage() {

    const indicesFeaturesData = {
        heading: "Why Trade Indices with Jaaz?",
        description: "Indices represent the performance of a group of stocks from a particular exchange, providing diversified exposure to entire markets.",
        features: [
            {
                iconName: 'BarChart3',
                title: '40+ Global Indices',
                desc: 'Access major indices from US, European, Asian, and emerging markets.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'TrendingUp',
                title: 'Diversification',
                desc: 'Gain exposure to entire markets without buying individual stocks.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'DollarSign',
                title: 'Competitive Spreads',
                desc: 'Trade with tight spreads starting from 0.4 points on major indices.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'Zap',
                title: 'Extended Hours',
                desc: 'Trade indices across different time zones for extended market exposure.',
                iconBg: 'from-primary-orange to-orange-600'
            },
        ],
    };

    const indicesCategoriesData = {
        heading: "Major Index Categories",
        description: "Trade the world's most popular stock indices across different regions and sectors.",
        categories: [
            {
                title: 'US Indices',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>`,
                colorClass: 'bg-blue-500',
                description: 'Trade major US stock indices including S&P 500, NASDAQ, and Dow Jones.',
                stocks: ['S&P 500 (US500)', 'NASDAQ (US100)', 'Dow Jones (US30)'],
            },
            {
                title: 'European Indices',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path></svg>`,
                colorClass: 'bg-green-500',
                description: 'Access major European markets including FTSE, DAX, and CAC indices.',
                stocks: ['FTSE 100 (UK100)', 'DAX (GER40)', 'CAC 40 (FRA40)'],
            },
            {
                title: 'Asian Indices',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
                colorClass: 'bg-purple-500',
                description: 'Trade Asian markets including Nikkei, Hang Seng, and ASX indices.',
                stocks: ['Nikkei 225 (JPN225)', 'Hang Seng (HK50)', 'ASX 200 (AUS200)'],
            }
        ],
    };

    const indicesSpreadsData = {
        heading: "Competitive Index Spreads",
        description: "Trade the world's most popular indices with some of the tightest spreads in the industry.",
        tableHeaders: ["Index", "Symbol", "Typical Spread", "Max Leverage"],
        tableRows: [
            {
                index: 'S&P 500',
                symbol: 'US500',
                spread: '0.4 pts',
                leverage: '1:200',
            },
            {
                index: 'NASDAQ',
                symbol: 'US100',
                spread: '1.0 pts',
                leverage: '1:200',
            },
            {
                index: 'DAX',
                symbol: 'GER40',
                spread: '1.0 pts',
                leverage: '1:200',
            },
            {
                index: 'FTSE 100',
                symbol: 'UK100',
                spread: '1.5 pts',
                leverage: '1:200',
            },
            {
                index: 'Nikkei 225',
                symbol: 'JPN225',
                spread: '6.0 pts',
                leverage: '1:200',
            }
        ],
        disclaimer: "The spreads and leverage ratios shown above are typical/indicative values for illustration purposes only. Actual spreads may vary based on market conditions, volatility, liquidity, and time of day. Spreads may widen significantly during major news events, market openings, or periods of low liquidity. Leverage availability is subject to regulatory restrictions. Trading conditions are subject to change without notice.",
        buttonText: "View All Specifications",
        buttonHref: "/tools/specifications"
    };

    const indicesTradingExampleData = {
        heading: "Index Trading Example",
        description: "See how index trading works with a practical example using the S&P 500.",
        tradeSetup: [
            { label: "Index:", value: "S&P 500 (US500)" },
            { label: "Trade Size:", value: "10 CFD Contracts" },
            { label: "Entry Price:", value: "4,200.00" },
            { label: "Exit Price:", value: "4,250.00" },
            { label: "Direction:", value: "BUY (Long)", highlight: true },
        ],
        profitCalculation: [
            {
                label: "Price Movement:",
                value: "4,250.00 - 4,200.00 = 50.00 points",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Profit Calculation:",
                value: "10 contracts × 50.00 points × $1 = $500",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Total Profit:",
                value: "$500",
                bgClass: "bg-green-50 /20 border border-green-200 ",
                textClass: "text-green-600 ",
                fontSize: "text-2xl font-bold",
            },
        ],
        riskWarning: "This is a simplified example for educational purposes. Actual trading involves risk of loss and spreads/commissions would apply. Index values can fall as well as rise."
    };

    const ctaData = {
        heading: 'Ready to Start Trading Indices?',
        description: "Access global stock markets with competitive spreads and professional trading tools on our MT5 platform.",
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
    };

    return (
        <main>
            <StartTradingBanner />
            <TradingFeatures data={indicesFeaturesData} />
            <TradingCategories data={indicesCategoriesData} />
            <TradingSpreadsTable data={indicesSpreadsData} />
            <TradingExample data={indicesTradingExampleData} />
            <StartTradingCTA {...ctaData} />
        </main>
    );
}
