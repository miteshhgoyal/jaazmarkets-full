import React from 'react'

export default function ClientSuccessStats({ data }) {
    const { heading, description, stats } = data

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
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary-orange mb-2">
                                {stat.value}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {stat.title}
                            </h3>
                            <p className="text-gray-600">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
