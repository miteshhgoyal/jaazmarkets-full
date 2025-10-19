import React from 'react'
import Link from "next/link"

export default function LegalCTA({ data }) {
    const { heading, description, buttons, backgroundColor } = data

    return (
        <section className={`py-16 ${backgroundColor || 'bg-gray-100'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
                    <p className="text-lg text-gray-700 mb-8">{description}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.href}
                                target={button.target}
                                className={`inline-block px-8 py-3 ${button.style} font-semibold rounded-lg transition`}
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
