import React from 'react'
import { DollarSign, Megaphone, HeadphonesIcon, BarChart3, Zap, Globe } from 'lucide-react'

const iconMap = {
    DollarSign, Megaphone, HeadphonesIcon, BarChart3, Zap, Globe
}

export default function PartnerBenefits({ data }) {
    const { heading, description, benefits } = data

    return (
        <section id="partner-benefits" className="py-16 md:py-24 bg-white ">
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
                    {benefits.map((benefit, index) => {
                        const IconComp = iconMap[benefit.iconName] || DollarSign
                        return (
                            <div key={index} className="bg-gray-50  rounded-xl p-8 text-center">
                                <div className={`w-16 h-16 ${benefit.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <IconComp className={`w-8 h-8 ${benefit.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 ">
                                    {benefit.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
