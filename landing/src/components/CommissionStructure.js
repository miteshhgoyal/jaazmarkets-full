import React from 'react'

export default function CommissionStructure({ data }) {
    const { heading, description, disclaimer, tiers } = data

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
                                            Partner Level
                                        </th>
                                        <th className="text-center py-6 px-6 text-gray-900  font-bold">
                                            Monthly Volume
                                        </th>
                                        <th className="text-center py-6 px-6 text-gray-900  font-bold">
                                            Commission per Lot
                                        </th>
                                        <th className="text-center py-6 px-6 text-gray-900  font-bold">
                                            Bonus
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 ">
                                    {tiers.map((tier, index) => (
                                        <tr key={index} className={index % 2 === 1 ? 'bg-gray-50 /50' : ''}>
                                            <td className="py-4 px-6 text-gray-900  font-medium">
                                                {tier.level}
                                            </td>
                                            <td className="py-4 px-6 text-center text-gray-600 ">
                                                {tier.volume}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="text-primary-orange font-semibold">
                                                    {tier.commission}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {tier.bonus ? (
                                                    <span className="text-green-600 font-semibold">
                                                        {tier.bonus}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-600 ">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500  max-w-4xl mx-auto">
                            {disclaimer}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
