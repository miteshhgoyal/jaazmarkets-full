// app/COMMON/SystemRequirements.js
import React from 'react'

export default function SystemRequirements({ data }) {
    const { heading, description, systems } = data

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {systems.map((system, index) => (
                        <div key={index} className="bg-gray-50  rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <div className={`w-12 h-12 ${system.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                                    <svg className={`w-6 h-6 ${system.iconColor}`} fill="currentColor" viewBox="0 0 24 24">
                                        <path d={system.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 ">
                                    {system.name} Requirements
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {system.requirements.map((req, reqIndex) => (
                                    <div key={reqIndex}>
                                        <h4 className="font-semibold text-gray-900  mb-3">
                                            {req.type}
                                        </h4>
                                        <div className="space-y-2 text-sm text-gray-600 ">
                                            {req.specs.map((spec, specIndex) => (
                                                <div key={specIndex} className="flex items-center">
                                                    <span className="w-20 font-medium">{spec.label}:</span>
                                                    <span>{spec.value}</span>
                                                </div>
                                            ))}
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
