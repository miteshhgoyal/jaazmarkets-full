import React from 'react'
import Link from "next/link"

export default function RegulatoryReporting({ data }) {
    const { heading, description, reports } = data

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {reports.map((report, index) => (
                        <div
                            key={index}
                            className="bg-white  rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-16 h-16 ${report.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <svg className={`w-8 h-8 ${report.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={report.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900  mb-4">
                                {report.title}
                            </h3>
                            <p className="text-gray-600  text-sm mb-4">
                                {report.description}
                            </p>
                            <a
                                href={report.link}
                                className="text-primary-orange hover:text-primary-orange/80 font-medium text-sm"
                            >
                                {report.linkText} →
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
