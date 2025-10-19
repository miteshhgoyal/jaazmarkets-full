import React from 'react'
import Link from "next/link"
import { Users, Building, Globe } from 'lucide-react'

const iconMap = {
    Users, Building, Globe
}

export default function PartnershipTypes({ data }) {
    const { heading, description, types } = data

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
                    {types.map((type, index) => {
                        const IconComp = iconMap[type.iconName] || Users
                        return (
                            <div
                                key={index}
                                className={`bg-gray-50  rounded-xl p-8 border-2 transition-colors ${type.featured ? 'border-primary-orange' : 'border-transparent hover:border-primary-orange'
                                    }`}
                            >
                                <div className="text-center mb-6">
                                    <div className={`w-16 h-16 ${type.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        <IconComp className={`w-8 h-8 ${type.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900  mb-4">
                                        {type.title}
                                    </h3>
                                    {type.badge && (
                                        <span className="inline-block px-3 py-1 bg-primary-orange text-white text-xs font-semibold rounded-full mb-4">
                                            {type.badge}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {type.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-sm text-gray-600 ">
                                            <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={type.buttonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition ${type.buttonStyle}`}
                                >
                                    {type.buttonText}
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
