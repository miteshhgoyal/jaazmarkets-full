import React from 'react'
import TradeGlobalMarkets from './components/trade-global-markets'
import ChooseYourMarkets from './components/ChooseYourMarkets'
import WhyChooseUs from './components/WhyChooseUs'
import CTA from './components/CTA'
import StartTradingBanner from '../../components/StartTradingBanner'


function page() {
    return (
        <>
            <StartTradingBanner />
            <TradeGlobalMarkets />
            <ChooseYourMarkets />
            <WhyChooseUs />
            <CTA />
        </>
    )
}

export default page