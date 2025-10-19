// app/COMMON/SecurityFeatures.js
import React from 'react'

export default function SecurityFeatures({ data }) {
    const { heading, description, sections } = data

    return (
        <section className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h3 className="text-2xl font-bold text-gray-900  mb-8">
                                {section.title}
                            </h3>
                            <div className="space-y-6">
                                {section.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start">
                                        <div className={`w-8 h-8 ${section.checkColor} rounded-full flex items-center justify-center mt-1 mr-4`}>
                                            <svg className={`w-5 h-5 ${section.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900  mb-2">
                                                {feature.title}
                                            </h4>
                                            <p className="text-gray-600 ">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
