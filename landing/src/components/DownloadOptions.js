// app/COMMON/DownloadOptions.js
import React from 'react'

export default function DownloadOptions({ data }) {
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {downloads.map((download, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${download.gradientFrom} ${download.gradientTo} rounded-2xl p-8 text-center border ${download.borderColor}`}
                        >
                            <div className={`w-20 h-20 ${download.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <svg className={`w-10 h-10 ${download.iconColor}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d={download.icon} />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900  mb-4">
                                {download.platform}
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
                                className={`inline-flex items-center px-8 py-4 ${download.buttonBg} text-white font-semibold rounded-lg ${download.buttonHover} transition text-lg w-full justify-center`}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-4-4m4 4l4-4m3 6H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {download.buttonText}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
