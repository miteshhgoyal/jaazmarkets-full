import Link from "next/link"
import React from 'react'

export default function TradingSpreadsTable({ data }) {
    const { heading, description, tableHeaders, tableRows, disclaimer, buttonText, buttonHref } = data

    return (
        <section className="bg-white  py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900  mb-6">{heading}</h2>
                    <p className="text-lg lg:text-xl text-gray-600  max-w-4xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="overflow-hidden border border-gray-200  rounded-lg bg-white ">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50 ">
                                    <tr>
                                        {tableHeaders.map((header, i) => (
                                            <th
                                                key={i}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white  divide-y divide-gray-200 ">
                                    {tableRows.map((row, i) => (
                                        <tr key={i} className={i % 2 === 1 ? "bg-gray-50 " : ""}>
                                            {Object.values(row).map((value, idx) => (
                                                <td
                                                    key={idx}
                                                    className={`px-6 py-4 whitespace-nowrap text-sm ${idx === 0
                                                        ? 'font-medium text-gray-900 '
                                                        : idx === 1 || idx === 2
                                                            ? 'text-primary-orange font-mono'
                                                            : 'text-gray-900 '
                                                        }`}
                                                >
                                                    {value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-4 max-w-4xl mx-auto mb-4">
                        <p className="text-sm text-yellow-800 ">
                            <strong>Important Notice:</strong> {disclaimer}
                        </p>
                    </div>
                    <a
                        href={buttonHref}
                        className="inline-flex items-center px-6 py-3 bg-primary-orange text-white font-medium rounded-lg hover:bg-opacity-90 transition"
                    >
                        {buttonText}
                    </a>
                </div>
            </div>
        </section>
    )
}
