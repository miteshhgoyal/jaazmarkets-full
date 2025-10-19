import React from 'react'
import { Eye, Zap, Shield, Sparkles } from 'lucide-react'

const iconMap = {
    Eye, Zap, Shield, Sparkles
}

export default function MissionValues({ data }) {
    const { badge, title, description, mission, values } = data

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <span className="inline-block px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-medium">
                            {badge}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {title.start} <span className="text-primary-orange">{title.highlight}</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-primary-orange to-primary-orange rounded-2xl p-8 md:p-12 mb-16 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{mission.title}</h3>
                    <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                        {mission.description}
                    </p>
                </div>

                {/* Core Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => {
                        const IconComp = iconMap[value.iconName] || Eye
                        return (
                            <div key={index} className="group bg-gray-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    <IconComp className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
