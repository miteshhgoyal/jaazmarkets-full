import TradingFeatures from '@/components/TradingFeatures'
import TradingCategories from '@/components/TradingCategories'
import TradingSpreadsTable from '@/components/TradingSpreadsTable'
import TradingExample from '@/components/TradingExample'
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'

const WhyTradeCryptoData = {
    heading: "Why Trade Crypto with Jaaz?",
    description:
        "Join the digital revolution with cryptocurrency trading. Access the most popular digital assets through CFDs with leverage and professional tools.",
    features: [
        {
            iconName: "Activity", // will map to lucide-react icon
            title: "30+ Cryptocurrencies",
            desc: "Trade major cryptocurrencies including Bitcoin, Ethereum, and popular altcoins.",
            iconBg: "from-primary-orange to-orange-600",
        },
        {
            iconName: "Clock",
            title: "24/7 Trading",
            desc: "Trade cryptocurrencies around the clock, 7 days a week, 365 days a year.",
            iconBg: "from-primary-orange to-orange-600",
        },
        {
            iconName: "TrendingUp",
            title: "High Leverage",
            desc: "Trade with leverage up to 1:100 on selected cryptocurrency CFDs.",
            iconBg: "from-primary-orange to-orange-600",
        },
        {
            iconName: "Zap",
            title: "Tight Spreads",
            desc: "Competitive spreads starting from 0.75% on Bitcoin and major cryptocurrencies.",
            iconBg: "from-primary-orange to-orange-600",
        },
    ],
}

const PopularCategoriesData = {
    heading: "Popular Cryptocurrency Categories",
    description:
        "Trade the most popular and liquid cryptocurrencies across different categories and use cases.",
    categories: [
        {
            iconName: "Box",
            iconBg: "bg-yellow-500",
            title: "Major Cryptocurrencies",
            desc: "The most established and liquid digital currencies with the highest market caps.",
            list: ["Bitcoin (BTC)", "Ethereum (ETH)", "Ripple (XRP)", "Litecoin (LTC)"],
        },
        {
            iconName: "DollarSign",
            iconBg: "bg-blue-500",
            title: "DeFi Tokens",
            desc: "Decentralized Finance tokens powering the new financial ecosystem.",
            list: ["Chainlink (LINK)", "Uniswap (UNI)", "Aave (AAVE)", "Compound (COMP)"],
        },
        {
            iconName: "Layers",
            iconBg: "bg-purple-500",
            title: "Altcoins",
            desc: "Alternative cryptocurrencies with unique features and growing adoption.",
            list: ["Cardano (ADA)", "Polkadot (DOT)", "Solana (SOL)", "Polygon (MATIC)"],
        },
    ],
}

const CompetitiveSpreadsData = {
    heading: "Competitive Crypto Spreads",
    description:
        "Trade cryptocurrencies with competitive spreads and flexible leverage on our advanced trading platform.",
    tableHeaders: [
        "Cryptocurrency",
        "Symbol",
        "Typical Spread",
        "Max Leverage",
    ],
    tableRows: [
        { name: "Bitcoin", symbol: "BTCUSD", spread: "0.75%", leverage: "1:100" },
        { name: "Ethereum", symbol: "ETHUSD", spread: "1.00%", leverage: "1:100" },
        { name: "Ripple", symbol: "XRPUSD", spread: "2.00%", leverage: "1:50" },
        { name: "Litecoin", symbol: "LTCUSD", spread: "1.50%", leverage: "1:50" },
        { name: "Cardano", symbol: "ADAUSD", spread: "2.50%", leverage: "1:25" },
    ],
    disclaimer: "The spreads and leverage ratios shown above are typical/indicative values for illustration purposes only. Cryptocurrency markets are highly volatile. Actual spreads may vary significantly based on market conditions, volatility, and liquidity. Spreads can widen dramatically during periods of high volatility or low liquidity. Leverage availability is subject to regulatory restrictions. Trading conditions are subject to change without notice.",
    buttonText: "View All Specifications",
    buttonHref: "/tools/specifications"
}

const CryptoTradingExampleData = {
    heading: "Crypto Trading Example",
    description:
        "See how cryptocurrency trading works with a practical example using Bitcoin (BTC/USD).",
    tradeSetup: [
        { label: "Cryptocurrency:", value: "Bitcoin (BTC/USD)" },
        { label: "Trade Size:", value: "1 BTC CFD" },
        { label: "Entry Price:", value: "$45,000" },
        { label: "Exit Price:", value: "$47,000" },
        { label: "Direction:", value: "BUY (Long)", valueClass: "text-green-600" },
    ],
    profitCalculation: [
        {
            label: "Price Movement:",
            value: "$47,000 - $45,000 = $2,000",
            bgClass: "bg-gray-50 ",
        },
        {
            label: "Profit Calculation:",
            value: "1 BTC × $2,000 = $2,000",
            bgClass: "bg-gray-50 ",
        },
        {
            label: "Total Profit:",
            value: "$2,000",
            bgClass: "bg-green-50 /20 border border-green-200 ",
            textClass: "text-green-600 ",
            fontSize: "text-2xl font-bold",
        },
    ],
    riskWarning:
        "Cryptocurrency trading is highly volatile and risky. Prices can fluctuate dramatically in short periods. This example is for educational purposes only and past performance does not guarantee future results.",
}

const page = () => {

    const ctaData = {
        heading: 'Ready to Start Crypto Trading?',
        description:
            "Join the digital currency revolution with 24/7 trading, competitive spreads, and professional tools.",
        buttons: [
            {
                text: 'Open Live Account',
                href: 'https://client.jaazmarkets.com/account?tab=register',
                variant: 'primary',
                icon: 'user',
            },
            {
                text: 'Try Demo Account',
                href: '/demo',
                variant: 'secondary',
                icon: 'monitor',
            },
        ],
    }

    return (
        <main>
            <StartTradingBanner />

            <TradingFeatures data={WhyTradeCryptoData} />
            <TradingCategories data={PopularCategoriesData} />
            <TradingSpreadsTable data={CompetitiveSpreadsData} />
            <TradingExample data={CryptoTradingExampleData} />

            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
