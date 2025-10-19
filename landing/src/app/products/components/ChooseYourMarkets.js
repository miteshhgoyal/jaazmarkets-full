import React from 'react'
import Link from "next/link"

const ChooseYourMarkets = () => {
    return (
        <section className="bg-gray-50  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                        Choose Your Markets
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                        Explore our comprehensive range of trading instruments and find the markets that match your trading strategy.
                    </p>
                    <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-4 max-w-4xl mx-auto mt-6">
                        <p className="text-sm text-yellow-800 ">
                            <strong>Important Notice:</strong> All spreads, commissions, and leverage ratios shown below are typical/indicative values for illustration purposes only. Actual trading conditions may vary significantly based on market conditions, volatility, liquidity, account type, and regulatory requirements. Trading conditions are subject to change without prior notice.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">

                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Forex</h3>
                                <p className="text-sm text-gray-500 ">60+ Currency Pairs</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Trade major, minor, and exotic currency pairs with spreads from 0.0 pips and leverage up to 1:1000.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Spread:</span>
                                <span className="font-semibold text-primary-orange">0.0 pips</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:1000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Trading Hours:</span>
                                <span className="font-semibold text-gray-900 ">24/5</span>
                            </div>
                        </div>
                        <a href="/trading/forex" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Forex
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>


                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Stocks</h3>
                                <p className="text-sm text-gray-500 ">1000+ Global Stocks</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Access major stocks from NYSE, NASDAQ, LSE with competitive commissions starting from $2.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Commission:</span>
                                <span className="font-semibold text-primary-orange">$2.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:20</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Exchanges:</span>
                                <span className="font-semibold text-gray-900 ">Global</span>
                            </div>
                        </div>
                        <a href="/trading/stocks" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Stocks
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>


                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Cryptocurrencies</h3>
                                <p className="text-sm text-gray-500 ">30+ Digital Assets</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Trade Bitcoin, Ethereum, and 30+ crypto CFDs with 24/7 trading and competitive spreads.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Spread:</span>
                                <span className="font-semibold text-primary-orange">0.75%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:100</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Trading Hours:</span>
                                <span className="font-semibold text-gray-900 ">24/7</span>
                            </div>
                        </div>
                        <a href="/trading/crypto" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Crypto
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>


                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Indices</h3>
                                <p className="text-sm text-gray-500 ">20+ Global Indices</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Trade major stock indices including S&amp;P 500, NASDAQ, FTSE 100 with tight spreads and high leverage.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Spread:</span>
                                <span className="font-semibold text-primary-orange">0.4 pts</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:500</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Trading Hours:</span>
                                <span className="font-semibold text-gray-900 ">24/5</span>
                            </div>
                        </div>
                        <a href="/trading/indices" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Indices
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>


                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 10l3-3 3 3"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Precious Metals</h3>
                                <p className="text-sm text-gray-500 ">Gold, Silver, Platinum</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Trade safe-haven precious metals with competitive spreads and high leverage for portfolio diversification.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Spread:</span>
                                <span className="font-semibold text-primary-orange">0.20</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:1000</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Trading Hours:</span>
                                <span className="font-semibold text-gray-900 ">24/5</span>
                            </div>
                        </div>
                        <a href="/trading/metals" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Metals
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>


                    <div className="bg-white  rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100  group">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 ">Commodities</h3>
                                <p className="text-sm text-gray-500 ">Oil, Gas, Agriculture</p>
                            </div>
                        </div>
                        <p className="text-gray-600  mb-6 leading-relaxed">
                            Trade essential commodities including Crude Oil, Natural Gas, and Agricultural products with competitive conditions.
                        </p>
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Min Spread:</span>
                                <span className="font-semibold text-primary-orange">0.03</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Max Leverage:</span>
                                <span className="font-semibold text-gray-900 ">1:500</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 ">Trading Hours:</span>
                                <span className="font-semibold text-gray-900 ">24/5</span>
                            </div>
                        </div>
                        <a href="/trading/commodities" className="inline-flex items-center w-full justify-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition group-hover:shadow-md">
                            Trade Commodities
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ChooseYourMarkets
