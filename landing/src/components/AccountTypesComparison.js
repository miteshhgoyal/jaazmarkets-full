import React from 'react'
import Link from "next/link"
import { User, Zap, Star } from 'lucide-react'

const iconMap = {
    User, Zap, Star
}

export default function AccountTypesComparison({ data }) {
    const { heading, description, disclaimer, accounts } = data

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
                    {disclaimer && (
                        <div className="bg-yellow-50 /20 border border-yellow-200  rounded-lg p-4 max-w-3xl mx-auto mt-6">
                            <p className="text-sm text-yellow-800 ">
                                <strong>Important Notice:</strong> {disclaimer}
                            </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {accounts.map((account, index) => {
                        const IconComp = iconMap[account.iconName] || User
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 border transition-shadow ${account.featured
                                    ? 'bg-white  border-2 border-primary-orange shadow-lg relative hover:shadow-xl'
                                    : 'bg-gray-50  border border-gray-200  hover:shadow-lg'
                                    }`}
                            >
                                {account.featured && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-primary-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                                            {account.badge}
                                        </span>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <div className={`w-20 h-20 ${account.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        <IconComp className={`w-10 h-10 ${account.iconColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900  mb-2">
                                        {account.name}
                                    </h3>
                                    <p className="text-gray-600  mb-4">
                                        {account.subtitle}
                                    </p>
                                    <div className={`text-3xl font-bold mb-2 ${account.priceColor || 'text-primary-orange'}`}>
                                        {account.price}
                                    </div>
                                    <p className="text-sm text-gray-500 ">
                                        {account.priceLabel}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {account.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-gray-600 ">
                                                {feature.label}
                                            </span>
                                            <span className={`font-semibold ${feature.valueClass || 'text-gray-900 '}`}>
                                                {feature.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <ul className="space-y-3 mb-8 text-sm">
                                    {account.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-center text-gray-600 ">
                                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={account.buttonHref}
                                    target="_blank"
                                    className={`block w-full text-center py-3 px-4 rounded-lg transition font-medium ${account.featured
                                        ? 'bg-primary-orange text-white hover:bg-primary-orange/90'
                                        : `border ${account.buttonColor} ${account.buttonTextColor} hover:${account.buttonHoverBg} hover:text-white`
                                        }`}
                                >
                                    {account.buttonText}
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
