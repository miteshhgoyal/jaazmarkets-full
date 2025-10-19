import React from 'react';
import TradingFeatures from '@/components/TradingFeatures';
import TradingSpreadsTable from '@/components/TradingSpreadsTable';
import HowItWorks from '@/components/HowItWorks';
import TradingExample from '@/components/TradingExample';
import StartTradingCTA from '@/components/StartTradingCTA';
import StartTradingBanner from '@/components/StartTradingBanner';

const Page = () => {

    const forexFeaturesData = {
        heading: "Why Trade Forex with Jaaz?",
        description: "The foreign exchange market is the world's largest and most liquid financial market, trading over $6 trillion daily.",
        features: [
            {
                iconName: 'Clock',
                title: '24/5 Trading',
                desc: 'Trade forex 24 hours a day, 5 days a week across global sessions.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'TrendingUp',
                title: 'High Liquidity',
                desc: "Benefit from deep liquidity and tight spreads in the world's largest market.",
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'DollarSign',
                title: '80+ Pairs',
                desc: 'Trade major, minor, and exotic currency pairs with competitive conditions.',
                iconBg: 'from-primary-orange to-orange-600'
            },
            {
                iconName: 'Zap',
                title: 'Fast Execution',
                desc: 'Lightning-fast order execution with average speeds under 50ms.',
                iconBg: 'from-primary-orange to-orange-600'
            },
        ],
    };

    const forexSpreadsData = {
        heading: "Competitive Forex Spreads",
        description: "Trade with some of the most competitive spreads in the industry across all major currency pairs.",
        tableHeaders: ["Currency Pair", "Standard Account", "Raw Account", "Max Leverage"],
        tableRows: [
            { currencyPair: 'EUR/USD', standardAccount: '0.8 pips', rawAccount: '0.0 pips', maxLeverage: '1:500' },
            { currencyPair: 'GBP/USD', standardAccount: '1.2 pips', rawAccount: '0.0 pips', maxLeverage: '1:500' },
            { currencyPair: 'USD/JPY', standardAccount: '0.9 pips', rawAccount: '0.0 pips', maxLeverage: '1:500' },
            { currencyPair: 'AUD/USD', standardAccount: '1.0 pips', rawAccount: '0.0 pips', maxLeverage: '1:500' },
            { currencyPair: 'USD/CAD', standardAccount: '1.5 pips', rawAccount: '0.0 pips', maxLeverage: '1:500' },
        ],
        disclaimer: "The spreads shown above are typical/indicative values for illustration purposes only. Actual spreads may vary based on market conditions, volatility, liquidity, and time of day. Spreads may widen significantly during major news events, market openings, or periods of low liquidity. Past spread performance does not guarantee future results.",
        buttonText: "View All Account Types",
        buttonHref: "/trading/account-types"
    };

    const howForexWorksData = {
        heading: "How Forex Trading Works",
        description: "Forex trading involves buying one currency while simultaneously selling another. Currency pairs are quoted in terms of one currency relative to another.",
        steps: [
            { stepNumber: 1, title: 'Choose Your Currency Pair', description: 'Select from 80+ currency pairs including majors like EUR/USD, GBP/USD, and exotic pairs.' },
            { stepNumber: 2, title: 'Analyze the Market', description: 'Use technical and fundamental analysis to determine market direction and entry points.' },
            { stepNumber: 3, title: 'Execute Your Trade', description: 'Place your buy or sell order through our MT5 platform with lightning-fast execution.' },
        ],
        platformInfo: {
            title: "MT5 Trading Platform",
            description: "Professional trading tools at your fingertips"
        }
    };

    const forexExampleData = {
        heading: "Forex Trading Example",
        description: "See how forex trading works with a practical example using EUR/USD.",
        tradeSetup: [
            { label: 'Currency Pair:', value: 'EUR/USD' },
            { label: 'Trade Size:', value: '1 Standard Lot (100,000 EUR)' },
            { label: 'Entry Price:', value: '1.1000' },
            { label: 'Exit Price:', value: '1.1050' },
            { label: 'Direction:', value: 'BUY (Long)', highlight: true },
        ],
        profitCalculation: [
            {
                label: 'Price Movement:',
                value: '1.1050 - 1.1000 = 0.0050 (50 pips)',
                bgClass: "bg-gray-50 "
            },
            {
                label: 'Profit Calculation:',
                value: '100,000 × 0.0050 = $500',
                bgClass: "bg-gray-50 "
            },
            {
                label: 'Total Profit:',
                value: '$500',
                highlight: true,
                bgClass: "bg-green-50 /20 border border-green-200 ",
                textClass: "text-green-600 ",
                fontSize: "text-2xl font-bold"
            },
        ],
        riskWarning: "This is a simplified example for educational purposes. Actual trading involves risk of loss and spreads/commissions would apply. Past performance does not guarantee future results."
    };

    const startTradingData = {
        heading: 'Ready to Start Trading Forex?',
        description: 'Join thousands of traders who choose Jaaz Markets for competitive spreads, fast execution, and professional support.',
        buttons: [
            { href: 'https://client.jaazmarkets.com/account?tab=register', text: 'Open Live Account', variant: 'primary', icon: 'user' },
            { href: '/demo', text: 'Try Demo Account', variant: 'secondary', icon: 'monitor' },
        ],
    };

    return (
        <main>
            <StartTradingBanner />
            <TradingFeatures data={forexFeaturesData} />
            <TradingSpreadsTable data={forexSpreadsData} />
            <HowItWorks data={howForexWorksData} />
            <TradingExample data={forexExampleData} />
            <StartTradingCTA {...startTradingData} />
        </main>
    );
};

export default Page;
