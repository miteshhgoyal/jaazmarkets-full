import React from 'react'
import {
    Activity, Clock, TrendingUp, Zap, DollarSign,
    Archive, Cpu, CheckCircle, BarChart3, Gem, Globe
} from 'lucide-react'

const iconMap = {
    Activity, Clock, TrendingUp, Zap, DollarSign,
    Archive, Cpu, CheckCircle, BarChart3, Gem, Globe
}

export default function TradingFeatures({ data }) {
    const { heading, description, features } = data

    return (
        <section className="bg-white  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                        {heading}
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {features.map(({ iconName, title, desc, iconBg }, i) => {
                        const IconComp = iconMap[iconName] || Activity
                        return (
                            <div key={i} className="text-center">
                                <div
                                    className={`w-20 h-20 bg-gradient-to-br ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}
                                >
                                    <IconComp className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg lg:text-xl font-semibold text-gray-900  mb-3">
                                    {title}
                                </h3>
                                <p className="text-gray-600  text-sm lg:text-base leading-relaxed">{desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
