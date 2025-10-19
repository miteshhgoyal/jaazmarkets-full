import React from 'react'
import Link from "next/link";

const Security = () => {
    return (
        <section className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        <span className="text-primary-orange">Security</span> &amp; Regulation
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        Your safety is our priority. Trade with confidence knowing your funds are protected and we operate under strict regulatory oversight.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">Segregated Funds</h3>
                        <p className="text-gray-600  text-sm">Client funds are kept separate from company funds in top-tier banks.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">SSL Encryption</h3>
                        <p className="text-gray-600  text-sm">Bank-level 256-bit SSL encryption protects all your personal data.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">Licensed &amp; Regulated</h3>
                        <p className="text-gray-600  text-sm">Fully licensed and regulated by top-tier financial authorities.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 /30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">24/7 Support</h3>
                        <p className="text-gray-600  text-sm">Round-the-clock customer support in multiple languages.</p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <a href="/trust/security" className="inline-flex items-center px-6 py-3 border border-primary-orange text-primary-orange font-semibold rounded-lg hover:bg-primary-orange hover:text-white transition">
                        Learn More About Security
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Security
