import Link from "next/link";

const AllProducts = () => {
    return (
        <main>
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0">

                        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute top-[25%] left-[85%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-[35%] left-[20%] w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-[45%] left-[75%] w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute top-[55%] left-[15%] w-1.5 h-1.5 bg-primary-orange rounded-full animate-ping opacity-80" style={{ animationDelay: '3' }}></div>
                        <div className="absolute top-[65%] left-[90%] w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: '1.5' }}></div>
                        <div className="absolute top-[75%] left-[30%] w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '4' }}></div>
                        <div className="absolute top-[85%] left-[70%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-55" style={{
                            animationDelay: '2.5'
                        }}></div >


                        <div className="absolute top-[20%] left-[45%] w-1 h-1 bg-red-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '3.5' }}></div >
                        <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-65" style={{ animationDelay: '0.8' }}></div >
                        <div className="absolute top-[40%] left-[5%] w-2 h-2 bg-primary-orange rounded-full animate-ping opacity-75" style={{ animationDelay: "1.8" }}></div >
                        <div className="absolute top-[50%] left-[95%] w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '4.2' }}></div >
                        <div className="absolute top-[60%] left-[40%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '2.8' }}></div >
                        <div className="absolute top-[70%] left-[80%] w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: '1.2' }}></div >
                        <div className="absolute top-[80%] left-[25%] w-2 h-2 bg-green-400 rounded-full animate-ping opacity-65" style={{ animationDelay: '3.8' }}></div >
                        <div className="absolute top-[90%] left-[55%] w-1.5 h-1.5 bg-primary-orange rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.3' }}></div >


                        <div className="absolute top-[12%] left-[65%] w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-35" style={{ animationDelay: '5' }}></div >
                        <div className="absolute top-[22%] left-[35%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-55" style={{ animationDelay: '1.7' }}></div >
                        <div className="absolute top-[32%] left-[88%] w-1 h-1 bg-green-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '3.2' }}></div >
                        <div className="absolute top-[42%] left-[12%] w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.7' }}></div >
                        <div className="absolute top-[52%] left-[78%] w-1 h-1 bg-primary-orange rounded-full animate-ping opacity-50" style={{ animationDelay: '4.5' }}></div >
                        <div className="absolute top-[62%] left-[48%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: '2.2' }}></div >
                        <div className="absolute top-[72%] left-[8%] w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-65" style={{ animationDelay: '1.4' }}></div >
                        <div className="absolute top-[82%] left-[92%] w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '3.7' }}></div >
                    </div >


                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <svg viewBox="0 0 800 600" className="w-full h-full">

                            <path d="M0,400 Q200,350 400,300 T800,200" stroke="#10B981" strokeWidth="3" fill="none" className="animate-draw-line">
                                <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite"></animate>
                            </path>

                            <path d="M0,200 Q200,250 400,300 T800,400" stroke="#EF4444" strokeWidth="3" fill="none" className="animate-draw-line" style={{ animationDelay: 2 }}>
                                <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite" begin="2s"></animate>
                            </path>

                            <path d="M0,300 Q200,280 400,320 T800,300" stroke="#F59E0B" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: 4 }}>
                                <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite" begin="4s"></animate>
                            </path>
                        </svg >
                    </div >


                    <div className="absolute top-20 left-10 transform rotate-12 opacity-20">
                        <div className="bg-gray-800 rounded-lg p-4 border border-primary-orange/30 animate-float">
                            <div className="text-green-400 text-sm font-mono">EURUSD ↗</div>
                            <div className="text-white text-lg font-bold">1.0847</div>
                            <div className="text-green-400 text-xs">+0.0023</div>
                        </div>
                    </div>

                    <div className="absolute top-40 right-20 transform -rotate-6 opacity-20">
                        <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30 animate-float" style={{ animationDelay: 2 }}>
                            <div className="text-red-400 text-sm font-mono">GBPUSD ↘</div>
                            <div className="text-white text-lg font-bold">1.2634</div>
                            <div className="text-red-400 text-xs">-0.0019</div>
                        </div>
                    </div >

                    <div className="absolute bottom-40 left-1/4 transform rotate-3 opacity-20">
                        <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/30 animate-float" style={{ animationDelay: 4 }}>
                            <div className="text-blue-400 text-sm font-mono">BTC/USD ↗</div>
                            <div className="text-white text-lg font-bold">43,250</div>
                            <div className="text-green-400 text-xs">+1,847</div>
                        </div>
                    </div >


                    <div className="absolute bottom-20 right-10 opacity-20">
                        <svg width="150" height="100" viewBox="0 0 150 100">

                            <g className="animate-pulse">
                                <rect x="10" y="30" width="8" height="40" fill="#10B981" className="animate-scale-y"></rect>
                                <line x1="14" y1="20" x2="14" y2="80" stroke="#10B981" strokeWidth="2"></line>
                            </g>
                            <g className="animate-pulse" style={{ animationDelay: 0.5 }}>
                                <rect x="30" y="40" width="8" height="30" fill="#EF4444" className="animate-scale-y"></rect>
                                <line x1="34" y1="25" x2="34" y2="75" stroke="#EF4444" strokeWidth="2"></line>
                            </g>
                            <g className="animate-pulse" style={{ animationDelay: 1 }}>
                                <rect x="50" y="20" width="8" height="50" fill="#10B981" className="animate-scale-y"></rect>
                                <line x1="54" y1="15" x2="54" y2="85" stroke="#10B981" strokeWidth="2"></line>
                            </g>
                            <g className="animate-pulse" style={{ animationDelay: 1.5 }}>
                                <rect x="70" y="35" width="8" height="35" fill="#10B981" className="animate-scale-y"></rect>
                                <line x1="74" y1="20" x2="74" y2="80" stroke="#10B981" strokeWidth="2"></line>
                            </g >
                            <g className="animate-pulse" style={{ animationDelay: 2 }}>
                                <rect x="90" y="45" width="8" height="25" fill="#EF4444" className="animate-scale-y"></rect>
                                <line x1="94" y1="30" x2="94" y2="85" stroke="#EF4444" strokeWidth="2"></line>
                            </g >
                        </svg >
                    </div >


                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-orange opacity-5 rounded-full filter blur-3xl animate-blob"></div>
                    <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-green-500 opacity-5 rounded-full filter blur-3xl animate-blob animationDelay-2000"></div>
                    <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-600 opacity-5 rounded-full filter blur-3xl animate-blob animationDelay-4000"></div>


                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
                </div >

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32">
                    <div className="max-w-6xl mx-auto text-center">

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tighter tracking-tight mb-8">
                            Master the Markets.<br />
                            <span className="text-primary-orange">Trade with Confidence.</span>
                        </h1>


                        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                            Join thousands of traders who choose <span className="text-primary-orange font-semibold">Jazz Markets</span> for lightning-fast execution, razor-sharp spreads, and institutional-grade trading technology.
                        </p>


                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                                <div className="text-primary-orange text-2xl font-bold">0.0</div>
                                <div className="text-gray-300 text-sm">Pips Spreads</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                                <div className="text-green-400 text-2xl font-bold">50ms</div>
                                <div className="text-gray-300 text-sm">Execution</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                                <div className="text-blue-400 text-2xl font-bold">500+</div>
                                <div className="text-gray-300 text-sm">Instruments</div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                                <div className="text-yellow-400 text-2xl font-bold">24/7</div>
                                <div className="text-gray-300 text-sm">Support</div>
                            </div>
                        </div>


                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                            <a href="https://client.jaazmarkets.com/account?tab=register" target="_blank" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-orange to-orange-700 hover:from-primary-orange-dark hover:to-primary-orange text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                                Start Trading Today
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </a>
                            <a href="/demo" target="_blank" className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-400 text-gray-300 text-lg font-semibold rounded-lg hover:bg-gray-400/10 hover:border-white hover:text-white transition-all transform hover:scale-105">
                                Try Demo Account
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </a>
                        </div>


                        <div className="pt-8 border-t border-gray-800/50 flex flex-wrap justify-center gap-x-12 gap-y-6">
                            <div className="flex items-center text-gray-300 hover:text-primary-orange transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-orange mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                                <span className="font-medium">Regulated &amp; Secure</span>
                            </div>
                            <div className="flex items-center text-gray-300 hover:text-green-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                <span className="font-medium">Ultra-Fast Execution</span>
                            </div>
                            <div className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                                <span className="font-medium">Institutional Spreads</span>
                            </div>
                            <div className="flex items-center text-gray-300 hover:text-yellow-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="font-medium">24/7 Expert Support</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section >


            <section className="bg-white  py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                            Trade Global Markets
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                            Access thousands of trading instruments across multiple asset classes with competitive spreads, fast execution, and professional tools.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-orange mb-2">60+</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Major Forex Pairs</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-orange mb-2">1000+</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Global Stocks</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-orange mb-2">30+</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Cryptocurrencies</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 10l3-3 3 3"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-orange mb-2">25+</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Commodities &amp; Metals</p>
                        </div>
                    </div>
                </div>
            </section>


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


            <section className="bg-white  py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                            Why Choose Jazz Markets?
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                            Professional trading conditions designed to help you succeed across all asset classes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900  mb-3">Lightning Fast Execution</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Orders executed in milliseconds with no requotes or rejections.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900  mb-3">Competitive Spreads</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Industry-leading spreads across all asset classes and account types.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900  mb-3">Regulated &amp; Secure</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Your funds are protected with segregated accounts and regulatory oversight.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg lg:text-xl font-semibold text-gray-900  mb-3">24/7 Support</h3>
                            <p className="text-gray-600  text-sm lg:text-base leading-relaxed">Professional multilingual support available around the clock.</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-gradient-to-r from-primary-orange to-orange-600 py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Start Trading?
                        </h2>
                        <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                            Join thousands of traders who choose Jazz Markets for professional trading conditions across all asset classes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://client.jaazmarkets.com/account?tab=register" target="_blank" className="inline-flex items-center px-8 py-4 bg-white text-primary-orange font-medium rounded-lg hover:bg-gray-100 transition text-lg">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Open Live Account
                            </a>
                            <a href="/demo" target="_blank" className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-orange transition text-lg">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                Try Demo Account
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </main >
    );
};

export default AllProducts;
