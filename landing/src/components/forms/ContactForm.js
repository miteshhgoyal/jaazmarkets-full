import React from 'react'
import Link from "next/link"
import { MapPin, Building, Mail, Phone, Clock } from 'lucide-react'

export default function ContactForm({ data }) {
    const { heading, description, contactInfo, socialLinks } = data

    return (
        <section id="contact-form" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {heading.start} <span className="text-primary-orange">{heading.highlight}</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            {description}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Form */}
                            <div className="p-8">
                                <form className="space-y-6" id="contact-form-main">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                            <input type="text" id="first_name" name="first_name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                            <input type="text" id="last_name" name="last_name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent" />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                        <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent" />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input type="tel" id="phone" name="phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent" />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                                        <select id="subject" name="subject" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent">
                                            <option value="">Select a subject</option>
                                            <option value="Account Support">Account Support</option>
                                            <option value="Trading Questions">Trading Questions</option>
                                            <option value="Platform Issues">Platform Issues</option>
                                            <option value="Deposits & Withdrawals">Deposits & Withdrawals</option>
                                            <option value="Partnership Inquiry">Partnership Inquiry</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Complaint">Complaint</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                                        <textarea id="message" name="message" rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent" placeholder="Please describe your inquiry in detail..."></textarea>
                                    </div>

                                    <div className="flex items-start">
                                        <input type="checkbox" id="privacy" name="privacy" required className="mt-1 rounded border-gray-300 text-primary-orange focus:ring-primary-orange" />
                                        <label htmlFor="privacy" className="ml-3 text-sm text-gray-600">
                                            I agree to the <a href="/legal" className="text-primary-orange hover:underline">Privacy Policy</a> and consent to the processing of my personal data. *
                                        </label>
                                    </div>

                                    <button type="submit" className="w-full px-8 py-4 bg-primary-orange text-white font-semibold rounded-lg hover:bg-primary-orange/90 transition text-lg">
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-gradient-to-br from-primary-orange to-orange-600 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    {contactInfo.map((info, index) => {
                                        const IconComp = info.icon === 'MapPin' ? MapPin :
                                            info.icon === 'Building' ? Building :
                                                info.icon === 'Mail' ? Mail :
                                                    info.icon === 'Phone' ? Phone : Clock
                                        return (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <IconComp className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-1">{info.title}</h4>
                                                    <div className="text-white/90 text-sm" dangerouslySetInnerHTML={{ __html: info.content }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <h4 className="font-semibold mb-4">Follow Us</h4>
                                    <div className="flex gap-4">
                                        {socialLinks.map((social, index) => (
                                            <a key={index} href={social.href} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: social.icon }}></svg>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
