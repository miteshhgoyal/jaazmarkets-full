// app/COMMON/ProcessingTimesTable.js
import React from 'react'

export default function ProcessingTimesTable({ data }) {
    const { heading, description, tableHeaders, tableRows } = data

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

                <div className="max-w-6xl mx-auto overflow-x-auto">
                    <table className="w-full bg-gray-50  rounded-lg shadow-sm">
                        <thead>
                            <tr className="border-b border-gray-200 ">
                                {tableHeaders.map((header, index) => (
                                    <th
                                        key={index}
                                        className="py-4 px-6 text-center text-gray-900  font-bold"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 ">
                            {tableRows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="py-4 px-6 text-gray-900  font-medium">
                                        {row.method}
                                    </td>
                                    <td className={`py-4 px-6 text-center font-bold ${row.depositTime === 'Instant' ? 'text-green-600' : 'text-gray-600 '
                                        }`}>
                                        {row.depositTime}
                                    </td>
                                    <td className={`py-4 px-6 text-center font-bold ${row.withdrawalTime.includes('24 hours') || row.withdrawalTime.includes('1 hour')
                                            ? 'text-green-600'
                                            : 'text-gray-600 '
                                        }`}>
                                        {row.withdrawalTime}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-600 ">
                                        {row.minDeposit}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-600 ">
                                        {row.minWithdrawal}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-600 ">
                                        {row.fees}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
