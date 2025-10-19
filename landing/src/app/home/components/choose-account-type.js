import React from 'react'
import Link from "next/link";

const ChooseAccountType = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50   ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        Choose Your <span className="text-primary-orange">Account Type</span>
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        Select the perfect account type that matches your trading style and experience level.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white  rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 ">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900  mb-2">Standard</h3>
                            <p className="text-gray-600 ">Perfect for beginners</p>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                From 1.0 pips spreads
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Up to 1:500 leverage
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                $100 minimum deposit
                            </li>
                        </ul>
                        <a href="/trading/account-types" className="block w-full text-center py-3 px-4 border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50 :bg-gray-700 transition font-medium">
                            Learn More
                        </a>
                    </div>

                    <div className="bg-white  rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border-2 border-primary-orange relative">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-primary-orange text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                        </div>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900  mb-2">Raw</h3>
                            <p className="text-gray-600 ">For active traders</p>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                From 0.0 pips spreads
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Up to 1:500 leverage
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                $500 minimum deposit
                            </li>
                        </ul>
                        <a href="https://client.jaazmarkets.com/account?tab=register" className="block w-full text-center py-3 px-4 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition font-medium">
                            Open Account
                        </a>
                    </div>

                    <div className="bg-white  rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 ">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900  mb-2">Pro</h3>
                            <p className="text-gray-600 ">For professional traders</p>
                        </div>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Institutional spreads
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Up to 1:1000 leverage
                            </li>
                            <li className="flex items-center text-gray-600 ">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                $10,000 minimum deposit
                            </li>
                        </ul>
                        <a href="/trading/account-types" className="block w-full text-center py-3 px-4 border border-gray-300  text-gray-700  rounded-lg hover:bg-gray-50 :bg-gray-700 transition font-medium">
                            Learn More
                        </a>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500  max-w-4xl mx-auto">
                        * All spreads, leverage ratios, and minimum deposits shown are typical/indicative values for illustration purposes only. Actual trading conditions may vary based on market conditions, account equity, and regulatory requirements. Trading conditions are subject to change without notice.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ChooseAccountType
