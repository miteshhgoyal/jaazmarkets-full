import Link from "next/link"
import React from 'react'

export default function TradingTips({ data }) {
    const { heading, sections, cta } = data

    return (
        <section className="py-8 px-8">

            <div className="mx-auto bg-gradient-to-br from-primary-orange/5 to-blue-50  rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900  mb-6 text-center">
                    {heading}
                </h3>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-semibold text-gray-900  mb-4 flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={section.icon} />
                                </svg>
                                {section.title}
                            </h4>
                            <ul className="space-y-2 text-gray-600 ">
                                {section.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start">
                                        <span className="w-1.5 h-1.5 bg-primary-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {cta && (
                    <div className="text-center mt-8">
                        <a
                            href={cta.link}
                            className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cta.icon} />
                            </svg>
                            {cta.text}
                        </a>
                    </div>
                )}
            </div>

        </section>
    )
}
