import React from 'react'
import Link from "next/link";

const WhyChooseUs = () => {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white  ">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\" fillOpacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/svg%3E')" }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-primary-orange/10 rounded-full mb-4">
                        <span className="text-primary-orange font-semibold text-sm">WHY CHOOSE US</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900  mb-6">
                        Start Forex Trading with Confidence
                    </h1>
                    <p className="text-xl text-gray-600  max-w-3xl mx-auto">
                        Join a trusted, <a href="/regulation" className="text-primary-orange hover:underline">regulated forex broker</a> that combines cutting-edge <a href="/platform" className="text-primary-orange hover:underline">MT5 technology</a> with exceptional service to deliver the ultimate online trading experience. Trade <a href="/forex" className="text-primary-orange hover:underline">forex</a>, <a href="/stocks" className="text-primary-orange hover:underline">stocks</a>, <a href="/commodities" className="text-primary-orange hover:underline">commodities</a>, and <a href="/crypto" className="text-primary-orange hover:underline">crypto</a> with competitive spreads.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white  rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 ">
                            <div className="flex items-start">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-orange to-orange-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900  mb-3">Ultra-Fast Forex Execution</h3>
                                    <p className="text-gray-600  mb-4">Experience lightning-fast forex trade execution with our cutting-edge trading infrastructure. No delays, no requotes on currency pairs.</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Under 30ms execution</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>99.9% uptime</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white  rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 ">
                            <div className="flex items-start">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900  mb-3">Competitive Trading Costs</h3>
                                    <p className="text-gray-600  mb-4">Enjoy some of the tightest spreads in the industry with transparent pricing and no hidden fees.</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Spreads from 0.0 pips</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>No hidden charges</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white  rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 ">
                            <div className="flex items-start">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mr-6 flex-shrink-0">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900  mb-3">Secure &amp; Regulated</h3>
                                    <p className="text-gray-600  mb-4">Trade with peace of mind knowing your funds are protected and we operate under strict regulatory oversight.</p>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Segregated accounts</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 ">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>SSL encryption</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            <div className="bg-gradient-to-br from-primary-orange via-orange-500 to-orange-600 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                        </svg>
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4">Ready to Start Trading?</h3>
                                    <p className="text-white/90 mb-8">Join thousands of successful traders and experience the difference with our platform.</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Open account in 3 minutes</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>Start with as low as $100</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>24/5 dedicated support</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <a href="https://client.jaazmarkets.com/account?tab=register" className="block w-full py-4 px-6 bg-white text-primary-orange rounded-xl hover:bg-gray-100 transition font-bold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                            Create Live Account
                                        </a>
                                        <a href="/demo" className="block w-full py-4 px-6 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition font-semibold text-center border border-white/30">
                                            Try Demo First
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    <div className="bg-white  rounded-2xl p-6 text-center shadow-lg border border-gray-100 ">
                        <div className="text-3xl lg:text-4xl font-bold text-primary-orange mb-2">500+</div>
                        <p className="text-gray-600 ">Trading Instruments</p>
                    </div>
                    <div className="bg-white  rounded-2xl p-6 text-center shadow-lg border border-gray-100 ">
                        <div className="text-3xl lg:text-4xl font-bold text-primary-orange mb-2">24/5</div>
                        <p className="text-gray-600 ">Customer Support</p>
                    </div>
                    <div className="bg-white  rounded-2xl p-6 text-center shadow-lg border border-gray-100 ">
                        <div className="text-3xl lg:text-4xl font-bold text-primary-orange mb-2">0.0</div>
                        <p className="text-gray-600 ">Spreads From</p>
                    </div>
                    <div className="bg-white  rounded-2xl p-6 text-center shadow-lg border border-gray-100 ">
                        <div className="text-3xl lg:text-4xl font-bold text-primary-orange mb-2">1:500</div>
                        <p className="text-gray-600 ">Max Leverage</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChooseUs
