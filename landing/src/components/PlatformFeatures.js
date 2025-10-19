import React from 'react'

export default function PlatformFeatures({ data }) {
    const { heading, description, features } = data

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50  rounded-xl p-8 hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mb-6`}>
                                <svg className={`w-8 h-8 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900  mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600  mb-4">
                                {feature.description}
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 ">
                                {feature.benefits.map((benefit, benefitIndex) => (
                                    <li key={benefitIndex} className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
