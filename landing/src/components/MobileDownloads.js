import React from 'react'

export default function MobileDownloads({ data }) {
    const { heading, description, downloads } = data

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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {downloads.map((download, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${download.gradientFrom} ${download.gradientTo} rounded-2xl p-8 text-center border ${download.borderColor}`}
                        >
                            <div className={`w-20 h-20 bg-gradient-to-br ${download.iconGradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d={download.icon} />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900  mb-4">
                                {download.title}
                            </h3>
                            <p className="text-gray-600  mb-6">
                                {download.compatibility}
                            </p>
                            <div className="space-y-3 mb-8">
                                {download.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center justify-center text-sm text-gray-600 ">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <a
                                href={download.downloadUrl}
                                target="_blank"
                                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${download.buttonGradient} text-white font-semibold rounded-lg ${download.buttonHover} transition w-full justify-center`}
                            >
                                {download.buttonText}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
