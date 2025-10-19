import React from 'react'
import { BookOpen, BarChart3, Lightbulb } from 'lucide-react'

const iconMap = {
    BookOpen, BarChart3, Lightbulb
}

export default function LearningPaths({ data }) {
    const { heading, description, paths } = data

    return (
        <section id="courses" className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {paths.map((path, index) => {
                        const IconComp = iconMap[path.iconName] || BookOpen
                        return (
                            <div
                                key={index}
                                className={`bg-gray-50  rounded-xl p-8 border-2 transition-colors ${path.featured
                                        ? 'border-primary-orange'
                                        : 'border-transparent hover:border-primary-orange'
                                    }`}
                            >
                                <div className="text-center mb-6">
                                    <div className={`w-16 h-16 ${path.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        <IconComp className={`w-8 h-8 ${path.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900  mb-2">
                                        {path.title}
                                    </h3>
                                    <p className="text-sm text-gray-600  mb-4">
                                        {path.subtitle}
                                    </p>
                                    {path.badge && (
                                        <span className="inline-block px-3 py-1 bg-primary-orange text-white text-xs font-semibold rounded-full">
                                            {path.badge}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {path.topics.map((topic, topicIndex) => (
                                        <li key={topicIndex} className="flex items-center text-sm text-gray-600 ">
                                            <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {topic}
                                        </li>
                                    ))}
                                </ul>

                                <div className="w-full px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed text-center">
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Course Preview Only
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
