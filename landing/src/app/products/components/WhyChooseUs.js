import React from 'react'

const WhyChooseUs = () => {
    return (
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
    )
}

export default WhyChooseUs
