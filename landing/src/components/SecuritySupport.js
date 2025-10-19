// app/COMMON/SecuritySupport.js
import React from 'react'

export default function SecuritySupport({ data }) {
    const { heading, description, contacts, alert } = data

    return (
        <section className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  mb-8">
                        {description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {contacts.map((contact, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 ${contact.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <svg className={`w-8 h-8 ${contact.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={contact.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900  mb-2">
                                    {contact.title}
                                </h3>
                                <p className="text-gray-600 ">
                                    {contact.info}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-6">
                        <div className="flex items-start">
                            <svg className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="text-left">
                                <h4 className="font-semibold text-yellow-800  mb-2">
                                    {alert.title}
                                </h4>
                                <p className="text-yellow-700  text-sm">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
