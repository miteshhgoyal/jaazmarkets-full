// app/platform/web/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import PlatformFeatures from '@/components/PlatformFeatures'
import WebTerminalPreview from '@/components/WebTerminalPreview'
import ComparisonTable from '@/components/ComparisonTable'
import GetStartedSteps from '@/components/GetStartedSteps'
import BrowserCompatibility from '@/components/BrowserCompatibility'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Launch Web Terminal",
            link: "/web",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Open Demo Account",
            link: "/demo",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const WebTerminalFeaturesData = {
    heading: 'Browser-Based Trading',
    description: 'Experience the convenience of web-based trading with all the powerful features of MT5, accessible from any device with an internet connection.',
    features: [
        {
            title: 'Instant Access',
            description: 'No downloads required. Start trading immediately from any web browser with just one click.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            benefits: []
        },
        {
            title: 'Cross-Platform',
            description: 'Works on Windows, macOS, Linux, and any device with a modern web browser.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            benefits: []
        },
        {
            title: 'Auto-Sync',
            description: 'All your settings, charts, and preferences automatically sync across all devices.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
            benefits: []
        },
        {
            title: 'Full MT5 Features',
            description: 'Access all MT5 functionality including advanced charting, indicators, and trading tools.',
            bgColor: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            benefits: []
        },
        {
            title: 'Real-Time Data',
            description: 'Live market data, real-time quotes, and instant order execution directly in your browser.',
            bgColor: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z',
            benefits: []
        },
        {
            title: 'Secure Trading',
            description: 'Bank-level SSL encryption ensures your data and trades are completely secure.',
            bgColor: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
            benefits: []
        }
    ]
}

const WebTerminalPreviewData = {
    heading: 'See It In Action',
    description: 'Experience the intuitive interface and powerful functionality of our MT5 Web Terminal.',
    preview: {
        url: 'jaazmarkets.com/web',
        title: 'MT5 Web Terminal',
        description: 'Professional trading interface with advanced charting, real-time data, and one-click trading capabilities.',
        buttonText: 'Launch Live Demo',
        buttonLink: '/web-terminal',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
}

const ComparisonTableData = {
    heading: 'Web vs Desktop Comparison',
    description: 'Choose the right platform for your trading style. Both offer professional-grade features.',
    tableData: [
        {
            feature: 'Installation Required',
            mt5: { type: 'icon', value: false },
            mt4: { type: 'icon', value: true }
        },
        {
            feature: 'Instant Access',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'icon', value: false }
        },
        {
            feature: 'Cross-Platform',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'text', value: 'Limited' }
        },
        {
            feature: 'Auto-Updates',
            mt5: { type: 'icon', value: true },
            mt4: { type: 'text', value: 'Manual' }
        },
        {
            feature: 'Storage Requirements',
            mt5: { type: 'text', value: 'None' },
            mt4: { type: 'text', value: '~200MB' }
        },
        {
            feature: 'Performance',
            mt5: { type: 'text', value: 'Excellent' },
            mt4: { type: 'text', value: 'Excellent' }
        }
    ]
}

const GetStartedStepsData = {
    heading: 'Get Started in 3 Steps',
    description: 'Start trading with MT5 Web Terminal in less than 2 minutes.',
    steps: [
        {
            number: '1',
            title: 'Open Account',
            description: 'Create your free Jaaz Markets account in under 2 minutes with basic information.',
            bgColor: 'bg-primary-orange'
        },
        {
            number: '2',
            title: 'Verify & Fund',
            description: 'Complete quick verification and fund your account using multiple secure payment methods.',
            bgColor: 'bg-blue-600'
        },
        {
            number: '3',
            title: 'Start Trading',
            description: 'Click the Web Terminal link in your account dashboard and start trading immediately.',
            bgColor: 'bg-green-600'
        }
    ]
}

const BrowserCompatibilityData = {
    heading: 'Browser Compatibility',
    description: 'MT5 Web Terminal works on all modern browsers. No plugins or extensions required.',
    browsers: [
        { name: 'Chrome', version: 'Latest', icon: '🌐' },
        { name: 'Firefox', version: 'Latest', icon: '🦊' },
        { name: 'Safari', version: '14+', icon: '🧭' },
        { name: 'Edge', version: 'Latest', icon: '⚡' },
        { name: 'Opera', version: 'Latest', icon: '🎭' },
        { name: 'Mobile', version: 'iOS/Android', icon: '📱' }
    ]
}

const ctaProps = {
    buttons: [
        {
            text: "Launch Web Terminal",
            href: "/web-terminal",
            variant: "primary",
            icon: "external"
        },
        {
            text: "Open Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            variant: "secondary",
            icon: "user"
        }
    ],
}

const ctaData = {
    heading: 'Ready to Trade?',
    description: 'Experience the power of MT5 Web Terminal. No downloads, no delays - just professional trading at your fingertips.',
    buttons: ctaProps.buttons
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <PlatformFeatures data={WebTerminalFeaturesData} />
            <WebTerminalPreview data={WebTerminalPreviewData} />
            <ComparisonTable data={ComparisonTableData} />
            <GetStartedSteps data={GetStartedStepsData} />
            <BrowserCompatibility data={BrowserCompatibilityData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
