import React from 'react'
import { MessageCircle, Mail, Phone } from 'lucide-react'

export default function ContactMethods({ data }) {
    const { heading, description, methods } = data

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading.start} <span className="text-primary-orange">{heading.highlight}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {methods.map((method, index) => {
                        const IconComp = method.icon === 'MessageCircle' ? MessageCircle :
                            method.icon === 'Mail' ? Mail :
                                method.icon === 'Phone' ? Phone : MessageCircle
                        return (
                            <div key={index} className={`${method.bgStyle} rounded-xl p-6 text-center ${method.borderStyle}`}>
                                <div className={`w-16 h-16 ${method.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    {method.customIcon ? (
                                        <svg className={`w-8 h-8 ${method.iconColor}`} fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: method.customIcon }}></svg>
                                    ) : (
                                        <IconComp className={`w-8 h-8 ${method.iconColor}`} />
                                    )}
                                </div>
                                <h3 className={`text-xl font-bold ${method.titleColor} mb-2`}>{method.title}</h3>
                                <p className={`${method.descColor} mb-4 text-sm`}>{method.description}</p>
                                <p className={`${method.availabilityColor} text-sm mb-4`}>{method.availability}</p>
                                {method.buttonStyle ? (
                                    <button className={`w-full px-4 py-2 ${method.buttonStyle} font-semibold rounded-lg transition`}>
                                        {method.buttonText}
                                    </button>
                                ) : (
                                    <a href={method.buttonLink} target={method.buttonTarget} className={`w-full inline-block px-4 py-2 ${method.linkStyle} font-semibold rounded-lg transition`}>
                                        {method.buttonText}
                                    </a>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
