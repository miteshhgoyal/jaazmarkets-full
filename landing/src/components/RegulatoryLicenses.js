import React from 'react'

export default function RegulatoryLicenses({ data }) {
    const { heading, description, licenses } = data

    return (
        <section id="licenses" className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="max-w-2xl mx-auto">
                    {licenses.map((license, index) => (
                        <div
                            key={index}
                            className="bg-white  rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className="text-center mb-6">
                                <div className={`w-20 h-20 ${license.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className={`text-2xl font-bold ${license.textColor}`}>
                                        {license.shortName}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-2">
                                    {license.title}
                                </h3>
                                <p className="text-gray-600  text-sm">
                                    {license.subtitle}
                                </p>
                            </div>
                            <div className="space-y-4">
                                {license.details.map((detail, detailIndex) => (
                                    <div key={detailIndex} className="flex justify-between items-center">
                                        <span className="text-gray-600 ">
                                            {detail.label}
                                        </span>
                                        <span className={`font-semibold ${detail.valueClass || 'text-gray-900 '}`}>
                                            {detail.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200 ">
                                <ul className="space-y-2 text-sm text-gray-600 ">
                                    {license.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
