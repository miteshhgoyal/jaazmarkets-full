// app/COMMON/PaymentMethods.js
import React from 'react'

export default function PaymentMethods({ data }) {
    const { heading, description, categories } = data

    return (
        <section id="payment-methods" className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {categories.map((category, categoryIndex) => (
                    <div key={categoryIndex} className={categoryIndex < categories.length - 1 ? "mb-12" : ""}>
                        <h3 className="text-2xl font-bold text-gray-900  mb-8 text-center">
                            {category.title}
                        </h3>
                        <div className={`grid grid-cols-2 md:grid-cols-4 ${category.gridCols || 'lg:grid-cols-6'} gap-6 max-w-4xl mx-auto`}>
                            {category.methods.map((method, methodIndex) => (
                                <div
                                    key={methodIndex}
                                    className="bg-white  rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className={`w-12 h-8 ${method.bgColor} rounded mx-auto mb-3 flex items-center justify-center`}>
                                        <span className="text-white text-xs font-bold">
                                            {method.shortName}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 ">
                                        {method.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
