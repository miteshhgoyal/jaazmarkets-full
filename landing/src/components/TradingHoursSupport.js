import Link from "next/link"
import React from 'react'

export default function TradingHoursSupport({ data }) {
    const { heading, description, supportFeatures, buttonText, buttonHref, platformInfo } = data

    return (
        <section className="bg-white  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                            {heading}
                        </h2>
                        <p className="text-lg text-gray-600  mb-8 leading-relaxed">
                            {description}
                        </p>

                        <div className="space-y-6">
                            {supportFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900  mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 ">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <a
                                href={buttonHref}
                                className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {buttonText}
                            </a>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200   rounded-xl p-8 text-center">
                        <svg className="w-32 h-32 mx-auto text-primary-orange mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">
                            {platformInfo.title}
                        </h3>
                        <p className="text-gray-600  text-sm">
                            {platformInfo.description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
