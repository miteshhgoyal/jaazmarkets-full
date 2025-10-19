import React from 'react'
import Link from "next/link"

export default function AvailablePlatforms({ data }) {
    const { heading, description, platforms } = data

    return (
        <section className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {platforms.map((platform, index) => (
                        <div key={index} className="text-center group">
                            <div className="bg-gray-50  rounded-2xl p-8 hover:shadow-lg transition-all group-hover:scale-105">
                                <div className={`w-20 h-20 ${platform.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <svg className={`w-10 h-10 ${platform.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={platform.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {platform.title}
                                </h3>
                                <p className="text-gray-600  mb-6 text-sm">
                                    {platform.description}
                                </p>
                                <a
                                    href={platform.link}
                                    className="inline-flex items-center text-primary-orange font-medium hover:underline"
                                >
                                    {platform.buttonText}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
