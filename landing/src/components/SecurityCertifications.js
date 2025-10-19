// app/COMMON/SecurityCertifications.js
import React from 'react'

export default function SecurityCertifications({ data }) {
    const { heading, description, certifications } = data

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {certifications.map((cert, index) => (
                        <div
                            key={index}
                            className="bg-gray-50  rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <div className={`w-20 h-20 ${cert.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <span className={`text-lg font-bold ${cert.textColor}`}>
                                    {cert.shortName}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900  mb-4">
                                {cert.name}
                            </h3>
                            <p className="text-gray-600  text-sm">
                                {cert.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
