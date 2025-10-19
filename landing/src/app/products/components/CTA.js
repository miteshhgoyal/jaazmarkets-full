import React from 'react'
import Link from "next/link";

const CTA = () => {
    return (
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
    )
}

export default CTA
