import { DollarSign, Building2, ArrowUpRight, Package } from "lucide-react";

export default function TradeGlobalMarkets() {
    return (
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
    );
}
