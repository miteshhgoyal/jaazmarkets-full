import React from 'react';
import TradingFeatures from '@/components/TradingFeatures';
import TradingCategories from '@/components/TradingCategories';
import TradingSpreadsTable from '@/components/TradingSpreadsTable';
import TradingExample from '@/components/TradingExample';
import StartTradingBanner from '@/components/StartTradingBanner';
import StartTradingCTA from '@/components/StartTradingCTA';

export default function MetalsPage() {

    const metalsFeaturesData = {
        heading: "Why Trade Metals with Jaaz?",
        description: "Precious metals have been stores of value for thousands of years. Trade these safe-haven assets for portfolio diversification and hedging.",
        features: [
            {
                iconName: 'Gem',
                title: 'Safe Haven Assets',
                desc: 'Trade precious metals as portfolio hedges during market uncertainty.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'DollarSign',
                title: 'Tight Spreads',
                desc: 'Competitive spreads starting from 0.20 on Gold with transparent pricing.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'TrendingUp',
                title: 'High Leverage',
                desc: 'Trade with leverage up to 1:1000 on Gold and other precious metals.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'Clock',
                title: '24/5 Trading',
                desc: 'Trade precious metals 24 hours a day, 5 days a week across global markets.',
                iconBg: 'from-primary-orange to-orange-600'
            },
        ],
    };

    const metalsCategoriesData = {
        heading: "Available Precious Metals",
        description: "Trade the most liquid and popular precious metals with competitive conditions and professional execution.",
        categories: [
            {
                title: 'Gold',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>`,
                colorClass: 'bg-yellow-500',
                description: 'The ultimate store of value and safe-haven asset during economic uncertainty.',
                stocks: ['XAU/USD (Spot Gold)', 'Spread from 0.20', 'Leverage up to 1:1000', '24/5 Trading'],
            },
            {
                title: 'Silver',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 10l3-3 3 3"></path></svg>`,
                colorClass: 'bg-gray-400',
                description: 'Industrial and investment demand drives silver\'s unique market dynamics.',
                stocks: ['XAG/USD (Spot Silver)', 'Spread from 0.025', 'Leverage up to 1:500', 'High Volatility'],
            },
            {
                title: 'Platinum',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>`,
                colorClass: 'bg-blue-400',
                description: 'Rare precious metal with automotive and jewelry industry applications.',
                stocks: ['XPT/USD (Spot Platinum)', 'Spread from 3.0', 'Leverage up to 1:200', 'Industrial Demand'],
            },
            {
                title: 'Palladium',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`,
                colorClass: 'bg-purple-500',
                description: 'Critical for automotive catalysts with limited supply and strong demand.',
                stocks: ['XPD/USD (Spot Palladium)', 'Spread from 5.0', 'Leverage up to 1:200', 'Supply Constraints'],
            }
        ],
    };

    const metalsSpreadsData = {
        heading: "Competitive Metals Spreads",
        description: "Trade precious metals with some of the tightest spreads in the industry and flexible leverage options.",
        tableHeaders: ["Metal", "Symbol", "Typical Spread", "Max Leverage"],
        tableRows: [
            {
                metal: 'Gold',
                symbol: 'XAU/USD',
                spread: '0.20',
                leverage: '1:1000',
            },
            {
                metal: 'Silver',
                symbol: 'XAG/USD',
                spread: '0.025',
                leverage: '1:500',
            },
            {
                metal: 'Platinum',
                symbol: 'XPT/USD',
                spread: '3.0',
                leverage: '1:200',
            },
            {
                metal: 'Palladium',
                symbol: 'XPD/USD',
                spread: '5.0',
                leverage: '1:200',
            }
        ],
        disclaimer: "The spreads and leverage ratios shown above are typical/indicative values for illustration purposes only. Actual spreads may vary based on market conditions, volatility, liquidity, and time of day. Spreads may widen significantly during major news events, market openings, or periods of low liquidity. Leverage availability is subject to regulatory restrictions and client classification. Trading conditions are subject to change without notice.",
        buttonText: "View All Specifications",
        buttonHref: "/tools/specifications"
    };

    const metalsTradingExampleData = {
        heading: "Gold Trading Example",
        description: "See how precious metals trading works with a practical example using Gold (XAU/USD).",
        tradeSetup: [
            { label: "Metal:", value: "Gold (XAU/USD)" },
            { label: "Trade Size:", value: "10 Ounces" },
            { label: "Entry Price:", value: "$2,000.00" },
            { label: "Exit Price:", value: "$2,050.00" },
            { label: "Direction:", value: "BUY (Long)", highlight: true },
        ],
        profitCalculation: [
            {
                label: "Price Movement:",
                value: "$2,050.00 - $2,000.00 = $50.00",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Profit Calculation:",
                value: "10 ounces × $50.00 = $500",
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
        riskWarning: "Precious metals trading involves risk of loss. Market prices can be volatile and affected by economic factors. This example is for educational purposes only."
    };

    const ctaData = {
        heading: 'Ready to Start Metals Trading?',
        description: "Diversify your portfolio with precious metals trading and benefit from safe-haven assets during market volatility.",
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
            <TradingFeatures data={metalsFeaturesData} />
            <TradingCategories data={metalsCategoriesData} />
            <TradingSpreadsTable data={metalsSpreadsData} />
            <TradingExample data={metalsTradingExampleData} />
            <StartTradingCTA {...ctaData} />
        </main>
    );
}
