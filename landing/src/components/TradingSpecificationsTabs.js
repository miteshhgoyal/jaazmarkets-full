'use client'
import React, { useState } from 'react'

export default function TradingSpecificationsTabs({ data }) {
    const { tabs } = data
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

    const getActiveTabContent = () => {
        return tabs.find(tab => tab.id === activeTab)?.content || []
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="flex flex-wrap justify-center border-b border-gray-200 " id="tab-navigation">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button px-6 py-3 text-sm font-medium hover:text-gray-700 :text-gray-300 hover:border-gray-300 :border-gray-600 border-b-2 transition ${activeTab === tab.id
                                    ? 'border-primary-orange text-primary-orange'
                                    : 'text-gray-500  border-transparent'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div id="tab-content">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="overflow-hidden border border-gray-200  rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50 ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Symbol</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Description</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Digits</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Contract Size</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Min/Max Volume</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Volume Step</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Sell Swap</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Buy Swap</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Spread</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white  divide-y divide-gray-200 ">
                                    {getActiveTabContent().map((item, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white ' : 'bg-gray-50 '}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  font-medium">{item.Symbol}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{item.Description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{item.Digits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{item['Contract Size']}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{item['Min/Max Volume']}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">{item['Volume Step']}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  font-mono">{item['Sell Swap']}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  font-mono">{item['Buy Swap']}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900  font-mono">{item.Spread}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
