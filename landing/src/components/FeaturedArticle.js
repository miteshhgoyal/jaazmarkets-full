import React from 'react'
import { BarChart3, User } from 'lucide-react'

export default function FeaturedArticle({ data }) {
    const { article } = data

    return (
        <section className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-primary-orange to-orange-600 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12 text-white">
                                <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full mb-4">
                                    {article.badge}
                                </span>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                                    {article.title}
                                </h2>
                                <p className="text-white/90 mb-6 text-lg">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{article.author}</p>
                                        <p className="text-white/80 text-sm">{article.authorRole}</p>
                                    </div>
                                </div>
                                <div className="inline-flex items-center px-6 py-3 bg-white/20 text-white font-semibold rounded-lg cursor-not-allowed">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m5-6v2m0 0v2m0-2h2m-2 0h-2M7 8V6m0 0V4m0 2h2M7 8H5" />
                                    </svg>
                                    Premium Content
                                </div>
                            </div>
                            <div className="h-64 lg:h-auto bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                                <BarChart3 className="w-32 h-32 text-white/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
