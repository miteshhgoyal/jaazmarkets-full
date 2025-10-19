import React from 'react'

export default function GetStartedSteps({ data }) {
    const { heading, description, steps } = data

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

                <div className="max-w-5xl mx-auto">
                    <div className={`grid grid-cols-1 md:grid-cols-${steps.length} gap-8`}>
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <span className="text-2xl font-bold text-white">
                                        {step.number}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 ">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
