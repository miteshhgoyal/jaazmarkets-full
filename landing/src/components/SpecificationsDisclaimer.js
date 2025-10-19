import React from 'react'

export default function SpecificationsDisclaimer({ data }) {
    const { title, content } = data

    return (
        <div className='px-8'>
            <div className="bg-yellow-50 /20 border-2 border-yellow-300  rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-yellow-900  mb-3">
                    {title}
                </h3>
                <p className="text-sm text-yellow-800  leading-relaxed">
                    <strong>{content.highlight}</strong> {content.description}
                </p>
            </div>
        </div>
    )
}
