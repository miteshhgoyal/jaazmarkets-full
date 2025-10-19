import React from 'react'
import Link from "next/link"
import { BookOpen, Calculator, Video, Download } from 'lucide-react'

const iconMap = {
    BookOpen, Calculator, Video, Download
}

export default function LearningResources({ data }) {
    const { heading, description, resources } = data

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
                    {resources.map((resource, index) => {
                        const IconComp = iconMap[resource.iconName] || BookOpen
                        return (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 ${resource.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <IconComp className={`w-8 h-8 ${resource.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900  mb-4">
                                    {resource.title}
                                </h3>
                                <p className="text-gray-600  text-sm mb-6">
                                    {resource.description}
                                </p>
                                {resource.link ? (
                                    <a href={resource.link} className="text-primary-orange font-semibold hover:underline">
                                        {resource.linkText}
                                    </a>
                                ) : (
                                    <span className="text-gray-400 font-medium">
                                        {resource.status}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
