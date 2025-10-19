// app/COMMON/TradingExample.js
import React from 'react'

export default function TradingExample({ data }) {
    const { heading, description, tradeSetup, profitCalculation, profitCalc, riskWarning } = data

    // Handle different naming conventions
    const calculations = profitCalculation || profitCalc || []

    return (
        <section className="bg-gray-50  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">{heading}</h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">{description}</p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white  rounded-xl shadow-xl p-8 lg:p-12">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 ">Trade Setup</h3>
                                <div className="space-y-4">
                                    {tradeSetup.map(({ label, value, valueClass, highlight }, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 ">
                                            <span className="text-gray-600 ">{label}</span>
                                            <span className={`font-semibold ${highlight || valueClass
                                                ? 'text-green-600'
                                                : 'text-gray-900 '
                                                }`}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 ">Profit Calculation</h3>
                                <div className="space-y-4">
                                    {calculations.map(({ label, value, bgClass, textClass, fontSize, highlight }, i) => (
                                        <div key={i} className={`rounded-lg p-4 ${bgClass || (highlight
                                            ? 'bg-green-50 /20 border border-green-200 '
                                            : 'bg-gray-50 ')
                                            }`}>
                                            <p className={`text-sm mb-2 ${textClass || (highlight
                                                ? 'text-green-600 '
                                                : 'text-gray-600 ')
                                                }`}>
                                                {label}
                                            </p>
                                            <p className={`font-bold ${fontSize || (highlight ? 'text-2xl' : 'text-lg')
                                                } ${textClass || (highlight
                                                    ? 'text-green-600 '
                                                    : 'text-gray-900 ')
                                                }`}>
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-yellow-50 /20 border border-yellow-200  rounded-lg">
                            <p className="text-sm text-yellow-800 ">
                                <strong>Risk Warning:</strong> {riskWarning}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
