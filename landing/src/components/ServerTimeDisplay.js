"use client";
import React, { useState, useEffect } from 'react'

export default function ServerTimeDisplay({ data }) {
    const { heading, description, stats } = data
    const [currentTime, setCurrentTime] = useState(new Date())
    const [marketStatus, setMarketStatus] = useState({ isOpen: false, status: 'CLOSED' })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
            setCurrentTime(utc)

            // Update market status (simplified - forex is generally open Sunday 22:00 - Friday 22:00 GMT)
            const currentDay = utc.getDay()
            const currentHour = utc.getHours()
            const isForexOpen = (currentDay === 0 && currentHour >= 22) ||
                (currentDay >= 1 && currentDay <= 4) ||
                (currentDay === 5 && currentHour < 22)

            setMarketStatus({
                isOpen: isForexOpen,
                status: isForexOpen ? 'OPEN' : 'CLOSED'
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (date) => {
        return date.toTimeString().split(' ')[0]
    }

    return (
        <section className="bg-white  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="bg-gradient-to-r from-primary-orange to-orange-600 rounded-xl p-8 text-white mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-4">{heading}</h2>
                        <div className="text-4xl lg:text-5xl font-mono font-bold mb-2">
                            {formatTime(currentTime)}
                        </div>
                        <p className="text-lg opacity-90">{description}</p>
                        <div className="mt-6 flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${marketStatus.isOpen
                                    ? 'bg-green-400 animate-pulse'
                                    : 'bg-red-400'
                                }`}></div>
                            <span className="font-medium">
                                Market Status:
                                <span className={`ml-1 ${marketStatus.isOpen ? 'text-green-400' : 'text-red-300'
                                    }`}>
                                    {marketStatus.status}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-gray-50  rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900  mb-2">
                                    {stat.title}
                                </h3>
                                <p className="text-gray-600  text-sm">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
