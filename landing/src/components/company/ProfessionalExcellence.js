import React from 'react'
import { BarChart3, Code, Target, Shield, Zap } from 'lucide-react'

const iconMap = {
    BarChart3, Code, Target, Shield, Zap
}

export default function ProfessionalExcellence({ data }) {
    const { badge, title, description, expertiseAreas, additionalAreas } = data

    return (
        <section className="py-16 md:py-24 bg-gray-50">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {expertiseAreas.map((area, index) => {
                        const IconComp = iconMap[area.iconName] || BarChart3
                        return (
                            <div key={index} className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-16 h-16 bg-gradient-to-br ${area.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                                    <IconComp className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{area.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">{area.description}</p>
                                <div className="mt-6 text-center">
                                    <div className="text-3xl font-bold text-primary-orange mb-2">{area.stat}</div>
                                    <div className="text-sm text-gray-600">{area.statLabel}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Additional expertise areas */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {additionalAreas.map((area, index) => {
                        const IconComp = iconMap[area.iconName] || Shield
                        return (
                            <div key={index} className={`bg-gradient-to-r ${area.gradient} rounded-xl p-6`}>
                                <div className="flex items-start">
                                    <div className={`w-12 h-12 ${area.iconBg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                                        <IconComp className={`w-6 h-6 ${area.iconColor}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{area.title}</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">{area.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
