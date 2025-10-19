import React from 'react'
import Link from "next/link";

const Banner = () => {
    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="text-primary-orange font-mono text-sm absolute top-20 left-20 animate-pulse">
                        EURUSD: 1.08473 ↗ +0.23%<br />
                        Volume: 2.3M | Spread: 0.1
                    </div>
                    <div className="text-white font-mono text-sm absolute top-40 right-32 animate-pulse" style={{ animationDelay: '1s' }}>
                        GBPUSD: 1.26341 ↘ -0.15%<br />
                        High: 1.2687 | Low: 1.2621
                    </div>
                    <div className="text-primary-orange font-mono text-sm absolute bottom-40 left-32 animate-pulse" style={{ animationDelay: '2s' }}>
                        GOLD: $2,023.50 ↗ +1.2%<br />
                        24h Change: +$24.30
                    </div>
                </div>

                <div className="absolute top-24 left-1/4 transform opacity-30 animate-[bounce_3s_ease-out_infinite]">
                    <div className="bg-gray-900 border border-primary-orange/30 rounded-lg shadow-2xl w-64 h-32 p-4">
                        <div className="text-primary-orange text-xs font-bold mb-1">PROFITABLE TRADE</div>
                        <div className="text-white text-lg font-bold">+$2,847.50</div>
                        <div className="text-primary-orange text-xs">EUR/USD Long Position</div>
                        <div className="text-gray-400 text-xs mt-1">Closed: +247 pips</div>
                    </div>
                </div>

                <div className="absolute bottom-32 right-1/4 transform opacity-30 animate-[bounce_3s_ease-out_infinite]" style={{ animationDelay: '3s' }}>
                    <div className="bg-black border border-white/30 rounded-lg shadow-2xl w-56 h-28 p-4">
                        <div className="text-white text-xs font-bold mb-1">MARKET ALERT</div>
                        <div className="text-primary-orange text-sm font-bold">NFP Release</div>
                        <div className="text-gray-300 text-xs">High Impact Event</div>
                        <div className="text-primary-orange text-xs mt-1">15:30 GMT Today</div>
                    </div>
                </div>

                <div className="absolute top-1/3 right-20 w-1 h-32 bg-gradient-to-b from-transparent via-primary-orange to-transparent opacity-60 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-16 w-1 h-24 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-primary-orange/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-primary-orange/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-6 py-3 bg-primary-orange/20 text-primary-orange rounded-full text-sm font-bold border border-primary-orange/30 mb-8">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            UNLEASH YOUR TRADING POWER
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-8">
                            <span className="block">DOMINATE</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-orange via-white to-primary-orange">THE MARKETS</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 font-bold max-w-4xl mx-auto leading-tight mb-8">
                            Where <span className="text-primary-orange">Elite Traders</span> Execute<br />
                            <span className="text-white">Institutional-Grade</span> Strategies
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                        <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl p-6 border border-primary-orange/50 text-center group hover:border-primary-orange transition-all">
                            <div className="text-primary-orange text-3xl font-black mb-2">0.0</div>
                            <div className="text-white font-bold text-sm">SPREADS</div>
                            <div className="text-gray-400 text-xs">From zero pips</div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center group hover:border-white transition-all">
                            <div className="text-white text-3xl font-bold mb-2">12ms</div>
                            <div className="text-white font-bold text-sm">EXECUTION</div>
                            <div className="text-gray-400 text-xs">Lightning speed</div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl p-6 border border-primary-orange/30 text-center group hover:border-primary-orange transition-all">
                            <div className="text-primary-orange text-3xl font-black mb-2">500+</div>
                            <div className="text-white font-bold text-sm">INSTRUMENTS</div>
                            <div className="text-gray-400 text-xs">Global markets</div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-sm rounded-xl p-6 border border-white/30 text-center group hover:border-white transition-all">
                            <div className="text-white text-3xl font-bold mb-2">1:500</div>
                            <div className="text-white font-bold text-sm">LEVERAGE</div>
                            <div className="text-gray-400 text-xs">Maximum power</div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
                            <a href="https://client.jaazmarkets.com/account?tab=register" className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary-orange to-orange-600 hover:from-orange-600 hover:to-primary-orange text-white text-lg font-black rounded-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-orange/50">
                                <span className="relative z-10">START DOMINATING</span>
                                <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                                <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            </a>
                            <a href="/platform" className="inline-flex items-center px-10 py-5 bg-transparent border-3 border-white text-white text-lg font-black rounded-xl hover:bg-white hover:text-black transition-all transform hover:scale-105">
                                DEMO TERMINAL
                                <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </a>
                        </div>

                        <div className="text-center text-gray-400">
                            <div className="text-sm font-bold mb-2">JOIN 50,000+ ELITE TRADERS</div>
                            <div className="flex justify-center items-center space-x-8 text-xs">
                                <span className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2 animate-pulse"></div>
                                    MARKETS OPEN
                                </span>
                                <span className="flex items-center">
                                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                    REAL-TIME DATA
                                </span>
                                <span className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-orange rounded-full mr-2 animate-pulse"></div>
                                    INSTANT EXECUTION
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
