import React from 'react'
import Link from "next/link";

const PopularCurrencies = () => {
    const coins = [
        { name: "BTC", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513738/bitcoin_i6inku.webp" },
        { name: "ETH", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513708/eth_xsbhdi.webp" },
        { name: "LTC", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513707/litecoin_oycyaa.webp" },
        { name: "ADA", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513708/cardano_dvewc4.webp" },
        { name: "SOL", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513708/solana_d7inhk.webp" },
        { name: "USDT", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513708/usdt_vqzcog.webp" },
        { name: "XRP", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513707/xrp_mxchfu.webp" },
        { name: "DASH", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513707/dash_aqmhms.webp" },
        { name: "DOT", icon: "https://res.cloudinary.com/dknrega1a/image/upload/v1755513707/dot_kzohdh.webp" },
    ];

    return (
        <section className="py-16 md:py-20 bg-gradient-to-r from-primary-orange via-orange-600 to-primary-orange">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Trade Popular <span className="text-orange-200">Cryptocurrencies</span>
                    </h2>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        Access the most traded digital assets with competitive spreads and leverage up to 1:100
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10">
                    {coins.map((coin, index) => (
                        <div className="group" key={index}>
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                                <img src={coin.icon} alt="coin" className="w-8 h-8 md:w-10 md:h-10 object-contain" loading="lazy" />
                            </div>
                            <div className="text-center mt-2">
                                <span className="text-xs text-white/80 font-medium">{coin.name}</span>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="text-center mt-12">
                    <a href="/trading/crypto" className="inline-flex items-center px-8 py-3 bg-white text-primary-orange font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        Start Crypto Trading
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default PopularCurrencies
