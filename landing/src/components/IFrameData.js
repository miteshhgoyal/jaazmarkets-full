import React from 'react'

export default function IFrameData({ data }) {
    const { heading, description, iframe, chartHeader, htmlId } = data

    return (
        <section id={htmlId} className="pt-24 pb-6 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                            {heading}
                        </h2>
                        <p className="text-lg text-gray-600  max-w-3xl mx-auto">
                            {description}
                        </p>
                    </div>

                    <div className="bg-white  rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gray-50  border-b border-gray-200 ">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900 ">{chartHeader[0]}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 ">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={chartHeader[2]} />
                                    </svg>
                                    <span>{chartHeader[1]}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative" style={{ height: '1000px' }}>
                            <div className="tradingview-widget-container" style={{ height: '100%', width: '100%', colorScheme: 'light', background: 'white' }}>
                                <iframe
                                    scrolling="no"
                                    allowtransparency="true"
                                    frameBorder="0"
                                    src={iframe}
                                    title="Economic Calendar Widget"
                                    style={{
                                        userSelect: 'none',
                                        boxSizing: 'border-box',
                                        display: 'block',
                                        height: 'calc(100% - 32px)',
                                        width: '100%',
                                        colorScheme: 'light',
                                        background: 'white'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
