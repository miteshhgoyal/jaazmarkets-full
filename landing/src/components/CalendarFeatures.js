// app/COMMON/CalendarFeatures.js
import React from 'react'

export default function CalendarFeatures({ data }) {
    const { features } = data

    return (
        <section className="py-12 px-8">

            <div className="grid md:grid-cols-3 gap-8 mx-auto">
                {features.map((feature, index) => (
                    <div key={index} className="bg-gray-50  rounded-xl p-6">
                        <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mb-4`}>
                            <svg className={`w-6 h-6 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900  mb-2">
                            {feature.title}
                        </h3>
                        <p className="text-gray-600  text-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>

        </section>
    )
}
