"use client";
import React, { useState, useEffect } from 'react'

export default function TradingHoursTables({ data }) {
    const { heading, description, markets } = data
    const [marketStatuses, setMarketStatuses] = useState({})

    useEffect(() => {
        const updateStatuses = () => {
            const now = new Date()
            const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
            const currentDay = utc.getDay()
            const currentHour = utc.getHours()

            const newStatuses = {}

            // Update forex sessions
            const forexOpen = (currentDay === 0 && currentHour >= 22) ||
                (currentDay >= 1 && currentDay <= 4) ||
                (currentDay === 5 && currentHour < 22)

            newStatuses.sydney = forexOpen && ((currentDay === 0 && currentHour >= 22) || (currentDay === 1 && currentHour < 7))
            newStatuses.tokyo = forexOpen && (currentHour >= 0 && currentHour < 9)
            newStatuses.london = forexOpen && (currentHour >= 8 && currentHour < 17)
            newStatuses.newyork = forexOpen && (currentHour >= 13 && currentHour < 22)

            // US stocks (Monday-Friday, 14:30-21:00 GMT)
            newStatuses.usStocks = currentDay >= 1 && currentDay <= 5 && currentHour >= 14.5 && currentHour < 21

            setMarketStatuses(newStatuses)
        }

        updateStatuses()
        const timer = setInterval(updateStatuses, 60000) // Update every minute

        return () => clearInterval(timer)
    }, [])

    const getStatusBadge = (isActive, marketOpen = true) => {
        if (!marketOpen) {
            return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Closed</span>
        }
        if (isActive) {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
        }
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Inactive</span>
    }

    return (
        <section className="bg-gray-50  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">
                        {heading}
                    </h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="max-w-6xl mx-auto space-y-6">
                    {markets.map((market, marketIndex) => (
                        <div key={marketIndex} className="bg-white  rounded-xl shadow-lg overflow-hidden">
                            <div className={`px-6 py-4 bg-gradient-to-r ${market.bgColor} text-white`}>
                                <h3 className="text-xl font-bold flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={market.icon} />
                                    </svg>
                                    {market.title}
                                </h3>
                                <p className="text-sm opacity-90">{market.subtitle}</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 ">
                                    <thead className="bg-gray-50 ">
                                        <tr>
                                            {market.headers.map((header, headerIndex) => (
                                                <th
                                                    key={headerIndex}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white  divide-y divide-gray-200 ">
                                        {market.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-gray-50 " : ""}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">
                                                    {row.name}
                                                </td>
                                                {row.symbol && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 ">
                                                        {row.symbol}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 ">
                                                    {row.openTime}
                                                </td>
                                                {row.closeTime && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 ">
                                                        {row.closeTime}
                                                    </td>
                                                )}
                                                {!row.closeTime && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 ">
                                                        {row.hours}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {row.statusKey ? getStatusBadge(marketStatuses[row.statusKey]) : (
                                                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                            {row.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-6 max-w-4xl mx-auto">
                        <h3 className="text-lg font-semibold text-yellow-800  mb-2">
                            Important Notice
                        </h3>
                        <p className="text-sm text-yellow-700  leading-relaxed">
                            Trading hours may vary during holidays, daylight saving time changes, and low liquidity periods.
                            Please check our platform for real-time market status. All times are subject to change without prior notice.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
