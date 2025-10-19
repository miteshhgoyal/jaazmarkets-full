import React from 'react'
import Link from "next/link"
import { AlertTriangle } from 'lucide-react'

export default function LegalContent({ data }) {
    const {
        introduction,
        companyInfo,
        tableOfContents,
        sections,
        contactInfo,
        versionHistory,
        warningBanner
    } = data

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Warning Banner (for Risk Disclosure) */}
                    {warningBanner && (
                        <section className={`${warningBanner.bgColor} border-b-4 ${warningBanner.borderColor} mb-12`}>
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                <div className="flex items-center max-w-4xl mx-auto">
                                    <AlertTriangle className="w-12 h-12 text-red-600 mr-4 flex-shrink-0" />
                                    <div>
                                        <h2 className={`text-xl font-bold ${warningBanner.titleColor}`}>
                                            {warningBanner.title}
                                        </h2>
                                        <p className={warningBanner.textColor}>
                                            {warningBanner.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Introduction */}
                    {introduction && (
                        <div className="mb-12">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                {introduction}
                            </p>
                        </div>
                    )}

                    {/* Company Information */}
                    {companyInfo && (
                        <div className="mb-12 p-6 bg-gray-50 rounded-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Company Information
                            </h2>
                            {companyInfo.map((info, index) => (
                                <p key={index} className="text-gray-700 mb-2">
                                    <strong>{info.label}:</strong> {info.value}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Table of Contents */}
                    {tableOfContents && (
                        <div className="mb-12 p-6 border border-gray-200 rounded-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Table of Contents
                            </h2>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                {tableOfContents.map((item, index) => (
                                    <li key={index}>
                                        <a href={`#${item.id}`} className="text-primary-orange hover:underline">
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Content Sections */}
                    <div className="space-y-12">
                        {sections?.map((section, index) => (
                            <section key={index} id={section.id} className='pt-28 -mt-28'>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    {section.title}
                                </h2>
                                <div className="prose max-w-none text-gray-700">
                                    {section.content.map((contentItem, contentIndex) => {
                                        if (contentItem.type === 'paragraph') {
                                            return (
                                                <p key={contentIndex} className={`mb-4 ${contentItem.className || ''}`}
                                                    dangerouslySetInnerHTML={{ __html: contentItem.text }} />
                                            )
                                        }

                                        if (contentItem.type === 'subtitle') {
                                            return (
                                                <h3 key={contentIndex} className="text-xl font-semibold mb-3">
                                                    {contentItem.text}
                                                </h3>
                                            )
                                        }

                                        if (contentItem.type === 'list') {
                                            return (
                                                <ul key={contentIndex} className="list-disc pl-6 space-y-2 mb-6">
                                                    {contentItem.items.map((item, itemIndex) => (
                                                        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                                                    ))}
                                                </ul>
                                            )
                                        }

                                        if (contentItem.type === 'warning') {
                                            return (
                                                <div key={contentIndex} className={`p-4 ${contentItem.bgColor} border ${contentItem.borderColor} rounded-lg mb-6`}>
                                                    <p className={`${contentItem.textColor} ${contentItem.fontWeight || 'font-semibold'}`}>
                                                        {contentItem.strongText && <strong>{contentItem.strongText}</strong>}
                                                        {contentItem.text}
                                                    </p>
                                                </div>
                                            )
                                        }

                                        if (contentItem.type === 'grid') {
                                            return (
                                                <div key={contentIndex} className={`grid ${contentItem.columns} gap-6 mb-6`}>
                                                    {contentItem.items.map((gridItem, gridIndex) => (
                                                        <div key={gridIndex} className={`p-4 ${gridItem.bgColor} rounded-lg`}>
                                                            <h4 className={`font-semibold ${gridItem.titleColor} mb-2`}>
                                                                {gridItem.title}
                                                            </h4>
                                                            {gridItem.content && (
                                                                <p className={`text-sm ${gridItem.textColor}`}>
                                                                    {gridItem.content}
                                                                </p>
                                                            )}
                                                            {gridItem.list && (
                                                                <ul className={`list-disc pl-5 space-y-1 text-sm ${gridItem.textColor}`}>
                                                                    {gridItem.list.map((listItem, listIndex) => (
                                                                        <li key={listIndex}>{listItem}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        }

                                        if (contentItem.type === 'table') {
                                            return (
                                                <div key={contentIndex} className="overflow-x-auto mb-6">
                                                    <table className="min-w-full border border-gray-200">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                {contentItem.headers.map((header, headerIndex) => (
                                                                    <th key={headerIndex} className="px-4 py-2 text-left font-semibold text-gray-900">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {contentItem.rows.map((row, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    {row.map((cell, cellIndex) => (
                                                                        <td key={cellIndex} className="px-4 py-2 text-gray-700">
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        }

                                        return null
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Contact Information */}
                    {contactInfo && (
                        <div className={`mt-16 p-6 ${contactInfo.bgColor} rounded-lg`}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {contactInfo.title}
                            </h2>
                            <p className="text-gray-700 mb-4">
                                {contactInfo.description}
                            </p>
                            <div className="space-y-2 text-gray-700">
                                {contactInfo.details.map((detail, index) => (
                                    <p key={index} dangerouslySetInnerHTML={{ __html: detail }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Version History */}
                    {versionHistory && (
                        <div className="mt-8 text-sm text-gray-600">
                            {versionHistory.map((version, index) => (
                                <p key={index}><strong>{version.version}</strong> - {version.details}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
