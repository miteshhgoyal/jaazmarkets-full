// app/platform/overview/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import ComparisonTable from '@/components/ComparisonTable'
import AvailablePlatforms from '@/components/AvailablePlatforms'
import React from 'react'
import {
    Activity, Target, Zap, TrendingUp, ChartColumn, Monitor, Globe, Smartphone,
    ArrowRight, Check, Brain, RefreshCw, TestTube, Calendar, Code, X
} from 'lucide-react'

// Enhanced Data Objects with Real Images from PDF
const mt5OverviewData = {
    sections: [
        {
            id: "multi_asset",
            title: "Multi-Asset Trading Platform",
            description: "MetaTrader 5 provides access to Forex, Stocks, Futures, Options, and Bonds all from a single platform. With support for over 1,000 financial instruments, traders can diversify their portfolios and implement sophisticated trading strategies across multiple asset classes.",
            // Image 1: Main desktop interface from PDF
            image: "/images/mt5-desktop-main-interface.png",
            imageAlt: "MetaTrader 5 Multi-Asset Platform Interface",
            features: [
                "50+ Forex currency pairs (Major, Minor, Exotic)",
                "1000+ Global stocks and indices",
                "Precious metals and commodities trading",
                "Cryptocurrency CFDs with 24/7 access",
                "Government and corporate bonds"
            ],
            highlight: {
                icon: "target",
                value: "1000+",
                label: "Instruments",
                bgColor: "bg-primary-orange"
            }
        },
        {
            id: "trading_system",
            title: "Advanced Trading System",
            description: "The platform delivers a powerful trading system with Depth of Market (DOM) feature, providing separate accounting of orders and trades. It supports both netting and hedging position accounting systems with four execution modes: Instant, Request, Market, and Exchange.",
            // Image 2: Order execution and DOM from PDF
            image: "/images/mt5-order-execution-dom.png",
            imageAlt: "MT5 Advanced Trading System with Market Depth",
            features: [
                "Market Depth (Level II) data access",
                "Netting and hedging account types",
                "4 execution modes: Instant, Request, Market, Exchange",
                "6 pending order types for advanced strategies",
                "Partial order filling support",
                "One-click trading from charts"
            ],
            highlight: {
                icon: "zap",
                value: "<50ms",
                label: "Execution Speed",
                bgColor: "bg-blue-600"
            }
        },
        {
            id: "analysis_tools",
            title: "Superior Analysis Tools",
            description: "MetaTrader 5 allows simultaneous opening of up to 100 currency and stock price charts with 21 timeframes for comprehensive analysis. More than 80 technical indicators and analytical tools provide deep market insights.",
            // Image 3: Advanced charting with multiple indicators from PDF
            image: "/images/mt5-advanced-charting.png",
            imageAlt: "MT5 Professional Analysis and Charting Tools",
            features: [
                "21 chart timeframes (M1 to MN1)",
                "80+ built-in technical indicators",
                "38 graphical objects and drawing tools",
                "Custom indicators with MQL5 support",
                "Unlimited simultaneous charts",
                "Advanced pattern recognition"
            ],
            highlight: {
                icon: "trending-up",
                value: "80+",
                label: "Indicators",
                bgColor: "bg-green-600"
            }
        }
    ],
    platformAvailability: {
        title: "Available Across All Platforms",
        description: "Access the full power of MetaTrader 5 on desktop, web, and mobile with seamless synchronization across all your devices.",
        platforms: [
            {
                icon: "monitor",
                title: "Desktop Platform",
                description: "Complete functionality with MQL5 programming and strategy testing",
                devices: "Windows • macOS • Linux",
                bgColor: "bg-blue-100",
                iconColor: "text-blue-600",
                // Image 4: Complete desktop platform from PDF
                image: "/images/mt5-desktop-complete.png"
            },
            {
                icon: "globe",
                title: "Web Terminal",
                description: "Browser-based trading with 30 indicators and secure encryption",
                devices: "Chrome • Safari • Firefox • Edge",
                bgColor: "bg-primary-orange/10",
                iconColor: "text-primary-orange",
                image: "/images/mt5-order-execution-dom.png"
            },
            {
                icon: "smartphone",
                title: "Mobile Apps",
                description: "Full trading capabilities with low data consumption",
                devices: "iOS • Android • Huawei",
                bgColor: "bg-green-100",
                iconColor: "text-green-600",
                // Image 5: Mobile interface from PDF
                image: "/images/mt5-mobile-interface.png"
            }
        ]
    }
}

const features2025Data = {
    title: "Latest 2025 Features",
    description: "MetaTrader 5 continues to evolve with cutting-edge features that enhance trading performance and user experience.",
    features: [
        {
            icon: "brain",
            title: "AI-Powered Trade Assistant",
            description: "Advanced market analysis with machine learning algorithms that track trading history, live news feeds, and market signals to provide intelligent trade suggestions.",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200"
        },
        {
            icon: "zap",
            title: "Multi-Symbol Backtesting",
            description: "Test strategies across forex, stocks, and crypto simultaneously with 30% faster processing speed using advanced multi-threading technology.",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200"
        },
        {
            icon: "refresh-cw",
            title: "Real-Time Device Sync",
            description: "Seamless synchronization across up to 5 devices per account with instant updates and zero data loss or duplicate trades.",
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        },
        {
            icon: "test-tube",
            title: "Enhanced Strategy Tester",
            description: "Advanced multi-threaded testing environment with cloud computing support for faster optimization and comprehensive simulation outputs.",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200"
        },
        {
            icon: "calendar",
            title: "Built-in Economic Calendar",
            description: "Real-time macroeconomic news and events directly integrated into the platform with impact predictions and volatility forecasts.",
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        {
            icon: "code",
            title: "MQL5 Programming Language",
            description: "Enhanced object-oriented programming language with improved debugging tools and extensive library support for creating sophisticated Expert Advisors.",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200"
        }
    ]
}

const technicalSpecsData = {
    title: "Technical Specifications",
    description: "Built on advanced 64-bit architecture with institutional-grade performance and reliability standards for professional trading.",
    categories: [
        {
            title: "Platform Architecture",
            items: [
                "64-bit multi-threaded platform",
                "Sub-50ms execution latency",
                "99.9% uptime reliability",
                "Cross-platform compatibility"
            ]
        },
        {
            title: "Analysis Tools",
            items: [
                "80+ built-in technical indicators",
                "38 graphical objects",
                "21 chart timeframes",
                "Unlimited charts support"
            ]
        },
        {
            title: "Order Management",
            items: [
                "6 pending order types",
                "4 execution modes",
                "Partial order filling",
                "One-click trading"
            ]
        },
        {
            title: "Trading Systems",
            items: [
                "Netting position accounting",
                "Hedging position accounting",
                "Market depth (Level II)",
                "Expert Advisors automation"
            ]
        }
    ]
}

// Icon mapping helper
const getIcon = (iconName, className = "w-6 h-6") => {
    const icons = {
        target: Target,
        zap: Zap,
        activity: Activity,
        'trending-up': TrendingUp,
        'chart-column': ChartColumn,
        monitor: Monitor,
        globe: Globe,
        smartphone: Smartphone,
        brain: Brain,
        'refresh-cw': RefreshCw,
        'test-tube': TestTube,
        calendar: Calendar,
        code: Code,
        check: Check,
        x: X
    }
    const IconComponent = icons[iconName] || Target
    return <IconComponent className={className} />
}

const bannerProps = {
    buttons: [
        {
            text: "Open Live Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Try Demo Account",
            link: "/demo",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

// Enhanced MT5 Platform Overview Component with Real Images
const MT5PlatformOverview = ({ data }) => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section with MT5 Logo */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        {/* MT5 Logo - Image 6 */}
                        <img
                            src="/images/metatrader5-sign.svg"
                            alt="MetaTrader 5 Logo"
                            className="w-12 h-12 mr-3"
                        />
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            MetaTrader 5 Platform Overview
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        The comprehensive trading solution that has become the new industry standard, driven by pioneering technological solutions and constant updates. Experience professional-grade trading with institutional performance.
                    </p>
                </div>

                {data.sections.map((section, index) => (
                    <div key={section.id} className="mb-20">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                            }`}>
                            {/* Content */}
                            <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                    {section.title}
                                </h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    {section.description}
                                </p>
                                <ul className="space-y-4">
                                    {section.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className={`w-6 h-6 ${section.id === 'multi_asset' ? 'bg-primary-orange/20' :
                                                section.id === 'trading_system' ? 'bg-blue-100' : 'bg-green-100'
                                                } rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0`}>
                                                <div className={`w-2.5 h-2.5 ${section.id === 'multi_asset' ? 'bg-primary-orange' :
                                                    section.id === 'trading_system' ? 'bg-blue-600' : 'bg-green-600'
                                                    } rounded-full`}></div>
                                            </div>
                                            <span className="text-gray-700 leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Real Image from PDF */}
                            <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                                <img
                                    src={section.image}
                                    alt={section.imageAlt}
                                    className="w-full rounded-2xl shadow-2xl border border-gray-200"
                                />
                                <div className={`absolute -bottom-6 -right-6 ${section.highlight.bgColor} text-white p-6 rounded-xl shadow-lg`}>
                                    <div className="text-center">
                                        {getIcon(section.highlight.icon, "w-8 h-8 mx-auto mb-2")}
                                        <div className="text-xl font-bold">{section.highlight.value}</div>
                                        <div className="text-sm opacity-90">{section.highlight.label}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Enhanced Platform Availability with Real Images */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 mt-16">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            {data.platformAvailability.title}
                        </h3>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {data.platformAvailability.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.platformAvailability.platforms.map((platform, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-center mb-6">
                                    <div className={`w-16 h-16 ${platform.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        {getIcon(platform.icon, `w-8 h-8 ${platform.iconColor}`)}
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{platform.title}</h4>
                                    <p className="text-gray-600 mb-4">{platform.description}</p>
                                    <div className="text-sm text-gray-500 font-medium">{platform.devices}</div>
                                </div>

                                {/* Real Platform Images */}
                                {platform.image && (
                                    <img
                                        src={platform.image}
                                        alt={`${platform.title} interface`}
                                        className="w-full rounded-xl shadow-md"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

// Enhanced 2025 Features with Hero Image
const Latest2025Features = ({ data }) => {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {data.title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {data.features.map((feature, index) => (
                        <div
                            key={index}
                            className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                            <div className="mb-4">
                                {getIcon(feature.icon, "w-12 h-12 text-gray-700")}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Enhanced Technical Specifications with Hero Image
const TechnicalSpecifications = ({ data }) => {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {data.title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    {data.categories.map((category, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-300">
                                {category.title}
                            </h3>
                            <ul className="space-y-3">
                                {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start">
                                        {getIcon('check', "w-5 h-5 text-primary-orange mr-2 mt-0.5 flex-shrink-0")}
                                        <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// Comparison Table Data (keeping original)
const ComparisonTableData = {
    heading: 'MT5 vs MT4 Comparison',
    description: 'See why MT5 is the superior choice for modern traders with enhanced features and capabilities.',
    tableData: [
        {
            feature: 'Timeframes',
            mt5: { type: 'text', value: '21 Timeframes' },
            mt4: { type: 'text', value: '9 Timeframes' }
        },
        {
            feature: 'Pending Orders',
            mt5: { type: 'text', value: '6 Types' },
            mt4: { type: 'text', value: '4 Types' }
        },
        {
            feature: 'Technical Indicators',
            mt5: { type: 'text', value: '80+' },
            mt4: { type: 'text', value: '30+' }
        },
        {
            feature: 'Market Depth',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'icon', value: false }
        },
        {
            feature: 'Economic Calendar',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'icon', value: false }
        },
        {
            feature: 'Hedging',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'icon', value: true }
        },
        {
            feature: 'Netting',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'icon', value: false }
        }
    ]
}

// Available Platforms Data (keeping original)
const AvailablePlatformsData = {
    heading: 'Get Started with MT5',
    description: 'Choose your preferred platform and start trading with the world\'s leading trading software.',
    platforms: [
        {
            title: 'Desktop Download',
            description: 'Full-featured platform for Windows, macOS, and Linux with all professional tools.',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
            icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            buttonText: 'Download Free',
            link: '/platform/desktop'
        },
        {
            title: 'Web Terminal',
            description: 'Trade instantly from your browser without any download required.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3m0 9l-3 3m0-3l3 3',
            buttonText: 'Launch Web Terminal',
            link: '/platform/web'
        },
        {
            title: 'Mobile Apps',
            description: 'Trade on the go with iOS, Android, and Huawei mobile applications.',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
            buttonText: 'Download Apps',
            link: '/platform/mobile'
        },
        {
            title: 'Why Choose Us',
            description: 'Discover what makes Jaaz Markets the preferred choice for traders.',
            bgColor: 'bg-purple-100',
            iconColor: 'text-purple-600',
            icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
            buttonText: 'Learn More',
            link: '/why-choose-us'
        }
    ]
}

// CTA Data (keeping original)
const ctaButtons = [
    {
        text: 'Open Live Account',
        href: 'https://client.jaazmarkets.com/account?tab=register',
        variant: 'primary'
    },
    {
        text: 'Try Demo Account',
        href: '/demo',
        variant: 'secondary'
    }
]

const ctaData = {
    heading: 'Ready to Trade with MetaTrader 5?',
    description: 'Join millions of traders worldwide who trust MetaTrader 5 for professional trading. Experience the industry standard platform with Jaaz Markets.',
    buttons: ctaButtons
}

const page = () => {
    return (
        <main className='overflow-x-hidden'>
            <StartTradingBanner {...bannerProps} />
            <MT5PlatformOverview data={mt5OverviewData} />
            <Latest2025Features data={features2025Data} />
            <TechnicalSpecifications data={technicalSpecsData} />
            <ComparisonTable data={ComparisonTableData} />
            <AvailablePlatforms data={AvailablePlatformsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
