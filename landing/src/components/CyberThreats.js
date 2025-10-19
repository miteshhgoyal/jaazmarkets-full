// app/COMMON/CyberThreats.js
import React from 'react'

export default function CyberThreats({ data }) {
    const { heading, description, threats } = data

    return (
        <section id="threats" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {threats.map((threat, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-16 h-16 ${threat.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <svg className={`w-8 h-8 ${threat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={threat.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {threat.title}
                            </h3>
                            <p className="text-gray-600">
                                {threat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
