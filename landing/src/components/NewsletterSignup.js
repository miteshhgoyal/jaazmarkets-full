import React from 'react'

export default function NewsletterSignup({ data }) {
    const { heading, description, placeholder, buttonText, privacyText } = data

    return (
        <section id="newsletter" className="py-16 md:py-24 bg-gray-50 ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  mb-8">
                        {description}
                    </p>

                    <div className="bg-white  rounded-xl p-8 shadow-lg">
                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder={placeholder}
                                className="flex-1 px-4 py-3 border border-gray-300  rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent  "
                            />
                            <button
                                type="submit"
                                className="px-8 py-3 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition"
                            >
                                {buttonText}
                            </button>
                        </form>
                        <p className="text-sm text-gray-500  mt-4">
                            {privacyText}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
