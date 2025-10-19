import React from 'react'

export default function CybersecurityHero({ buttons }) {
    return (
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-500/20 rounded-full">
                            <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Stay Safe Online
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                        Protect yourself from cybersecurity threats and scams while trading. Learn how to keep your accounts and data secure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.link}
                                className={`px-8 py-4 rounded-lg font-semibold transition ${button.variant === 'primary'
                                        ? 'bg-primary-orange hover:bg-primary-orange/90 text-white'
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
