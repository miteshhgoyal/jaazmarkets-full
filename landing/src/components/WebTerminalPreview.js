import React from 'react'

export default function WebTerminalPreview({ data }) {
    const { heading, description, preview } = data

    return (
        <section className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="relative bg-white  rounded-2xl shadow-2xl overflow-hidden">
                        {/* Browser Frame */}
                        <div className="bg-gray-200  px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-white  rounded px-3 py-1 mx-4">
                                <span className="text-sm text-gray-600 ">
                                    {preview.url}
                                </span>
                            </div>
                        </div>

                        {/* Platform Interface */}
                        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-primary-orange/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={preview.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {preview.title}
                                </h3>
                                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                                    {preview.description}
                                </p>
                                <a
                                    href={preview.buttonLink}
                                    target="_blank"
                                    className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition"
                                >
                                    {preview.buttonText}
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
