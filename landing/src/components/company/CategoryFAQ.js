'use client';
import Link from "next/link"
import React, { useState } from 'react'
import { ChevronDown, User, Zap, Monitor, CreditCard, Shield } from 'lucide-react'

const iconMap = {
    User, Zap, Monitor, CreditCard, Shield
}

export default function CategoryFAQ({ data }) {
    const { categories, contactCTA } = data
    const [openItems, setOpenItems] = useState({})

    const toggleFAQ = (categoryIndex, faqIndex) => {
        const key = `${categoryIndex}-${faqIndex}`
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* FAQ Categories */}
                    {categories.map((category, categoryIndex) => {
                        const IconComp = iconMap[category.iconName] || User
                        return (
                            <div key={categoryIndex} className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                    <IconComp className="w-8 h-8 text-primary-orange mr-3" />
                                    {category.title}
                                </h2>
                                <div className="space-y-4">
                                    {category.faqs.map((faq, faqIndex) => {
                                        const isOpen = openItems[`${categoryIndex}-${faqIndex}`]
                                        return (
                                            <div key={faqIndex} className="bg-gray-50 rounded-lg">
                                                <button
                                                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                                                    onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                                                >
                                                    <span className="font-semibold text-gray-900">
                                                        {faq.question}
                                                    </span>
                                                    <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''
                                                        }`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-4">
                                                        <p className="text-gray-600">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {/* Contact CTA */}
                    <div className="text-center bg-gray-50 rounded-2xl p-12 mt-16">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {contactCTA.heading}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            {contactCTA.description}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {contactCTA.buttons.map((button, index) => (
                                <a
                                    key={index}
                                    href={button.href}
                                    target={button.target}
                                    className={`inline-flex items-center px-6 py-3 ${button.style} font-semibold rounded-lg transition`}
                                >
                                    {button.text}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
