import React from 'react'

export default function ComparisonTable({ data }) {
    const { heading, description, tableData } = data

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

                <div className="max-w-6xl mx-auto">
                    <div className="bg-white  rounded-2xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 ">
                                        <th className="text-left py-6 px-6 text-gray-900  font-bold">
                                            Features
                                        </th>
                                        <th className="text-center py-6 px-6 text-primary-orange font-bold">
                                            MT5
                                        </th>
                                        <th className="text-center py-6 px-6 text-gray-600  font-bold">
                                            MT4
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 ">
                                    {tableData.map((row, index) => (
                                        <tr key={index} className={index % 2 === 1 ? "bg-gray-50 /50" : ""}>
                                            <td className="py-4 px-6 text-gray-900  font-medium">
                                                {row.feature}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {row.mt5.type === 'text' ? (
                                                    <span className="text-green-600 font-semibold">
                                                        {row.mt5.value}
                                                    </span>
                                                ) : (
                                                    <svg className={`w-6 h-6 ${row.mt5.value ? 'text-green-500' : 'text-red-500'} mx-auto`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={row.mt5.value ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                                    </svg>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {row.mt4.type === 'text' ? (
                                                    <span className="text-gray-600 ">
                                                        {row.mt4.value}
                                                    </span>
                                                ) : (
                                                    <svg className={`w-6 h-6 ${row.mt4.value ? 'text-green-500' : 'text-red-500'} mx-auto`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={row.mt4.value ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                                    </svg>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
