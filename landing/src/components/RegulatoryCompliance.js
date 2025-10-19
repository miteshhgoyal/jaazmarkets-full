import React from 'react'
import { Shield, Lock, Target, CheckCircle } from 'lucide-react'

const iconMap = {
    Shield, Lock, Target, CheckCircle
}

export default function RegulatoryCompliance({ data }) {
    const { heading, description, features } = data

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const IconComp = iconMap[feature.iconName] || Shield
                        return (
                            <div key={index} className="text-center">
                                <div className={`w-20 h-20 ${feature.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <IconComp className={`w-10 h-10 ${feature.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 ">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
