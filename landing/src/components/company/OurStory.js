import React from 'react'
import Link from "next/link"

export default function OurStory({ data }) {
    const { badge, title, description, buttonText, buttonLink, storyStats } = data

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-orange/20 to-primary-orange/10 rounded-2xl blur-lg"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                                <div className="grid grid-cols-2 gap-6">
                                    {storyStats.map((stat, index) => (
                                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-primary-orange mb-1">{stat.value}</div>
                                            <div className="text-sm text-gray-600">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-medium">
                                {badge}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {title.start} <span className="text-primary-orange">{title.highlight}</span>
                        </h2>
                        {description.map((paragraph, index) => (
                            <p key={index} className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                        <a
                            href={buttonLink}
                            className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition-all"
                        >
                            {buttonText}
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
