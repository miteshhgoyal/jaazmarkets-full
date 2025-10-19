import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import SpecificationsDisclaimer from '@/components/SpecificationsDisclaimer'
import TradingSpecificationsTabs from '@/components/TradingSpecificationsTabs'
import SpecificationsNotes from '@/components/SpecificationsNotes'
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
            text: "View All Products",
            link: "#tab-content",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const disclaimerData = {
    title: 'Important Trading Conditions Disclaimer',
    content: {
        highlight: 'All spreads, leverage ratios, swap rates, and commissions shown on this page are typical/indicative values for illustration purposes only.',
        description: 'Actual trading conditions may vary significantly based on multiple factors including but not limited to: market conditions, volatility, liquidity, time of day, account type, account equity, and regulatory requirements. Spreads may widen substantially during major news events, market openings/closings, or periods of low liquidity. Leverage availability is subject to regulatory restrictions and client classification. Trading conditions are subject to modification without prior notice. Please contact support for current real-time trading conditions.'
    }
}

const specificationsTabsData = {
    tabs: [
        {
            id: 'tabs-forex',
            label: 'Forex',
            content: [
                {
                    Symbol: 'EURUSD',
                    Description: 'Euro vs US Dollar',
                    Digits: 5,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.5',
                    'Buy Swap': '-1.2',
                    Spread: '0.8'
                },
                {
                    Symbol: 'GBPUSD',
                    Description: 'British Pound vs US Dollar',
                    Digits: 5,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.8',
                    'Buy Swap': '-1.5',
                    Spread: '1.2'
                },
                {
                    Symbol: 'USDJPY',
                    Description: 'US Dollar vs Japanese Yen',
                    Digits: 3,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.9',
                    'Buy Swap': '-0.7',
                    Spread: '0.9'
                },
                {
                    Symbol: 'USDCAD',
                    Description: 'US Dollar vs Canadian Dollar',
                    Digits: 5,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.6',
                    'Buy Swap': '-1.3',
                    Spread: '1.1'
                },
                {
                    Symbol: 'AUDUSD',
                    Description: 'Australian Dollar vs US Dollar',
                    Digits: 5,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.7',
                    'Buy Swap': '-1.4',
                    Spread: '1.0'
                },
                {
                    Symbol: 'NZDUSD',
                    Description: 'New Zealand Dollar vs US Dollar',
                    Digits: 5,
                    'Contract Size': '100,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.9',
                    'Buy Swap': '-1.6',
                    Spread: '1.3'
                }
            ]
        },
        {
            id: 'tabs-metals',
            label: 'Metals',
            content: [
                {
                    Symbol: 'XAUUSD',
                    Description: 'Gold vs US Dollar',
                    Digits: 2,
                    'Contract Size': '100',
                    'Min/Max Volume': '0.01/50',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.8',
                    'Buy Swap': '-0.6',
                    Spread: '0.3'
                },
                {
                    Symbol: 'XAGUSD',
                    Description: 'Silver vs US Dollar',
                    Digits: 3,
                    'Contract Size': '5,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.4',
                    'Buy Swap': '-0.3',
                    Spread: '0.02'
                },
                {
                    Symbol: 'XPTUSD',
                    Description: 'Platinum vs US Dollar',
                    Digits: 2,
                    'Contract Size': '100',
                    'Min/Max Volume': '0.01/50',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.2',
                    'Buy Swap': '-0.9',
                    Spread: '3.0'
                },
                {
                    Symbol: 'XPDUSD',
                    Description: 'Palladium vs US Dollar',
                    Digits: 2,
                    'Contract Size': '100',
                    'Min/Max Volume': '0.01/50',
                    'Volume Step': '0.01',
                    'Sell Swap': '-1.5',
                    'Buy Swap': '-1.2',
                    Spread: '5.0'
                }
            ]
        },
        {
            id: 'tabs-energies',
            label: 'Energies',
            content: [
                {
                    Symbol: 'WTI',
                    Description: 'West Texas Intermediate Crude Oil',
                    Digits: 2,
                    'Contract Size': '1,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-3.5',
                    'Buy Swap': '-2.8',
                    Spread: '0.05'
                },
                {
                    Symbol: 'BRENT',
                    Description: 'Brent Crude Oil',
                    Digits: 2,
                    'Contract Size': '1,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-3.2',
                    'Buy Swap': '-2.6',
                    Spread: '0.05'
                },
                {
                    Symbol: 'NGAS',
                    Description: 'Natural Gas',
                    Digits: 3,
                    'Contract Size': '10,000',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-2.1',
                    'Buy Swap': '-1.8',
                    Spread: '0.03'
                }
            ]
        },
        {
            id: 'tabs-indices',
            label: 'Indices',
            content: [
                {
                    Symbol: 'SPX500',
                    Description: 'S&P 500 Index',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.1/50',
                    'Volume Step': '0.1',
                    'Sell Swap': '-1.0',
                    'Buy Swap': '-0.8',
                    Spread: '0.4'
                },
                {
                    Symbol: 'NAS100',
                    Description: 'NASDAQ 100 Index',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.1/50',
                    'Volume Step': '0.1',
                    'Sell Swap': '-1.2',
                    'Buy Swap': '-0.9',
                    Spread: '1.0'
                },
                {
                    Symbol: 'DOW30',
                    Description: 'Dow Jones Industrial Average',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.1/50',
                    'Volume Step': '0.1',
                    'Sell Swap': '-0.9',
                    'Buy Swap': '-0.7',
                    Spread: '2.0'
                }
            ]
        },
        {
            id: 'tabs-commodities',
            label: 'Commodities',
            content: [
                {
                    Symbol: 'WHEAT',
                    Description: 'Wheat Futures',
                    Digits: 2,
                    'Contract Size': '5,000',
                    'Min/Max Volume': '1/100',
                    'Volume Step': '1',
                    'Sell Swap': '-1.8',
                    'Buy Swap': '-1.4',
                    Spread: '0.10'
                },
                {
                    Symbol: 'CORN',
                    Description: 'Corn Futures',
                    Digits: 2,
                    'Contract Size': '5,000',
                    'Min/Max Volume': '1/100',
                    'Volume Step': '1',
                    'Sell Swap': '-1.6',
                    'Buy Swap': '-1.2',
                    Spread: '0.08'
                },
                {
                    Symbol: 'COFFEE',
                    Description: 'Coffee Futures',
                    Digits: 3,
                    'Contract Size': '37,500',
                    'Min/Max Volume': '1/100',
                    'Volume Step': '1',
                    'Sell Swap': '-2.0',
                    'Buy Swap': '-1.6',
                    Spread: '0.005'
                }
            ]
        },
        {
            id: 'tabs-cryptos',
            label: 'Cryptocurrencies',
            content: [
                {
                    Symbol: 'BTCUSD',
                    Description: 'Bitcoin vs US Dollar',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/10',
                    'Volume Step': '0.01',
                    'Sell Swap': '-4.0',
                    'Buy Swap': '-3.5',
                    Spread: '50'
                },
                {
                    Symbol: 'ETHUSD',
                    Description: 'Ethereum vs US Dollar',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/50',
                    'Volume Step': '0.01',
                    'Sell Swap': '-3.5',
                    'Buy Swap': '-3.0',
                    Spread: '3.0'
                },
                {
                    Symbol: 'LTCUSD',
                    Description: 'Litecoin vs US Dollar',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-3.0',
                    'Buy Swap': '-2.5',
                    Spread: '0.5'
                }
            ]
        },
        {
            id: 'tabs-stocks',
            label: 'Stocks',
            content: [
                {
                    Symbol: 'AAPL',
                    Description: 'Apple Inc.',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.5',
                    'Buy Swap': '-0.3',
                    Spread: '0.02'
                },
                {
                    Symbol: 'GOOGL',
                    Description: 'Alphabet Inc. Class A',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.6',
                    'Buy Swap': '-0.4',
                    Spread: '0.05'
                },
                {
                    Symbol: 'MSFT',
                    Description: 'Microsoft Corporation',
                    Digits: 2,
                    'Contract Size': '1',
                    'Min/Max Volume': '0.01/100',
                    'Volume Step': '0.01',
                    'Sell Swap': '-0.4',
                    'Buy Swap': '-0.2',
                    Spread: '0.02'
                }
            ]
        }
    ]
}

const notesData = {
    title: 'Important Notes:',
    notes: [
        'Contract Size for Forex currencies in Mini account type is 10,000',
        'Swap is charged on Spot financial instruments only',
        '3 day swap is charged on Wednesday',
        'All spreads are variable and may widen during news events',
        'Trading hours may vary during holidays and market closures',
        'Leverage up to 1:500 available for eligible clients (subject to regulatory restrictions)'
    ]
}

const ctaData = {
    heading: 'Ready to Start Trading?',
    description: 'Open your account today and access all these trading instruments with competitive spreads and professional execution.',
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
    ]
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />

            <section className="bg-white py-20">
                <SpecificationsDisclaimer data={disclaimerData} />
                <TradingSpecificationsTabs data={specificationsTabsData} />
                <SpecificationsNotes data={notesData} />
            </section>

            <StartTradingCTA data={ctaData} />
        </main>
    )
}

export default page
