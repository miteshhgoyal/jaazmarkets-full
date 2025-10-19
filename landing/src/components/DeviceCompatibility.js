import React from 'react'

export default function DeviceCompatibility({ data }) {
    const { heading, description, devices } = data

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {devices.map((device, index) => (
                        <div key={index} className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900  mb-8">
                                {device.title}
                            </h3>
                            <div className={`relative mx-auto ${device.containerClass} bg-gray-900 ${device.rounded} p-2 shadow-2xl`}>
                                <div className={`w-full h-full bg-gradient-to-b from-gray-100 to-gray-200   ${device.innerRounded} overflow-hidden`}>
                                    {device.type === 'phone' && (
                                        <>
                                            {/* Status Bar */}
                                            <div className="h-8 bg-gray-900 flex items-center justify-between px-4 text-white text-xs">
                                                <span>9:41 AM</span>
                                                <span>100%</span>
                                            </div>
                                            {/* App Content */}
                                            <div className="p-4 space-y-4">
                                                <div className="h-32 bg-primary-orange/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-primary-orange font-semibold">Live Charts</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="h-16 bg-blue-100 /30 rounded flex items-center justify-center">
                                                        <span className="text-xs text-blue-600">Buy</span>
                                                    </div>
                                                    <div className="h-16 bg-red-100 /30 rounded flex items-center justify-center">
                                                        <span className="text-xs text-red-600">Sell</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-8 bg-gray-200  rounded"></div>
                                                    <div className="h-8 bg-gray-200  rounded"></div>
                                                    <div className="h-8 bg-gray-200  rounded"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {device.type === 'tablet' && (
                                        <div className="p-4 grid grid-cols-3 gap-4 h-full">
                                            <div className="col-span-2 space-y-3">
                                                <div className="h-32 bg-primary-orange/20 rounded-lg flex items-center justify-center">
                                                    <span className="text-primary-orange font-semibold">Advanced Charts</span>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    <div className="h-8 bg-blue-100 /30 rounded"></div>
                                                    <div className="h-8 bg-green-100 /30 rounded"></div>
                                                    <div className="h-8 bg-yellow-100 /30 rounded"></div>
                                                    <div className="h-8 bg-red-100 /30 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-16 bg-gray-200  rounded flex items-center justify-center">
                                                    <span className="text-xs">Watchlist</span>
                                                </div>
                                                <div className="h-16 bg-blue-100 /30 rounded flex items-center justify-center">
                                                    <span className="text-xs text-blue-600">Orders</span>
                                                </div>
                                                <div className="h-16 bg-green-100 /30 rounded flex items-center justify-center">
                                                    <span className="text-xs text-green-600">Positions</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600  mt-6">
                                {device.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
