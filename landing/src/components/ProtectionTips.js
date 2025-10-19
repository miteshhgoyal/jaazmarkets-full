// app/COMMON/ProtectionTips.js
'use client'
import React, { useState } from 'react'

export default function ProtectionTips({ data }) {
    const { heading, description, sections } = data
    const [openSection, setOpenSection] = useState(null)

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index)
    }

    return (
        <section id="protection" className="py-20 bg-white">
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
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                                <button
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                                    onClick={() => toggleSection(index)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center`}>
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={section.icon} />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 transform transition-transform ${openSection === index ? 'rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openSection === index && (
                                    <div className="px-8 pb-6">
                                        <ul className="space-y-3 text-gray-600">
                                            {section.tips.map((tip, tipIndex) => (
                                                <li key={tipIndex} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
