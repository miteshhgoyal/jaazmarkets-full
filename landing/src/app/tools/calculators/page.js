// tools/calculators/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import TradingCalculators from '@/components/TradingCalculators'
import StartTradingCTA from '@/components/StartTradingCTA'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Use Calculators",
            link: "#calculators",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Open Account",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const calculatorsData = {
    heading: 'Professional Trading Calculators',
    description: 'Use our advanced trading calculators to make informed decisions, manage risk effectively, and optimize your trading performance across all major financial instruments.',
    disclaimer: 'These calculators are provided for educational purposes and use example rates. Actual market values, spreads, and trading conditions may vary. Always verify calculations with your broker before trading.'
}

const ctaData = {
    heading: 'Ready to Put These Tools to Work?',
    description: 'Use our professional trading calculators to optimize your trading strategy and manage risk effectively. Start trading with confidence today.',
    buttons: [
        {
            text: "Open Live Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "user"
        },
        {
            text: "Try Free Demo",
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
            <TradingCalculators data={calculatorsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
