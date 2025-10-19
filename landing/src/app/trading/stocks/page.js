import React from 'react';
import TradingFeatures from '@/components/TradingFeatures';
import TradingCategories from '@/components/TradingCategories';
import TradingSpreadsTable from '@/components/TradingSpreadsTable';
import TradingExample from '@/components/TradingExample';
import StartTradingBanner from '@/components/StartTradingBanner';
import StartTradingCTA from '@/components/StartTradingCTA';

export default function StocksPage() {

    const stockFeaturesData = {
        heading: "Why Trade Stocks with Jaaz?",
        description: "Gain direct exposure to the world's largest companies and benefit from their growth with our comprehensive stock trading platform.",
        features: [
            {
                iconName: 'Archive',
                title: '1000+ Stocks',
                desc: 'Access major stocks from NYSE, NASDAQ, LSE, and other global exchanges.',
                iconBg: 'from-primary-orange to-orange-700'
            },
            {
                iconName: 'Cpu',
                title: 'Low Commissions',
                desc: 'Trade with competitive commissions starting from $2 per transaction.',
                iconBg: 'from-primary-orange to-orange-700'
            },
            {
                iconName: 'TrendingUp',
                title: 'Leverage Available',
                desc: 'Trade with leverage up to 1:20 on selected stock CFDs.',
                iconBg: 'from-primary-orange to-orange-700'
            },
            {
                iconName: 'CheckCircle',
                title: 'No Hidden Fees',
                desc: 'Transparent pricing with no hidden costs or minimum account fees.',
                iconBg: 'from-primary-orange to-orange-700'
            },
        ],
    };

    const stockCategoriesData = {
        heading: "Popular Stock Categories",
        description: "Trade leading companies across various sectors and regions with access to major global exchanges.",
        categories: [
            {
                title: 'Technology',
                iconSvg: `<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
                colorClass: 'bg-blue-500',
                description: 'Leading tech giants and innovative companies shaping the future.',
                stocks: ['Apple (AAPL)', 'Microsoft (MSFT)', 'Tesla (TSLA)', 'Google (GOOGL)'],
            },
            {
                title: 'Financial Services',
                iconSvg: `<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
                colorClass: 'bg-green-500',
                description: 'Major banks and financial institutions from around the world.',
                stocks: ['JPMorgan (JPM)', 'Bank of America (BAC)', 'Goldman Sachs (GS)', 'Visa (V)'],
            },
            {
                title: 'Consumer Goods',
                iconSvg: `<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>`,
                colorClass: 'bg-purple-500',
                description: 'Household names and consumer brands with global reach.',
                stocks: ['Amazon (AMZN)', 'Coca-Cola (KO)', 'Nike (NKE)', "McDonald's (MCD)"],
            }
        ],
    };

    const stockCommissionsData = {
        heading: "Competitive Stock Commissions",
        description: "Trade stocks with transparent, competitive commissions across all major exchanges.",
        tableHeaders: ["Exchange", "Commission", "Min Commission", "Max Leverage"],
        tableRows: [
            {
                exchange: 'US Stocks (NYSE, NASDAQ)',
                commission: '$0.02 per share',
                minCommission: '$2.00',
                maxLeverage: '1:20',
            },
            {
                exchange: 'UK Stocks (LSE)',
                commission: '0.10%',
                minCommission: '£5.00',
                maxLeverage: '1:20',
            },
            {
                exchange: 'German Stocks (XETRA)',
                commission: '0.10%',
                minCommission: '€5.00',
                maxLeverage: '1:20',
            },
            {
                exchange: 'French Stocks (Euronext)',
                commission: '0.10%',
                minCommission: '€5.00',
                maxLeverage: '1:20',
            },
            {
                exchange: 'Australian Stocks (ASX)',
                commission: '0.08%',
                minCommission: 'AUD $6.00',
                maxLeverage: '1:20',
            }
        ],
        disclaimer: "The commissions and leverage ratios shown above are typical/indicative values for illustration purposes only. Actual commissions may vary based on exchange, order size, and account type. Leverage is subject to regulatory restrictions and client qualification. Stock CFDs available with leverage. Actual stock ownership available on select exchanges. Trading conditions are subject to change without notice.",
        buttonText: "View All Specifications",
        buttonHref: "/tools/specifications"
    };

    const stockTradingExampleData = {
        heading: "Stock Trading Example",
        description: "See how stock trading works with a practical example using Apple Inc. (AAPL).",
        tradeSetup: [
            { label: "Stock:", value: "Apple Inc. (AAPL)" },
            { label: "Quantity:", value: "100 Shares" },
            { label: "Buy Price:", value: "$150.00" },
            { label: "Sell Price:", value: "$155.00" },
            { label: "Direction:", value: "BUY (Long)", highlight: true },
        ],
        profitCalculation: [
            {
                label: "Price Movement:",
                value: "$155.00 - $150.00 = $5.00 per share",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Gross Profit:",
                value: "100 shares × $5.00 = $500",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Commission:",
                value: "Buy: $2.00 + Sell: $2.00 = $4.00",
                bgClass: "bg-gray-50 ",
            },
            {
                label: "Net Profit:",
                value: "$496",
                bgClass: "bg-green-50 /20 border border-green-200 ",
                textClass: "text-green-600 ",
                fontSize: "text-2xl font-bold",
            },
        ],
        riskWarning: "This is a simplified example for educational purposes. Stock prices can fall as well as rise, and you may lose money. Past performance does not guarantee future results."
    };

    const ctaData = {
        heading: 'Ready to Start Trading Stocks?',
        description: "Access global stock markets with competitive commissions and professional trading tools on our MT5 platform.",
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
            <TradingFeatures data={stockFeaturesData} />
            <TradingCategories data={stockCategoriesData} />
            <TradingSpreadsTable data={stockCommissionsData} />
            <TradingExample data={stockTradingExampleData} />
            <StartTradingCTA {...ctaData} />
        </main>
    );
}
