// app/COMMON/SecurityBestPractices.js
import React from 'react'
import { Edit, Smartphone, Shield } from 'lucide-react'

const iconMap = {
    Edit, Smartphone, Shield
}

export default function SecurityBestPractices({ data }) {
    const { heading, description, practices } = data

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {practices.map((practice, index) => {
                        const IconComp = iconMap[practice.iconName] || Shield
                        return (
                            <div
                                key={index}
                                className="bg-white  rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-16 h-16 ${practice.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <IconComp className={`w-8 h-8 ${practice.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {practice.title}
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600 ">
                                    {practice.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
