import React from 'react';

import HeroSection from './components/HeroSection';
import AccessibilitySection from './components/AccessibilitySection';
import AdvantagesSection from './components/AdvantagesSection';
import AdditionalBenefits from './components/AdditionalBenefits';
import RiskDisclaimersSection from './components/RiskDisclaimersSection';
import StartTradingCTA from '@/components/StartTradingCTA';

export default function ForexTradingPage() {
    // Data for repeated UI sections (Advantage cards, additional benefits, risk disclaimers)
    const advantages = [
        {
            title: '24-Hour Market',
            desc: 'Trade around the clock, five days a week. The forex market never sleeps, opening in Sydney and closing in New York.',
            icon: 'Clock',
            points: [
                'Sydney: 21:00 GMT Sunday',
                'Tokyo: 00:00 GMT Monday',
                'London: 08:00 GMT',
                'New York: 13:00 GMT',
            ],
        },
        {
            title: 'High Liquidity',
            desc: 'With $7.5 trillion traded daily, forex offers unmatched liquidity ensuring easy entry and exit at desired prices.',
            icon: 'DollarSign',
            points: [
                'Instant order execution',
                'Minimal price gaps',
                'Stable pricing',
                'No market manipulation',
            ],
        },
        {
            title: 'Leverage Opportunities',
            desc: 'Access substantial market exposure with relatively small capital through flexible leverage options.',
            icon: 'TrendingUp',
            points: [
                'Up to 1:1000 leverage',
                'Flexible position sizes',
                'Enhanced profit potential',
                'Higher risk exposure',
            ],
            highlightPointIndex: 3,
        },
        {
            title: 'Low Trading Costs',
            desc: 'Benefit from minimal trading costs with tight spreads and no hidden fees or commissions.',
            icon: 'CreditCard',
            points: [
                'Spreads from 0.0 pips',
                'No commission fees*',
                'No hidden charges',
                'Competitive pricing',
            ],
        },
        {
            title: 'Market Transparency',
            desc: 'Trade in a transparent market with real-time pricing and access to comprehensive market data.',
            icon: 'Eye',
            points: [
                'Real-time quotes',
                'Live market data',
                'Economic indicators',
                'Global news access',
            ],
        },
        {
            title: 'Bidirectional Trading',
            desc: 'Profit from both rising and falling markets by going long or short on any currency pair.',
            icon: 'Repeat',
            points: [
                'Buy (long) positions',
                'Sell (short) positions',
                'Market volatility profits',
                'Flexible strategies',
            ],
        },
    ];

    const additionalBenefits = [
        {
            title: 'Fast Execution',
            desc: 'Lightning-fast order execution with minimal latency and slippage.',
            icon: 'Zap',
        },
        {
            title: 'Portfolio Diversification',
            desc: 'Diversify your investment portfolio across multiple currencies and economies.',
            icon: 'Briefcase',
        },
        {
            title: 'Educational Resources',
            desc: 'Access comprehensive trading education and market analysis tools.',
            icon: 'BookOpen',
        },
    ];

    const riskDisclaimers = [
        {
            title: 'Leverage Risk',
            desc: 'While leverage can amplify profits, it also magnifies losses. You can lose more than your initial investment. Trade only with funds you can afford to lose.',
            icon: 'AlertTriangle',
            iconBg: 'bg-yellow-500',
            textColor: 'text-yellow-400',
        },
        {
            title: 'Market Volatility',
            desc: 'Currency markets can be highly volatile and unpredictable. Economic events, political changes, and market sentiment can cause rapid price movements.',
            icon: 'AlertCircle',
            iconBg: 'bg-red-500',
            textColor: 'text-red-400',
        },
        {
            title: 'No Guaranteed Returns',
            desc: 'Past performance does not guarantee future results. There are no guarantees of profit in forex trading. All trading involves substantial risk of loss.',
            icon: 'ShieldAlert',
            iconBg: 'bg-orange-500',
            textColor: 'text-orange-400',
        },
        {
            title: 'Education Required',
            desc: 'Successful forex trading requires knowledge, experience, and proper risk management. Consider starting with a demo account and comprehensive education.',
            icon: 'Book',
            iconBg: 'bg-blue-500',
            textColor: 'text-blue-400',
        },
    ];

    const ctaData = {
        heading: 'Ready to Start Trading Forex?',
        description:
            "Take advantage of the world's most liquid market with competitive spreads, fast execution, and professional support.",
        buttons: [
            {
                text: 'Open Trading Account',
                href: 'https://client.jaazmarkets.com/account?tab=register',
                variant: 'primary',
                icon: 'user',
            },
            {
                text: 'Learn More About Forex',
                href: '/trading/forex',
                variant: 'secondary',
                icon: 'monitor',
            },
        ],
    };

    return (
        <main>
            <HeroSection />
            <AccessibilitySection />
            <section id="advantages" className="py-20 bg-gray-50">
                <AdvantagesSection advantages={advantages} />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <AdditionalBenefits benefits={additionalBenefits} />
                </div>
            </section>
            <RiskDisclaimersSection disclaimers={riskDisclaimers} />


            <StartTradingCTA {...ctaData} />
        </main>
    );
}
