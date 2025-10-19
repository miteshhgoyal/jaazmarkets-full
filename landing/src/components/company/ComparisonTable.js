import React from 'react'
import { Check, X } from 'lucide-react'

export default function ComparisonTable({ data }) {
    const { heading, description, features } = data

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {heading.start} <span className="text-primary-orange">{heading.highlight}</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-lg shadow-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-4 px-6 text-left text-gray-900 font-bold">
                                        Feature
                                    </th>
                                    <th className="py-4 px-6 text-center text-primary-orange font-bold">
                                        Jaaz Markets
                                    </th>
                                    <th className="py-4 px-6 text-center text-gray-600">
                                        Competitor A
                                    </th>
                                    <th className="py-4 px-6 text-center text-gray-600">
                                        Competitor B
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {features.map((feature, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-6 text-gray-900 font-medium">
                                            {feature.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {feature.us.type === 'text' ? (
                                                <span className="text-primary-orange font-bold">
                                                    {feature.us.value}
                                                </span>
                                            ) : feature.us.value ? (
                                                <Check className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-red-500 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {feature.competitorA.type === 'text' ? (
                                                <span className="text-gray-600">
                                                    {feature.competitorA.value}
                                                </span>
                                            ) : feature.competitorA.value ? (
                                                <Check className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-red-500 mx-auto" />
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {feature.competitorB.type === 'text' ? (
                                                <span className="text-gray-600">
                                                    {feature.competitorB.value}
                                                </span>
                                            ) : feature.competitorB.value ? (
                                                <Check className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-red-500 mx-auto" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
