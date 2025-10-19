import React from 'react'
import LegalHero from '@/components/legal/LegalHero'
import LegalContent from '@/components/legal/LegalContent'
import LegalCTA from '@/components/legal/LegalCTA'

const heroData = {
    title: 'Risk Disclosure Statement',
    subtitle: 'Important Information About Trading Risks',
    lastUpdated: 'Please Read Carefully Before Trading',
    backgroundColor: 'bg-gradient-to-br from-red-900 to-red-800',
    textColor: 'text-red-100',
    iconName: 'AlertTriangle'
}

const contentData = {
    warningBanner: {
        title: 'HIGH RISK WARNING',
        description: 'Trading leveraged products such as Forex and CFDs may not be suitable for all investors as they carry a high degree of risk to your capital. Please ensure that you fully understand the risks involved.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        titleColor: 'text-red-800',
        textColor: 'text-red-700'
    },
    introduction: 'This Risk Disclosure Statement is provided by Jaaz Markets LTD (Registration Number: 2025-00595) to inform you of the risks associated with trading foreign exchange (Forex) and Contracts for Difference (CFDs) on our platform. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment.',
    sections: [
        {
            id: 'leverage-risk',
            title: '1. Leverage and Margin Trading Risks',
            content: [
                {
                    type: 'warning',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-l-4 border-orange-500',
                    textColor: 'text-orange-800',
                    strongText: '',
                    text: 'Leverage can work both for and against you. While it can amplify profits, it can also magnify losses.',
                    fontWeight: 'font-semibold'
                },
                {
                    type: 'subtitle',
                    text: 'Understanding Leverage'
                },
                {
                    type: 'list',
                    items: [
                        'Leverage allows you to control a large position with a relatively small amount of capital',
                        'For example, 1:100 leverage means you can control $100,000 with just $1,000',
                        'A small market movement can have a proportionally larger impact on your deposited funds',
                        'You may lose more than your initial deposit if markets move against you'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'Margin Requirements'
                },
                {
                    type: 'list',
                    items: [
                        'You must maintain minimum margin levels to keep positions open',
                        'If your account equity falls below margin requirements, positions may be automatically closed',
                        'Market volatility can lead to rapid margin calls',
                        'Weekend gaps can cause significant margin breaches'
                    ]
                }
            ]
        },
        {
            id: 'market-risk',
            title: '2. Market Volatility Risks',
            content: [
                {
                    type: 'paragraph',
                    text: 'Financial markets can be highly volatile and unpredictable.'
                },
                {
                    type: 'subtitle',
                    text: 'Price Movements'
                },
                {
                    type: 'list',
                    items: [
                        'Prices can move rapidly in either direction without warning',
                        'Economic news, political events, and natural disasters can cause sudden price spikes',
                        'Low liquidity periods can lead to wider spreads and slippage',
                        'Markets can gap significantly, especially over weekends or holidays'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'Market Conditions'
                },
                {
                    type: 'list',
                    items: [
                        'During volatile conditions, it may be difficult to execute orders at desired prices',
                        'Stop-loss orders may not guarantee your loss limitation',
                        'Market suspensions or circuit breakers can prevent trading',
                        'Extreme events can lead to negative account balances'
                    ]
                }
            ]
        },
        {
            id: 'product-risks',
            title: '3. Product-Specific Risks',
            content: [
                {
                    type: 'subtitle',
                    text: 'Forex Trading'
                },
                {
                    type: 'list',
                    items: [
                        'Currency values are affected by numerous unpredictable factors',
                        'Interest rate differentials can impact overnight holding costs',
                        'Central bank interventions can cause dramatic price movements',
                        'Geopolitical events can lead to currency devaluations'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'CFDs on Stocks'
                },
                {
                    type: 'list',
                    items: [
                        'Corporate actions can affect CFD pricing and adjustments',
                        'Dividend adjustments may impact your account',
                        'Trading halts on underlying stocks affect CFD trading',
                        'After-hours price movements can create gaps'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'Cryptocurrency CFDs'
                },
                {
                    type: 'warning',
                    bgColor: 'bg-red-50',
                    borderColor: 'border border-red-200',
                    textColor: 'text-red-800',
                    strongText: 'Extreme Risk Warning: ',
                    text: 'Cryptocurrency markets are extremely volatile and can experience price swings of 20% or more in a single day.'
                },
                {
                    type: 'list',
                    items: [
                        '24/7 trading means constant exposure to price movements',
                        'Regulatory changes can severely impact valuations',
                        'Technical issues or hacks can affect market confidence',
                        'Low liquidity in some cryptocurrencies increases risk'
                    ]
                }
            ]
        },
        {
            id: 'operational-risks',
            title: '4. Operational and Technical Risks',
            content: [
                {
                    type: 'subtitle',
                    text: 'Platform Risks'
                },
                {
                    type: 'list',
                    items: [
                        'Internet connectivity issues can prevent order execution',
                        'Platform outages may occur during critical market events',
                        'Mobile trading carries additional connectivity risks',
                        'Hardware or software failures can impact trading ability'
                    ]
                },
                {
                    type: 'subtitle',
                    text: 'Execution Risks'
                },
                {
                    type: 'list',
                    items: [
                        'Orders may be executed at different prices than displayed',
                        'Slippage can occur during volatile market conditions',
                        'Requotes may happen in fast-moving markets',
                        'Partial fills may occur on large orders'
                    ]
                }
            ]
        },
        {
            id: 'counterparty-risk',
            title: '5. Counterparty and Credit Risk',
            content: [
                {
                    type: 'paragraph',
                    text: 'When trading CFDs, you are exposed to the credit risk of Jaaz Markets LTD.'
                },
                {
                    type: 'list',
                    items: [
                        'CFDs are not traded on regulated exchanges',
                        'You are relying on our ability to honor our obligations',
                        'Client funds are segregated but not guaranteed by government schemes',
                        'In the event of insolvency, you may not recover your full investment'
                    ]
                }
            ]
        },
        {
            id: 'regulatory-risks',
            title: '6. Legal and Regulatory Risks',
            content: [
                {
                    type: 'list',
                    items: [
                        'Changes in regulations may affect your ability to trade',
                        'Tax laws may change, affecting your trading profits',
                        'Some jurisdictions prohibit CFD trading',
                        'Cross-border trading may involve additional legal complexities'
                    ]
                }
            ]
        },
        {
            id: 'risk-management',
            title: 'Risk Management Recommendations',
            content: [
                {
                    type: 'paragraph',
                    text: 'While risks cannot be eliminated, they can be managed:'
                },
                {
                    type: 'grid',
                    columns: 'grid-cols-1 md:grid-cols-2',
                    items: [
                        {
                            title: 'Use Stop-Loss Orders',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Set stop-losses to limit potential losses on every trade'
                        },
                        {
                            title: 'Manage Position Sizes',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Never risk more than you can afford to lose'
                        },
                        {
                            title: 'Understand Leverage',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Use lower leverage until you gain experience'
                        },
                        {
                            title: 'Education First',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Learn about markets before trading real money'
                        },
                        {
                            title: 'Start with Demo',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Practice on a demo account to understand platform and risks'
                        },
                        {
                            title: 'Monitor Positions',
                            bgColor: 'bg-green-50',
                            titleColor: 'text-green-900',
                            textColor: 'text-green-800',
                            content: 'Regularly check open positions and market conditions'
                        }
                    ]
                }
            ]
        }
    ]
}

const ctaData = {
    heading: 'Need More Information?',
    description: 'Our team is available to answer your questions about trading risks',
    backgroundColor: 'bg-gray-100',
    buttons: [
        {
            text: 'Contact Support',
            href: '/contact',
            style: 'bg-primary-orange text-white hover:bg-primary-orange/90'
        },
        {
            text: 'View All Legal Documents',
            href: '/legal',
            style: 'border-2 border-primary-orange text-primary-orange hover:bg-primary-orange hover:text-white'
        }
    ]
}

const page = () => {
    return (
        <main>
            <LegalHero data={heroData} />
            <LegalContent data={contentData} />
            <LegalCTA data={ctaData} />
        </main>
    )
}

export default page
