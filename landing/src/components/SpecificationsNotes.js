// app/COMMON/SpecificationsNotes.js
import React from 'react'

export default function SpecificationsNotes({ data }) {
    const { title, notes } = data

    return (
        <div className='px-8'>
            <div className="mt-12 bg-gray-50  rounded-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900  mb-6">
                    {title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {notes.map((note, index) => (
                        <div key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-primary-orange mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-600 ">
                                {note}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
