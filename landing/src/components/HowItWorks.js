import React from 'react'
import { Smartphone } from 'lucide-react'

export default function HowItWorks({ data }) {
    const { heading, description, steps, platformInfo } = data

    return (
        <section className="bg-white  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                            {heading}
                        </h2>
                        <p className="text-lg text-gray-600  mb-8 leading-relaxed">
                            {description}
                        </p>

                        <div className="space-y-6">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                                        <span className="text-white font-bold text-sm">{step.stepNumber}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900  mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 ">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200   rounded-xl p-8 text-center">
                            <Smartphone className="w-32 h-32 mx-auto text-primary-orange mb-6" />
                            <h3 className="text-lg font-semibold text-gray-900  mb-2">
                                {platformInfo?.title || "MT5 Trading Platform"}
                            </h3>
                            <p className="text-gray-600  text-sm">
                                {platformInfo?.description || "Professional trading tools at your fingertips"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
