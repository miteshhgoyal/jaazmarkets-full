import StartTradingBanner from '@/components/StartTradingBanner'
import FeaturedArticle from '@/components/FeaturedArticle'
import BlogCategories from '@/components/BlogCategories'
import BlogArticles from '@/components/BlogArticles'
import NewsletterSignup from '@/components/NewsletterSignup'
import StartTradingCTA from '@/components/StartTradingCTA'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Read Latest Posts",
            link: "#latest-posts",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Subscribe to Newsletter",
            link: "#newsletter",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const featuredArticleData = {
    article: {
        badge: 'FEATURED',
        title: 'FOMC Minutes: Dollar Strength Continues Amid Rate Expectations',
        excerpt: 'The latest Federal Reserve meeting minutes reveal hawkish sentiment, supporting USD strength across major pairs. Key takeaways for traders positioning in EUR/USD, GBP/USD, and USD/JPY.',
        author: 'Market Analysis Team',
        authorRole: 'Jaaz Markets Research'
    }
}

const categoriesData = {
    heading: 'Browse by Category',
    categories: [
        {
            name: 'Market Analysis',
            iconName: 'BarChart3',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            active: true
        },
        {
            name: 'Education',
            iconName: 'BookOpen',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            active: false
        },
        {
            name: 'Strategies',
            iconName: 'Zap',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            active: false
        },
        {
            name: 'News',
            iconName: 'Newspaper',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            active: false
        },
        {
            name: 'Platform',
            iconName: 'Settings',
            iconBg: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600',
            active: false
        },
        {
            name: 'Economics',
            iconName: 'DollarSign',
            iconBg: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            active: false
        }
    ]
}

const articlesData = {
    heading: 'Latest Articles',
    description: 'Stay informed with our latest market insights, trading tips, and educational content.',
    articles: [
        {
            title: 'EUR/USD Approaching 1.0500 Support: Trade Setup Analysis',
            excerpt: 'The Euro continues its downward pressure against the US Dollar, testing the critical 1.0500 psychological level. With ECB dovish signals and persistent USD strength, we\'re watching for a potential breakdown below this key support...',
            category: 'ANALYSIS',
            categoryBg: 'bg-blue-100 /30',
            categoryColor: 'text-blue-600',
            timeAgo: '2 hours ago',
            author: 'Technical Team',
            readTime: '5 min read',
            iconName: 'BarChart3',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-blue-700'
        },
        {
            title: 'Position Sizing Calculator: Never Risk More Than 2% Per Trade',
            excerpt: 'Master the 2% rule with our comprehensive guide to position sizing. Learn how to calculate lot sizes based on your account balance, stop loss distance, and risk tolerance. Includes practical examples for forex pairs...',
            category: 'EDUCATION',
            categoryBg: 'bg-green-100 /30',
            categoryColor: 'text-green-600',
            timeAgo: '5 hours ago',
            author: 'Education Team',
            readTime: '8 min read',
            iconName: 'BookOpen',
            gradientFrom: 'from-green-500',
            gradientTo: 'to-green-700'
        },
        {
            title: 'NFP Friday: Trading the Volatility Around US Jobs Data',
            excerpt: 'Non-Farm Payrolls release this Friday at 13:30 GMT. Market expects 185K new jobs vs 223K previous. Historical analysis shows average 50-pip movement in EUR/USD within first hour. Key strategies for trading the news...',
            category: 'NEWS',
            categoryBg: 'bg-purple-100 /30',
            categoryColor: 'text-purple-600',
            timeAgo: '1 day ago',
            author: 'News Desk',
            readTime: '3 min read',
            iconName: 'Newspaper',
            gradientFrom: 'from-purple-500',
            gradientTo: 'to-purple-700'
        },
        {
            title: 'London Session Breakout Strategy: 70% Win Rate Backtested',
            excerpt: 'Trade the first hour of London open with this proven breakout strategy. Works best on GBP/USD and EUR/GBP. Entry rules: Wait for 15-min candle close above/below Asian range. Stop loss: 20 pips. Target: 40 pips...',
            category: 'STRATEGY',
            categoryBg: 'bg-yellow-100 /30',
            categoryColor: 'text-yellow-600',
            timeAgo: '2 days ago',
            author: 'Strategy Team',
            readTime: '10 min read',
            iconName: 'Zap',
            gradientFrom: 'from-yellow-500',
            gradientTo: 'to-orange-600'
        },
        {
            title: 'CPI Release Trading Guide: Fade the Initial Spike Strategy',
            excerpt: 'Historical data shows 65% of CPI releases result in false initial moves. Learn to identify and trade the reversal. Key pairs: USD/JPY, EUR/USD. Wait 5 minutes post-release, enter counter-trend with tight 15-pip stop...',
            category: 'ECONOMICS',
            categoryBg: 'bg-red-100 /30',
            categoryColor: 'text-red-600',
            timeAgo: '3 days ago',
            author: 'Research Team',
            readTime: '6 min read',
            iconName: 'DollarSign',
            gradientFrom: 'from-red-500',
            gradientTo: 'to-pink-600'
        },
        {
            title: 'MT5 One-Click Trading Setup: Execute Trades in Milliseconds',
            excerpt: 'Configure MT5 for rapid execution with our one-click trading guide. Enable quick trading panel, set default lot sizes, configure hotkeys for buy/sell. Perfect for scalpers and news traders. Includes risk warnings...',
            category: 'PLATFORM',
            categoryBg: 'bg-indigo-100 /30',
            categoryColor: 'text-indigo-600',
            timeAgo: '4 days ago',
            author: 'Platform Team',
            readTime: '4 min read',
            iconName: 'Settings',
            gradientFrom: 'from-indigo-500',
            gradientTo: 'to-indigo-700'
        }
    ]
}

const newsletterData = {
    heading: 'Stay Updated with Market Insights',
    description: 'Subscribe to our newsletter and receive the latest market analysis, trading tips, and educational content directly in your inbox.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    privacyText: 'We respect your privacy. Unsubscribe at any time.'
}

const ctaData = {
    heading: 'Ready to Start Trading?',
    description: 'Apply the insights from our blog to your trading with a live or demo account. Start your trading journey today.',
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
            <FeaturedArticle data={featuredArticleData} />
            <BlogCategories data={categoriesData} />
            <BlogArticles data={articlesData} />
            <NewsletterSignup data={newsletterData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
