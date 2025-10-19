import React from 'react'
import { BarChart3, BookOpen, Newspaper, Zap, DollarSign, Settings, AlertTriangle } from 'lucide-react'

const iconMap = {
    BarChart3, BookOpen, Newspaper, Zap, DollarSign, Settings, AlertTriangle
}

export default function BlogArticles({ data }) {
    const { heading, description, articles } = data

    return (
        <section id="latest-posts" className="py-16 md:py-24 bg-white ">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                        {heading}
                    </h2>
                    <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => {
                        const IconComp = iconMap[article.iconName] || BarChart3
                        return (
                            <article key={index} className="bg-gray-50  rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                <div className={`h-48 bg-gradient-to-br ${article.gradientFrom} ${article.gradientTo} flex items-center justify-center`}>
                                    <IconComp className="w-16 h-16 text-white/50" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-3">
                                        <span className={`px-2 py-1 ${article.categoryBg} ${article.categoryColor} text-xs font-semibold rounded`}>
                                            {article.category}
                                        </span>
                                        <span className="text-gray-500  text-sm ml-auto">
                                            {article.timeAgo}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900  mb-3">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600  mb-4 text-sm">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300  rounded-full mr-2"></div>
                                            <span className="text-sm text-gray-600 ">
                                                {article.author}
                                            </span>
                                        </div>
                                        <span className="text-gray-400 text-xs">
                                            {article.readTime}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <div className="text-center mt-12">
                    <div className="inline-flex items-center px-8 py-3 bg-gray-300  text-gray-500  font-semibold rounded-lg cursor-not-allowed">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        No More Articles Available
                    </div>
                    <p className="text-sm text-gray-500  mt-3">
                        Check back later for more trading insights and market analysis
                    </p>
                </div>
            </div>
        </section>
    )
}
