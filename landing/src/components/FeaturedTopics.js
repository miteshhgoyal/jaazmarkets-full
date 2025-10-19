import React from 'react'
import { BarChart3, Shield, DollarSign, Brain, Settings, Zap } from 'lucide-react'

const iconMap = {
    BarChart3, Shield, DollarSign, Brain, Settings, Zap
}

export default function FeaturedTopics({ data }) {
    const { heading, description, topics } = data

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map((topic, index) => {
                        const IconComp = iconMap[topic.iconName] || BarChart3
                        return (
                            <div key={index} className="bg-white  rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`h-48 bg-gradient-to-br ${topic.gradientFrom} ${topic.gradientTo} flex items-center justify-center`}>
                                    <IconComp className="w-16 h-16 text-white" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900  mb-3">
                                        {topic.title}
                                    </h3>
                                    <p className="text-gray-600  mb-4 text-sm">
                                        {topic.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 ">
                                            {topic.duration}
                                        </span>
                                        <span className="text-gray-400 font-medium text-xs">
                                            Preview Only
                                        </span>
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
