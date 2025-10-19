import React from 'react'
import { AlertTriangle, Shield, FileText, Lock } from 'lucide-react'

const iconMap = {
    AlertTriangle, Shield, FileText, Lock
}

export default function LegalHero({ data }) {
    const { title, subtitle, lastUpdated, effectiveDate, backgroundColor, textColor, iconName } = data
    const IconComp = iconMap[iconName] || FileText

    return (
        <section className={`${backgroundColor || 'bg-gradient-to-br from-gray-900 to-gray-800'} text-white py-20`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {iconName && (
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                                <IconComp className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
                    <p className={`text-xl ${textColor || 'text-gray-300'}`}>{subtitle}</p>
                    {effectiveDate && (
                        <p className={`text-lg ${textColor || 'text-gray-400'} mt-4`}>
                            Effective Date: {effectiveDate}
                        </p>
                    )}
                    {lastUpdated && (
                        <p className={`text-lg text-gray-400 ${effectiveDate ? '' : 'mt-4'}`}>
                            Last Updated: {lastUpdated}
                        </p>
                    )}
                </div>
            </div>
        </section>
    )
}
