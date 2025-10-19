import React from 'react';
import TradingFeatures from '@/components/TradingFeatures';
import TradingCategories from '@/components/TradingCategories';
import TradingSpreadsTable from '@/components/TradingSpreadsTable';
import TradingExample from '@/components/TradingExample';
import StartTradingBanner from '@/components/StartTradingBanner';
import StartTradingCTA from '@/components/StartTradingCTA';

export default function CommoditiesPage() {

    const commoditiesFeaturesData = {
        heading: "Why Trade Commodities with Jaaz?",
        description: "Commodities offer excellent diversification opportunities and inflation hedging. Trade essential raw materials that power the global economy.",
        features: [
            {
                iconName: 'Globe',
                title: 'Global Markets',
                desc: 'Access commodities from major global exchanges and markets worldwide.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'DollarSign',
                title: 'Competitive Spreads',
                desc: 'Trade with tight spreads starting from 0.03 on Crude Oil and major commodities.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'TrendingUp',
                title: 'Flexible Leverage',
                desc: 'Trade with leverage up to 1:500 on selected commodity CFDs.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'BarChart3',
                title: 'Portfolio Diversification',
                desc: 'Diversify your portfolio with commodities for inflation hedging and risk management.',
                iconBg: 'from-primary-orange to-orange-600'
            },
        ],
    };

    const commoditiesCategoriesData = {
        heading: "Available Commodity Categories",
        description: "Trade essential raw materials across energy, agricultural, and industrial sectors with professional execution.",
        categories: [
            {
                title: 'Energy',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path></svg>`,
                colorClass: 'bg-black',
                description: 'Essential energy commodities that power the global economy and transportation.',
                stocks: ['Crude Oil (WTI & Brent)', 'Natural Gas', 'Heating Oil', 'Gasoline'],
            },
            {
                title: 'Agricultural',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`,
                colorClass: 'bg-green-600',
                description: 'Essential food commodities affected by weather, seasons, and global demand.',
                stocks: ['Wheat', 'Corn', 'Soybeans', 'Coffee'],
            },
            {
                title: 'Industrial Metals',
                iconSvg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>`,
                colorClass: 'bg-orange-600',
                description: 'Base metals essential for construction, manufacturing, and infrastructure.',
                stocks: ['Copper', 'Aluminum', 'Zinc', 'Nickel'],
            }
        ],
    };

    const commoditiesSpreadsData = {
        heading: "Competitive Commodity Spreads",
        description: "Trade commodities with competitive spreads and flexible leverage across energy, agricultural, and industrial sectors.",
        tableHeaders: ["Commodity", "Symbol", "Typical Spread", "Max Leverage"],
        tableRows: [
            {
                commodity: 'Crude Oil (WTI)',
                symbol: 'USOIL',
                spread: '0.03',
                leverage: '1:500',
            },
            {
                commodity: 'Brent Oil',
                symbol: 'UKOIL',
                spread: '0.03',
                leverage: '1:500',
            },
            {
                commodity: 'Natural Gas',
                symbol: 'NATGAS',
                spread: '0.030',
                leverage: '1:100',
            },
            {
                commodity: 'Copper',
                symbol: 'COPPER',
                spread: '0.004',
                leverage: '1:200',
            },
            {
                commodity: 'Wheat',
                symbol: 'WHEAT',
                spread: '2.0',
                leverage: '1:100',
            }
        ],
        disclaimer: "The spreads and leverage ratios shown above are typical/indicative values for illustration purposes only. Actual spreads may vary significantly based on market conditions, volatility, liquidity, and time of day. Spreads may widen during news events, market openings/closings, or periods of low liquidity. Commodity markets can be highly volatile. Leverage availability is subject to regulatory restrictions. Trading conditions are subject to change without notice.",
        buttonText: "View All Specifications",
        buttonHref: "/tools/specifications"
    };

    const commoditiesTradingExampleData = {
        heading: "Crude Oil Trading Example",
        description: "See how commodity trading works with a practical example using Crude Oil (USOIL).",
        tradeSetup: [
            { label: "Commodity:", value: "Crude Oil (USOIL)" },
            { label: "Trade Size:", value: "10 Barrels" },
            { label: "Entry Price:", value: "$75.00" },
            { label: "Exit Price:", value: "$78.00" },
            { label: "Direction:", value: "BUY (Long)", highlight: true },
        ],
        profitCalculation: [
            {
                label: "Price Movement:",
                value: "$78.00 - $75.00 = $3.00",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Profit Calculation:",
                value: "10 barrels × $3.00 = $30",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Total Profit:",
                value: "$30",
                bgClass: "bg-green-50 /20 border border-green-200 ",
                textClass: "text-green-600 ",
                fontSize: "text-2xl font-bold",
            },
        ],
        riskWarning: "Commodity trading is highly volatile and involves significant risk. Prices can be affected by supply and demand, weather, geopolitical events, and economic factors. This example is for educational purposes only."
    };

    const ctaData = {
        heading: 'Ready to Start Commodities Trading?',
        description: "Diversify your portfolio with commodities trading and gain exposure to essential global markets.",
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
            <TradingFeatures data={commoditiesFeaturesData} />
            <TradingCategories data={commoditiesCategoriesData} />
            <TradingSpreadsTable data={commoditiesSpreadsData} />
            <TradingExample data={commoditiesTradingExampleData} />
            <StartTradingCTA {...ctaData} />
        </main>
    );
}
