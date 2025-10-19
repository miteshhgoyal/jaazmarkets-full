import React from 'react'
import Link from "next/link"

export default function SecuritySupport({ data }) {
    const { heading, description, supportOptions, buttons } = data

    return (
        <section className="py-20 bg-primary-orange">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {heading}
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        {description}
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {supportOptions.map((option, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">
                                    {option.title}
                                </h3>
                                <p className="text-white/80 mb-4">
                                    {option.description}
                                </p>
                                <p className={`${option.contactSize} font-bold`}>
                                    {option.contact}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.link}
                                className={`px-8 py-4 rounded-lg font-semibold transition ${button.variant === 'primary'
                                    ? 'bg-white text-primary-orange hover:bg-gray-100'
                                    : 'border border-white/30 hover:bg-white/10 text-white'
                                    }`}
                            >
                                {button.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
