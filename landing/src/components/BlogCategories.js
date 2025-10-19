import React from 'react'
import { BarChart3, BookOpen, Zap, Newspaper, Settings, DollarSign } from 'lucide-react'

const iconMap = {
    BarChart3, BookOpen, Zap, Newspaper, Settings, DollarSign
}

export default function BlogCategories({ data }) {
    const { heading, categories } = data

    return (
        <section className="py-16 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => {
                        const IconComp = iconMap[category.iconName] || BarChart3
                        return (
                            <button
                                key={index}
                                className={`bg-white  p-4 rounded-lg text-center hover:shadow-lg transition border-2 ${category.active ? 'border-primary-orange' : 'border-transparent'
                                    }`}
                            >
                                <div className={`w-12 h-12 ${category.iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                    <IconComp className={`w-6 h-6 ${category.iconColor}`} />
                                </div>
                                <p className="text-sm font-semibold text-gray-900 ">
                                    {category.name}
                                </p>
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
