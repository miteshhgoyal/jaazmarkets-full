// app/COMMON/DetailedComparisonTable.js
import React from 'react'

export default function DetailedComparisonTable({ data }) {
    const { heading, description, tableHeaders, tableRows, disclaimer } = data

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

                <div className="max-w-6xl mx-auto overflow-x-auto">
                    <table className="w-full bg-white  rounded-lg shadow-sm">
                        <thead>
                            <tr className="border-b border-gray-200 ">
                                {tableHeaders.map((header, index) => (
                                    <th
                                        key={index}
                                        className={`py-4 px-6 font-bold ${index === 0
                                                ? 'text-left text-gray-900 '
                                                : `text-center ${header.color || 'text-gray-900 '}`
                                            }`}
                                    >
                                        {header.title || header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 ">
                            {tableRows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className={`py-4 px-6 ${cellIndex === 0
                                                    ? 'text-gray-900  font-medium'
                                                    : 'text-center'
                                                }`}
                                        >
                                            {typeof cell === 'object' && cell.icon ? (
                                                <svg className={`w-6 h-6 ${cell.color} mx-auto`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cell.icon} />
                                                </svg>
                                            ) : (
                                                <span className={cell.className || 'text-gray-600 '}>
                                                    {cell.value || cell}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {disclaimer && (
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500  max-w-4xl mx-auto">
                            {disclaimer}
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
