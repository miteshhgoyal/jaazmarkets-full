import StartTradingBanner from '../../../components/StartTradingBanner'
import StartTradingCTA from '../../../components/StartTradingCTA'
import IFrameData from '../../../components/IFrameData'
import CalendarFeatures from '../../../components/CalendarFeatures'
import TradingTips from '../../../components/TradingTips'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "View Calendar",
            link: "#calendar",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Open Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "secondary",
            icon: "user"
        }
    ],
}

const iframeData = {
    htmlId: 'calendar',
    heading: 'Live Economic Calendar',
    description: 'Track market-moving economic events in real-time. Our comprehensive calendar includes central bank meetings, economic releases, and important announcements from major economies worldwide.',
    chartHeader: ['Economic Events', 'Live Data', "M13 10V3L4 14h7v7l9-11h-7z"],
    iframe: 'https://www.tradingview-widget.com/embed-widget/events/?locale=en#%7B%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22importanceFilter%22%3A%220%2C1%22%2C%22countryFilter%22%3A%22ar%2Cau%2Cbr%2Cca%2Ccn%2Cfr%2Cde%2Cin%2Cid%2Cit%2Cjp%2Ckr%2Cmx%2Cru%2Csa%2Cza%2Ctr%2Cgb%2Cus%2Ceu%22%2C%22utm_source%22%3A%22jaazmarkets.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22events%22%2C%22page-uri%22%3A%22jaazmarkets.com%2Ftools%2Fcalendar%22%7D',
}

const featuresData = {
    heading: '',
    description: '',
    features: [
        {
            title: 'High Impact Events',
            description: 'Focus on high-impact events that typically cause significant market volatility and trading opportunities.',
            bgColor: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.944-.833-2.714 0L3.1 16.5c-.77.833.192 2.5 1.732 2.5z'
        },
        {
            title: 'Real-Time Updates',
            description: 'Get live updates on economic releases and central bank announcements as they happen.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            title: 'Global Coverage',
            description: 'Monitor economic events from major economies including US, EU, UK, Japan, Australia, and more.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
        }
    ]
}

const tradingTipsData = {
    heading: 'Trading Around Economic Events',
    description: '',
    sections: [
        {
            title: 'Best Practices',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            tips: [
                'Monitor high-impact events 24-48 hours in advance',
                'Understand the market consensus vs. actual results',
                'Use proper risk management during volatile periods',
                'Consider correlation between events and currency pairs'
            ]
        },
        {
            title: 'Key Events to Watch',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.944-.833-2.714 0L3.1 16.5c-.77.833.192 2.5 1.732 2.5z',
            tips: [
                'Central bank interest rate decisions',
                'Employment data (NFP, unemployment rates)',
                'Inflation reports (CPI, PPI)',
                'GDP growth and manufacturing data'
            ]
        }
    ],
    cta: {
        text: 'Learn More in Trading Academy',
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
