import React from 'react'
import Link from "next/link";

const TradingInstruments = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50   ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        Explore Our <span className="text-primary-orange">Trading Instruments</span>
                    </h2>
                    <p className="text-lg text-gray-600  max-w-3xl mx-auto">
                        Access a diverse range of financial markets with <a href="/trading/conditions" className="text-primary-orange hover:underline">competitive spreads</a>, fast execution, and deep liquidity across all major asset classes. Explore our <a href="/trading/account-types" className="text-primary-orange hover:underline">account types</a> designed for every trading style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <a href="/trading/forex" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506025/forex_ztrbie.png" alt="Forex Trading - Currency Pairs with Spreads from 0.0 Pips" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Forex</h3>
                            <p className="text-gray-600  text-sm mb-3">Trade major, minor, and exotic currency pairs with competitive spreads from 0.0 pips</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/trading/indices" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506025/indices_noehtc.png" alt="Stock Indices Trading - S&P 500, NASDAQ, DAX, FTSE" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Indices</h3>
                            <p className="text-gray-600  text-sm mb-3">Trade global stock indices including S&P 500, NASDAQ, DAX, and FTSE with tight spreads</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/trading/stocks" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506013/commodities_gtd7wy.png" alt="Stock Trading - Global Shares from US, European & Asian Markets" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Stocks</h3>
                            <p className="text-gray-600  text-sm mb-3">Access shares of leading companies from US, European, and Asian markets worldwide</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/trading/commodities" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506013/stocks_mm3jta.png" alt="Commodities Trading" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Commodities</h3>
                            <p className="text-gray-600  text-sm mb-3">Trade energy, agricultural, and raw material commodities with competitive pricing</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/trading/metals" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506013/crypto_ex4fau.png" alt="Metals Trading" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Metals</h3>
                            <p className="text-gray-600  text-sm mb-3">Trade precious metals including Gold, Silver, Platinum, and Palladium with low spreads</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>

                    <a href="/trading/crypto" className="group relative overflow-hidden rounded-xl bg-white  shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative">
                            <img src="https://res.cloudinary.com/dknrega1a/image/upload/v1755506013/metals_wpgwxt.png" alt="Cryptocurrency Trading - Bitcoin, Ethereum & Digital Assets" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900  mb-2 group-hover:text-primary-orange transition-colors">Crypto</h3>
                            <p className="text-gray-600  text-sm mb-3">Trade popular cryptocurrencies like Bitcoin, Ethereum, and more with instant execution</p>
                            <div className="flex items-center text-primary-orange font-medium text-sm">
                                <span>Start Trading</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="mt-12 bg-white  rounded-xl p-6 shadow-md max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="w-12 h-12 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900  mb-2">500+ Instruments</h3>
                            <p className="text-gray-600  text-sm">Access over 500 trading instruments across all major asset classes</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-green-100 /30 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900  mb-2">Tight Spreads</h3>
                            <p className="text-gray-600  text-sm">Competitive spreads starting from 0.0 pips* on major currency pairs</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-blue-100 /30 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900  mb-2">No Hidden Fees</h3>
                            <p className="text-gray-600  text-sm">Transparent pricing with no hidden fees or commissions</p>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <a href="/products" className="inline-flex items-center px-6 py-3 border border-primary-orange text-primary-orange font-semibold rounded-lg hover:bg-primary-orange hover:text-white transition">
                            View All Products
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TradingInstruments
