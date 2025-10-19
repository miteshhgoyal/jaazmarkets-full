import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import PlatformFeatures from '@/components/PlatformFeatures'
import AnalysisToolsGrid from '@/components/AnalysisToolsGrid'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Start Trading",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Try Demo",
            link: "/demo",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const ProfessionalToolsData = {
    heading: 'Professional Analysis Tools',
    description: 'Access cutting-edge technical analysis tools integrated into our platform. Jaaz Markets empowers traders with actionable insights, live charts, and expert market predictions.',
    features: [
        {
            title: 'Real-Time Charts',
            description: 'Advanced charting with multiple timeframes, technical indicators, and drawing tools for comprehensive market analysis.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            benefits: []
        },
        {
            title: 'Market Signals',
            description: 'Automated trading signals based on proven technical analysis strategies and market patterns.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
            benefits: []
        },
        {
            title: 'Expert Insights',
            description: 'Professional market analysis and insights from our team of experienced traders and analysts.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            benefits: []
        }
    ]
}

const AnalysisToolsGridData = {
    heading: 'Additional Analysis Tools',
    description: 'Enhance your trading strategy with our comprehensive suite of analysis tools and resources.',
    tools: [
        {
            title: 'Price Action Analysis',
            description: 'Identify key support and resistance levels, trend patterns, and market structure.',
            icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
        },
        {
            title: 'Volatility Indicators',
            description: 'Monitor market volatility with Bollinger Bands, ATR, and other volatility measures.',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
            title: 'Fibonacci Tools',
            description: 'Use Fibonacci retracements and extensions to identify potential reversal levels.',
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
        },
        {
            title: 'Oscillators',
            description: 'RSI, MACD, Stochastic, and other momentum oscillators for timing entries and exits.',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
        }
    ]
}

const ctaData = {
    heading: 'Ready to Start Trading?',
    description: 'Join thousands of traders who trust Jaaz Markets for their technical analysis needs.',
    buttons: [
        {
            text: "Open Live Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "user"
        },
        {
            text: "Try Demo Account",
            href: "/demo",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <PlatformFeatures data={ProfessionalToolsData} />
            <AnalysisToolsGrid data={AnalysisToolsGridData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
