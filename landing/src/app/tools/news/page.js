import StartTradingBanner from '../../../components/StartTradingBanner'
import StartTradingCTA from '../../../components/StartTradingCTA'
import IFrameData from '../../../components/IFrameData'
import CalendarFeatures from '../../../components/CalendarFeatures'
import TradingTips from '../../../components/TradingTips'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "View News",
            link: "#news",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Open Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const iframeData = {
    htmlId: 'news',
    heading: 'Live Market News Feed',
    description: 'Get real-time market news, analysis, and breaking stories from leading financial sources. Stay ahead of market trends with comprehensive coverage of global financial markets.',
    chartHeader: ['Latest Market News', 'Live Updates', 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'],
    iframe: 'https://www.tradingview-widget.com/embed-widget/timeline/',
}

const featuresData = {
    heading: '',
    description: '',
    features: [
        {
            title: 'Breaking News',
            description: 'Get instant notifications about market-moving news and breaking financial stories as they happen.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Market Analysis',
            description: 'Expert analysis and insights on market trends, technical patterns, and trading opportunities.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        },
        {
            title: 'Global Coverage',
            description: 'Comprehensive coverage of financial markets worldwide including forex, stocks, commodities, and crypto.',
            bgColor: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    ]
}

const tradingTipsData = {
    heading: 'News Categories & Sources',
    description: '',
    sections: [
        {
            title: 'Market Categories',
            icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
            tips: [
                'Forex & Currency Markets',
                'Stock Markets & Indices',
                'Commodities & Precious Metals',
                'Cryptocurrency & Digital Assets',
            ]
        },
        {
            title: 'Trusted Sources',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            tips: [
                'Reuters & Bloomberg Financial',
                'Financial Times & Wall Street Journal',
                'MarketWatch & Yahoo Finance',
                'CNBC & Financial News Networks',
            ]
        }
    ],
    cta: {
        text: 'Learn Market Analysis',
        link: '/academy',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    }
}

const ctaData = {
    heading: 'Ready to Trade Economic Events?',
    description: 'Use our economic calendar to stay ahead of market-moving events and make informed trading decisions.',
    buttons: [
        {
            text: "Open Trading Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "user"
        },
        {
            text: "Explore Trading Platform",
            href: "/platform",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <IFrameData data={iframeData} />
            <CalendarFeatures data={featuresData} />
            <TradingTips data={tradingTipsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
