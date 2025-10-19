import React from 'react'
import Link from "next/link"
import { Globe, Clock, MessageSquare, Building } from 'lucide-react'

export default function GlobalPresence({ data }) {
    const { badge, title, description, features, buttonText, buttonLink, offices } = data

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-medium">
                                {badge}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {title.start} <span className="text-primary-orange">{title.highlight}</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {features.map((feature, index) => {
                                const IconComp = feature.icon === 'Globe' ? Globe :
                                    feature.icon === 'Clock' ? Clock :
                                        feature.icon === 'MessageSquare' ? MessageSquare : Building
                                return (
                                    <div key={index} className="flex items-center">
                                        <div className="w-12 h-12 bg-primary-orange/10 rounded-lg flex items-center justify-center mr-4">
                                            <IconComp className="w-6 h-6 text-primary-orange" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{feature.title}</div>
                                            <div className="text-sm text-gray-600">{feature.subtitle}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

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

                    <div className="lg:order-2">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-orange/20 to-primary-orange/10 rounded-2xl blur-lg"></div>
                            <div className="relative bg-gray-100 rounded-2xl p-8">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Global Offices</h3>
                                    <p className="text-gray-600">Strategically located in major financial hubs</p>
                                </div>

                                <div className="space-y-4">
                                    {offices.map((office, index) => (
                                        <div key={index} className="bg-white rounded-lg p-4 flex items-center">
                                            <div className={`w-10 h-10 ${office.iconBg} rounded-lg flex items-center justify-center mr-4`}>
                                                <svg className={`w-5 h-5 ${office.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{office.location}</div>
                                                <div className="text-sm text-gray-600">{office.type}</div>
                                                <div className="text-xs text-gray-500 mt-1">{office.address}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
