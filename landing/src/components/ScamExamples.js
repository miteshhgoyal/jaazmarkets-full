// app/COMMON/ScamExamples.js
import React from 'react'

export default function ScamExamples({ data }) {
    const { heading, description, examples } = data

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {heading}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {description}
                        </p>
                    </div>
                    <div className="space-y-8">
                        {examples.map((example, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl p-8 border-l-4 ${example.borderColor}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 ${example.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <svg className={`w-6 h-6 ${example.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={example.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {example.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {example.description}
                                        </p>
                                        <div className={`${example.alertBg} border ${example.alertBorder} rounded-lg p-4`}>
                                            <p className={`${example.alertText} font-semibold`}>
                                                🚨 Red Flags:
                                            </p>
                                            <ul className={`${example.listText} mt-2 space-y-1`}>
                                                {example.redFlags.map((flag, flagIndex) => (
                                                    <li key={flagIndex}>• {flag}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
