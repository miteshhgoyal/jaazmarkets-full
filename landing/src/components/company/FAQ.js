'use client';
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from "next/link"

export default function FAQ({ data }) {
    const { heading, description, faqs, viewAllLink } = data
    const [openFAQ, setOpenFAQ] = useState(1) // Default to FAQ with id 1 open

    const toggleFAQ = (id) => {
        setOpenFAQ(openFAQ === id ? null : id)
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {heading.start} <span className="text-primary-orange">{heading.highlight}</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            {description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-gray-50 rounded-xl p-6">
                                <button
                                    className="w-full text-left flex items-center justify-between"
                                    onClick={() => toggleFAQ(faq.id)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${openFAQ === faq.id ? 'rotate-180' : ''
                                        }`} />
                                </button>
                                {openFAQ === faq.id && (
                                    <div className="mt-4 text-gray-600">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <a href={viewAllLink} className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition">
                            View All FAQs
                            <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
