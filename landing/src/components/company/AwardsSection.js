import React from 'react'
import { Star, CheckCircle, Zap, BookOpen } from 'lucide-react'

const iconMap = {
    Star, CheckCircle, Zap, BookOpen
}

export default function AwardsSection({ data }) {
    const { heading, description, awards } = data

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading.start} <span className="text-primary-orange">{heading.highlight}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {awards.map((award, index) => {
                        const IconComp = iconMap[award.iconName] || Star
                        return (
                            <div key={index} className="text-center bg-white rounded-xl p-8 shadow-sm">
                                <div className={`w-16 h-16 ${award.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <IconComp className={`w-8 h-8 ${award.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {award.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {award.source}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
