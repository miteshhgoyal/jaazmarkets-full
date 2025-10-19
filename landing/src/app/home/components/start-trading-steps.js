import React from 'react'
import Link from "next/link";

const StartTradingSteps = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50   ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        Start Trading in <span className="text-primary-orange">3 Easy Steps</span>
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        Get started with our platform in minutes. Open your account, fund it, and start trading.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center relative">
                        <div className="w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-white">1</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900  mb-4">Register</h3>
                        <p className="text-gray-600  mb-6">
                            Complete our simple registration form and verify your account in minutes.
                        </p>
                        <div className="hidden md:block absolute top-10 -right-4 w-8 h-8">
                            <svg className="w-full h-full text-primary-orange" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="text-center relative">
                        <div className="w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-white">2</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900  mb-4">Fund</h3>
                        <p className="text-gray-600  mb-6">
                            Deposit funds using your preferred payment method. Multiple options available.
                        </p>
                        <div className="hidden md:block absolute top-10 -right-4 w-8 h-8">
                            <svg className="w-full h-full text-primary-orange" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 bg-primary-orange rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-white">3</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900  mb-4">Trade</h3>
                        <p className="text-gray-600  mb-6">
                            Access our MT5 platform and start trading forex, commodities, and indices.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a href="https://client.jaazmarkets.com/account?tab=register" className="inline-flex items-center px-8 py-4 bg-primary-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition text-lg">
                        Start Trading Now
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default StartTradingSteps
