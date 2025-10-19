// app/COMMON/MultipleSpreadsTable.js
import React from 'react'

export default function MultipleSpreadsTable({ data }) {
    const { heading, description, disclaimer, tables } = data

    return (
        <section id="spreads" className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                    {disclaimer && (
                        <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-4 max-w-3xl mx-auto mt-6">
                            <p className="text-sm text-yellow-800 ">
                                <strong>Important Disclaimer:</strong> {disclaimer}
                            </p>
                        </div>
                    )}
                </div>

                {tables.map((table, index) => (
                    <div key={index} className={index < tables.length - 1 ? "mb-12" : ""}>
                        <h3 className="text-2xl font-bold text-gray-900  mb-8 text-center">
                            {table.title}
                        </h3>
                        <div className="max-w-4xl mx-auto overflow-x-auto">
                            <table className="w-full bg-white  rounded-lg shadow-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 ">
                                        {table.headers.map((header, headerIndex) => (
                                            <th
                                                key={headerIndex}
                                                className={`py-4 px-6 font-bold ${headerIndex === 0
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
                                    {table.rows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td
                                                    key={cellIndex}
                                                    className={`py-4 px-6 ${cellIndex === 0
                                                            ? 'text-gray-900  font-medium'
                                                            : `text-center ${cell.className || 'text-gray-600 '}`
                                                        }`}
                                                >
                                                    {cell.value || cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
