import React from 'react'
import { DollarSign, Star, BarChart3, Zap } from 'lucide-react'

const iconMap = {
    DollarSign, Star, BarChart3, Zap
}

export default function TradingInstruments({ data }) {
    const { heading, description, instruments } = data

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
                    {instruments.map((instrument, index) => {
                        const IconComp = iconMap[instrument.iconName] || DollarSign
                        return (
                            <div
                                key={index}
                                className="bg-gray-50  rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-16 h-16 ${instrument.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <IconComp className={`w-8 h-8 ${instrument.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {instrument.title}
                                </h3>
                                <div className="text-3xl font-bold text-primary-orange mb-2">
                                    {instrument.count}
                                </div>
                                <p className="text-gray-600  text-sm">
                                    {instrument.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
