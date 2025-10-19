// app/COMMON/TradingCategories.js
import React from 'react'
import { Box, DollarSign, Layers } from 'lucide-react'

const iconMap = {
    Box, DollarSign, Layers
}

export default function TradingCategories({ data }) {
    const { heading, description, categories } = data

    return (
        <section className="bg-gray-50  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                        {heading}
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
                    {categories.map(({ iconName, iconSvg, iconBg, colorClass, title, desc, description, list, stocks }, i) => {
                        const IconComp = iconMap[iconName] || Box
                        return (
                            <div
                                key={i}
                                className="bg-white  rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
                            >
                                {/* Handle both lucide icons and custom SVG */}
                                {iconName ? (
                                    <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        <IconComp className="w-8 h-8 text-white" />
                                    </div>
                                ) : (
                                    <div className={`${colorClass} rounded-full flex items-center justify-center mx-auto mb-6`} style={{ width: 64, height: 64 }}>
                                        <div className="w-8 h-8 text-white" dangerouslySetInnerHTML={{ __html: iconSvg }} />
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900  mb-4">{title}</h3>
                                <p className="text-gray-600  mb-4 leading-relaxed">{desc || description}</p>
                                <ul className="text-sm text-gray-500  space-y-1">
                                    {(list || stocks)?.map((item, idx) => (
                                        <li key={idx}>• {item}</li>
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
