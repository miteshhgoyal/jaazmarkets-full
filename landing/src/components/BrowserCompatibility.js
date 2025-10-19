// app/COMMON/BrowserCompatibility.js
import React from 'react'

export default function BrowserCompatibility({ data }) {
    const { heading, description, browsers } = data

    return (
        <section className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
                    {browsers.map((browser, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-gray-100  rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">{browser.icon}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 ">
                                {browser.name}
                            </h4>
                            <p className="text-sm text-gray-600 ">
                                {browser.version}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
