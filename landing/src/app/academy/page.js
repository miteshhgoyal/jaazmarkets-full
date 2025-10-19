// academy/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import LearningPaths from '@/components/LearningPaths'
import FeaturedTopics from '@/components/FeaturedTopics'
import LearningResources from '@/components/LearningResources'
import StartTradingCTA from '@/components/StartTradingCTA'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Start Learning",
            link: "#courses",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Open Demo Account",
            link: "/demo",
            variant: "secondary",
            icon: "user"
        }
    ],
}

const learningPathsData = {
    heading: 'Choose Your Learning Path',
    description: 'Whether you\'re a complete beginner or an experienced trader, we have the right educational content for your level.',
    paths: [
        {
            title: 'Beginner',
            subtitle: 'Perfect for new traders',
            iconName: 'BookOpen',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            topics: [
                'Introduction to Forex Markets',
                'Major, Minor & Exotic Pairs',
                'Pips, Lots & Leverage Explained',
                'MT5 Platform Navigation',
                'Placing Your First Order'
            ],
            featured: false
        },
        {
            title: 'Intermediate',
            subtitle: 'Build your trading skills',
            iconName: 'BarChart3',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            badge: 'POPULAR',
            topics: [
                'Support & Resistance Levels',
                'Moving Averages & RSI',
                '2% Risk Rule & Position Sizing',
                'Managing Trading Emotions',
                'Economic Calendar Trading'
            ],
            featured: true
        },
        {
            title: 'Advanced',
            subtitle: 'Master professional trading',
            iconName: 'Lightbulb',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            topics: [
                'Price Action Trading Mastery',
                'Building Custom MT5 EAs',
                'Multi-Asset Portfolio Trading',
                'Order Flow & Volume Analysis',
                'Institutional Trading Methods'
            ],
            featured: false
        }
    ]
}

const featuredTopicsData = {
    heading: 'Featured Topics',
    description: 'Explore our most popular educational content covering essential trading concepts and strategies.',
    topics: [
        {
            title: 'Technical Analysis Mastery',
            description: 'Learn to read charts, identify patterns, and use technical indicators to make informed trading decisions.',
            duration: '12 Lessons • 3 Hours',
            iconName: 'BarChart3',
            gradientFrom: 'from-primary-orange',
            gradientTo: 'to-orange-600'
        },
        {
            title: 'Risk Management',
            description: 'Master the art of protecting your capital with proven risk management techniques and position sizing strategies.',
            duration: '8 Lessons • 2 Hours',
            iconName: 'Shield',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-blue-700'
        },
        {
            title: 'Fundamental Analysis',
            description: 'Understand how economic events, news, and market sentiment drive currency movements and price action.',
            duration: '10 Lessons • 2.5 Hours',
            iconName: 'DollarSign',
            gradientFrom: 'from-green-500',
            gradientTo: 'to-green-700'
        },
        {
            title: 'Trading Psychology',
            description: 'Develop the mental discipline and emotional control needed to become a consistently profitable trader.',
            duration: '6 Lessons • 1.5 Hours',
            iconName: 'Brain',
            gradientFrom: 'from-purple-500',
            gradientTo: 'to-purple-700'
        },
        {
            title: 'MT5 Platform Guide',
            description: 'Complete guide to using MetaTrader 5 platform, from basic navigation to advanced features and Expert Advisors.',
            duration: '15 Lessons • 4 Hours',
            iconName: 'Settings',
            gradientFrom: 'from-yellow-500',
            gradientTo: 'to-orange-600'
        },
        {
            title: 'Trading Strategies',
            description: 'Explore proven trading strategies including scalping, day trading, swing trading, and position trading approaches.',
            duration: '14 Lessons • 3.5 Hours',
            iconName: 'Zap',
            gradientFrom: 'from-red-500',
            gradientTo: 'to-pink-600'
        }
    ]
}

const learningResourcesData = {
    heading: 'Additional Resources',
    description: 'Supplement your learning with our comprehensive collection of trading resources and tools.',
    resources: [
        {
            title: 'Trading Glossary',
            description: 'Comprehensive dictionary of trading terms and definitions.',
            iconName: 'BookOpen',
            iconBg: 'bg-blue-100/30',
            iconColor: 'text-blue-600',
            status: 'Coming Soon'
        },
        {
            title: 'Trading Calculators',
            description: 'Pip, margin, and profit calculators for precise trade planning.',
            iconName: 'Calculator',
            iconBg: 'bg-green-100/30',
            iconColor: 'text-green-600',
            link: '/tools/calculators',
            linkText: 'Use Calculators'
        },
        {
            title: 'Live Webinars',
            description: 'Join our expert traders for live market analysis and Q&A sessions.',
            iconName: 'Video',
            iconBg: 'bg-purple-100/30',
            iconColor: 'text-purple-600',
            status: 'No Upcoming Webinars'
        },
        {
            title: 'Free eBooks',
            description: 'Download comprehensive trading guides and strategy eBooks.',
            iconName: 'Download',
            iconBg: 'bg-yellow-100/30',
            iconColor: 'text-yellow-600',
            status: 'Download Unavailable'
        }
    ]
}

const ctaData = {
    heading: 'Ready to Start Learning?',
    description: 'Begin your trading education journey today with our comprehensive academy. Practice what you learn with a free demo account.',
    buttons: [
        {
            text: 'Open Demo Account',
            link: 'https://client.jaazmarkets.com/account?tab=register',
            variant: 'primary',
            external: true,
            icon: 'M13 7l5 5m0 0l-5 5m5-5H6'
        },
        {
            text: 'Full Academy Coming Soon',
            link: '#',
            variant: 'secondary',
            disabled: true,
            icon: 'M12 15v2m0 0v2m0-2h2m-2 0h-2m5-6v2m0 0v2m0-2h2m-2 0h-2M7 8V6m0 0V4m0 2h2M7 8H5'
        }
    ]
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <LearningPaths data={learningPathsData} />
            <FeaturedTopics data={featuredTopicsData} />
            <LearningResources data={learningResourcesData} />
            <StartTradingCTA data={ctaData} />
        </main>
    )
}

export default page
