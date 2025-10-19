import React from 'react'
import Link from "next/link"
import { FileText, Shield, AlertTriangle, CheckCircle, Lock } from 'lucide-react'

const iconMap = {
    FileText, Shield, AlertTriangle, CheckCircle, Lock
}

export default function LegalDocuments({ data }) {
    const { heading, description, documents, quickLinks, additionalInfo, riskWarning } = data

    return (
        <section id="legal-documents" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {heading}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {description}
                        </p>
                    </div>

                    {/* Legal Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {documents.map((document, index) => {
                            const IconComp = iconMap[document.iconName] || FileText
                            return (
                                <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                                    <div className="flex items-start mb-6">
                                        <div className={`w-12 h-12 ${document.iconBg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                                            <IconComp className={`w-6 h-6 ${document.iconColor}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {document.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {document.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {document.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <a
                                        href={document.link}
                                        className={`block w-full py-3 px-4 ${document.buttonStyle} rounded-lg transition font-medium text-center`}
                                    >
                                        <FileText className="w-5 h-5 mr-2 inline" />
                                        View Document
                                    </a>
                                </div>
                            )
                        })}
                    </div>

                    {/* Quick Links to All Documents */}
                    <div className="bg-gradient-to-r from-primary-orange/10 to-orange-100/10 rounded-2xl p-8 mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            {quickLinks.heading}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickLinks.links.map((link, index) => {
                                const IconComp = iconMap[link.iconName] || FileText
                                return (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:shadow-lg transition text-sm font-medium text-gray-700 hover:text-primary-orange"
                                    >
                                        <IconComp className="w-4 h-4 mr-2" />
                                        {link.text}
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Additional Legal Information */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {additionalInfo.heading}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {additionalInfo.sections.map((section, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        {section.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {section.description}
                                    </p>
                                    {section.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-primary-orange mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                        <div className="flex items-start">
                            <AlertTriangle className="w-8 h-8 text-yellow-600 mr-4 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-lg font-bold text-yellow-800 mb-2">
                                    {riskWarning.title}
                                </h4>
                                <p className="text-yellow-700 text-sm leading-relaxed">
                                    <strong>{riskWarning.boldText}</strong> {riskWarning.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
