// app/platform/desktop/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import DownloadOptions from '@/components/DownloadOptions'
import PlatformFeatures from '@/components/PlatformFeatures'
import SystemRequirements from '@/components/SystemRequirements'
import GetStartedSteps from '@/components/GetStartedSteps'
import SupportSection from '@/components/SupportSection'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Download for Windows",
            link: "#",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Download for macOS",
            link: "#",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const DownloadOptionsData = {
    heading: 'Download MT5 Desktop',
    description: 'Get the full power of MetaTrader 5 on your desktop with advanced features and professional tools.',
    downloads: [
        {
            platform: 'Windows',
            compatibility: 'Compatible with Windows 7, 8, 10, and 11',
            gradientFrom: 'from-blue-50',
            gradientTo: 'to-blue-100',
            borderColor: 'border-blue-200 ',
            iconBg: 'bg-blue-600',
            iconColor: 'text-white',
            icon: 'M0 3.5h11.5V12H0V3.5zm12.5 0H24V12H12.5V3.5zM0 12.5h11.5V21H0v-8.5zm12.5 0H24V21H12.5v-8.5z',
            features: ['File size: ~45MB', 'Quick installation', 'Auto-updates'],
            buttonText: 'Download for Windows',
            buttonBg: 'bg-blue-600',
            buttonHover: 'hover:bg-blue-700',
            downloadUrl: '#'
        },
        {
            platform: 'macOS',
            compatibility: 'Compatible with macOS 10.12 and later',
            gradientFrom: 'from-gray-50',
            gradientTo: 'to-gray-100',
            borderColor: 'border-gray-200 ',
            iconBg: 'bg-gray-800 ',
            iconColor: 'text-white',
            icon: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
            features: ['File size: ~52MB', 'Native performance', 'Retina display support'],
            buttonText: 'Download for macOS',
            buttonBg: 'bg-gray-800 ',
            buttonHover: 'hover:bg-gray-900 :bg-gray-700',
            downloadUrl: '#'
        }
    ]
}

const DesktopFeaturesData = {
    heading: 'Desktop Advantages',
    description: 'Experience the full potential of MT5 with enhanced performance and exclusive desktop features.',
    features: [
        {
            title: 'Expert Advisors',
            description: 'Run sophisticated automated trading strategies with full EA support and MQL5 programming.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            benefits: []
        },
        {
            title: 'Advanced Charting',
            description: 'Multi-monitor support, unlimited charts, and professional analysis tools for serious traders.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            benefits: []
        },
        {
            title: 'Custom Indicators',
            description: 'Install and create custom indicators, scripts, and trading tools to enhance your analysis.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
            benefits: []
        },
        {
            title: 'Strategy Tester',
            description: 'Backtest your strategies with historical data and optimize parameters for better performance.',
            bgColor: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
            benefits: []
        },
        {
            title: 'VPS Integration',
            description: 'Connect to Virtual Private Servers for 24/7 automated trading without interruption.',
            bgColor: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600',
            icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
            benefits: []
        },
        {
            title: 'Multi-Account',
            description: 'Manage multiple trading accounts simultaneously with advanced portfolio management tools.',
            bgColor: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
            benefits: []
        }
    ]
}

const SystemRequirementsData = {
    heading: 'System Requirements',
    description: 'Minimum and recommended specifications for optimal MT5 desktop performance.',
    systems: [
        {
            name: 'Windows',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M0 3.5h11.5V12H0V3.5zm12.5 0H24V12H12.5V3.5zM0 12.5h11.5V21H0v-8.5zm12.5 0H24V21H12.5v-8.5z',
            requirements: [
                {
                    type: 'Minimum Requirements',
                    specs: [
                        { label: 'OS', value: 'Windows 7 or later' },
                        { label: 'CPU', value: '1 GHz processor' },
                        { label: 'RAM', value: '1 GB' },
                        { label: 'Storage', value: '200 MB free space' },
                        { label: 'Internet', value: 'Broadband connection' }
                    ]
                },
                {
                    type: 'Recommended',
                    specs: [
                        { label: 'OS', value: 'Windows 10/11' },
                        { label: 'CPU', value: 'Multi-core 2+ GHz' },
                        { label: 'RAM', value: '4 GB or more' },
                        { label: 'Storage', value: '1 GB free space' },
                        { label: 'Display', value: '1920x1080 or higher' }
                    ]
                }
            ]
        },
        {
            name: 'macOS',
            iconBg: 'bg-gray-800 ',
            iconColor: 'text-white',
            icon: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
            requirements: [
                {
                    type: 'Minimum Requirements',
                    specs: [
                        { label: 'OS', value: 'macOS 10.12 or later' },
                        { label: 'CPU', value: 'Intel or Apple Silicon' },
                        { label: 'RAM', value: '2 GB' },
                        { label: 'Storage', value: '300 MB free space' },
                        { label: 'Internet', value: 'Broadband connection' }
                    ]
                },
                {
                    type: 'Recommended',
                    specs: [
                        { label: 'OS', value: 'macOS 12 or later' },
                        { label: 'CPU', value: 'M1/M2 or Intel i5+' },
                        { label: 'RAM', value: '8 GB or more' },
                        { label: 'Storage', value: '1 GB free space' },
                        { label: 'Display', value: 'Retina display' }
                    ]
                }
            ]
        }
    ]
}

const GetStartedStepsData = {
    heading: 'Quick Installation',
    description: 'Get MT5 up and running in just a few simple steps.',
    steps: [
        {
            number: '1',
            title: 'Download',
            description: 'Click the download button for your operating system.',
            bgColor: 'bg-primary-orange'
        },
        {
            number: '2',
            title: 'Install',
            description: 'Run the installer and follow the simple setup wizard.',
            bgColor: 'bg-blue-600'
        },
        {
            number: '3',
            title: 'Login',
            description: 'Enter your Jaaz Markets account credentials to connect.',
            bgColor: 'bg-green-600'
        },
        {
            number: '4',
            title: 'Trade',
            description: 'Start trading with professional tools and features.',
            bgColor: 'bg-purple-600'
        }
    ]
}

const SupportSectionData = {
    heading: 'Need Help?',
    description: 'Our support team is here to help you get the most out of MT5 desktop platform.',
    supportOptions: [
        {
            title: 'User Guide',
            description: 'Comprehensive documentation and tutorials for MT5 platform.',
            linkText: 'View Documentation',
            link: '#',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        },
        {
            title: 'Video Tutorials',
            description: 'Step-by-step video guides for installation and platform usage.',
            linkText: 'Watch Videos',
            link: '#',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V6a2 2 0 012-2h2a2 2 0 012 2v4'
        },
        {
            title: 'Live Support',
            description: 'Get instant help from our technical support team via live chat.',
            linkText: 'Contact Support',
            link: '/contact',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
        }
    ]
}

const ctaProps = {
    buttons: [
        {
            text: "Download for Windows",
            href: "#",
            variant: "primary",
            icon: "download"
        },
        {
            text: "Download for macOS",
            href: "#",
            variant: "secondary",
            icon: "download"
        }
    ],
}

const ctaData = {
    heading: 'Download MT5 Desktop Today',
    description: 'Experience professional trading with the most advanced platform. Download now and start trading with Jaaz Markets.',
    buttons: ctaProps.buttons
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <DownloadOptions data={DownloadOptionsData} />
            <PlatformFeatures data={DesktopFeaturesData} />
            <SystemRequirements data={SystemRequirementsData} />
            <GetStartedSteps data={GetStartedStepsData} />
            <SupportSection data={SupportSectionData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
