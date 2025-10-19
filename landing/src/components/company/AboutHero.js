import React from 'react'
import Link from "next/link"
import { Clock, Eye, Zap, Shield } from 'lucide-react'

export default function AboutHero({ data }) {
    const { badge, title, subtitle, description, stats, cta, values } = data

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Timeline Elements */}
                <div className="absolute top-20 left-20 w-px h-32 bg-gradient-to-b from-primary-orange to-transparent opacity-30"></div>
                <div className="absolute bottom-32 right-32 w-px h-40 bg-gradient-to-b from-black to-transparent opacity-30"></div>

                {/* Achievement Milestones */}
                <div className="absolute top-32 left-1/4 transform opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                    <div className="bg-white shadow-xl rounded-xl p-4 border-l-4 border-primary-orange">
                        <div className="text-primary-orange text-xs font-bold">2018</div>
                        <div className="text-black text-sm font-bold">Founded</div>
                        <div className="text-gray-600 text-xs">Our journey begins</div>
                    </div>
                </div>

                <div className="absolute bottom-40 right-1/4 transform opacity-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
                    <div className="bg-gradient-to-r from-primary-orange to-primary-orange text-white rounded-xl p-3 shadow-lg">
                        <div className="text-xs font-bold">2024</div>
                        <div className="text-sm font-bold">50K+ Traders</div>
                        <div className="text-xs opacity-90">Global community</div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/3 right-20 w-20 h-20 bg-gradient-to-br from-primary-orange/10 to-primary-orange/5 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-16 w-24 h-24 bg-gradient-to-br from-black/5 to-black/10 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '8s' }}></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-5 py-2 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-bold mb-5">
                            <Clock className="w-4 h-4 mr-2" />
                            {badge}
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight mb-6">
                            {title.start} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange via-primary-orange to-primary-orange">{title.highlight}</span> {title.middle} <span className="text-primary-orange">{title.end}</span>
                        </h1>

                        <div className="max-w-4xl mx-auto space-y-4 text-sm text-gray-700 leading-relaxed mb-8">
                            <p className="font-semibold text-base text-black">
                                {subtitle}
                            </p>
                            {description.map((paragraph, index) => (
                                <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}></p>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Statistics & CTA */}
                        <div className="text-center lg:text-left">
                            {/* Journey Highlights */}
                            <div className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto lg:mx-0">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className={`${stat.bgColor} rounded-xl p-4 text-white text-center`}
                                    >
                                        <div className="text-xl font-black mb-1">{stat.value}</div>
                                        <div className="text-xs font-bold opacity-90">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                {cta.map((button, index) => (
                                    <a
                                        key={index}
                                        href={button.href}
                                        className={`inline-flex items-center justify-center px-6 py-3 ${button.style} font-bold text-sm rounded-xl transition-all transform hover:scale-105 shadow-lg`}
                                    >
                                        {button.text}
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={button.icon} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right: Visual Story */}
                        <div className="relative">
                            {/* Main Story Card */}
                            <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-primary-orange to-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-black text-black mb-3">Our Leadership Philosophy</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        "We don't just provide trading platforms - we build partnerships that empower traders to achieve their financial dreams."
                                    </p>
                                </div>

                                {/* Core Values */}
                                <div className="space-y-3">
                                    {values.map((value, index) => {
                                        const IconComp = value.icon === 'Eye' ? Eye : value.icon === 'Zap' ? Zap : Shield
                                        return (
                                            <div key={index} className={`flex items-center p-3 ${value.bgColor} rounded-lg ${value.borderColor}`}>
                                                <div className={`w-8 h-8 ${value.iconBg} rounded-full flex items-center justify-center mr-3`}>
                                                    <IconComp className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-black text-sm">{value.title}</div>
                                                    <div className="text-xs text-gray-600">{value.description}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Floating Achievement Badge */}
                            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary-orange to-primary-orange text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg animate-pulse">
                                <div className="text-center">
                                    <div className="text-xs font-bold">TRUSTED</div>
                                    <div className="text-sm font-black">2018</div>
                                </div>
                            </div>

                            {/* Side Stats */}
                            <div className="absolute -bottom-3 -left-3 bg-white rounded-lg shadow-lg p-3 border border-primary-orange">
                                <div className="text-center">
                                    <div className="text-lg font-black text-primary-orange">A+</div>
                                    <div className="text-xs text-gray-600 font-bold">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
