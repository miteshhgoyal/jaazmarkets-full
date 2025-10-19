import React from 'react'
import ContactHero from '@/components/hero-sections/ContactHero'
import ContactMethods from '@/components/company/ContactMethods'
import ContactForm from '@/components/forms/ContactForm'
import FAQ from '@/components/company/FAQ'
import StartTradingCTA from '@/components/StartTradingCTA'

// Contact Hero Data
const contactHeroData = {
    badge: 'INSTANT SUPPORT GUARANTEED',
    title: "WE'RE HERE FOR YOU",
    subtitle: {
        personal: 'Personal Support',
        text: 'from Real Humans',
        available: '24/7',
        expert: 'Expert Help',
        instant: 'Instant Solutions'
    },
    channels: [
        {
            icon: 'MessageCircle',
            title: 'INSTANT CHAT',
            description: 'Connect with our expert support team in under 30 seconds. Real-time solutions for trading questions.',
            bgStyle: 'bg-white/10 backdrop-blur-sm',
            borderStyle: 'border border-primary-orange/30',
            hoverBorder: 'hover:border-primary-orange',
            iconBg: 'bg-gradient-to-br from-primary-orange to-primary-orange',
            statusBg: 'bg-primary-orange/20',
            status: 'LIVE NOW',
            statusInfo: 'Sarah & 12 others online',
            statusText: 'text-white',
            buttonStyle: 'bg-gradient-to-r from-primary-orange to-primary-orange hover:from-primary-orange/90 hover:to-primary-orange/90',
            buttonText: 'START CHAT NOW'
        },
        {
            icon: 'Phone',
            title: 'DIRECT CALL',
            description: 'Speak directly with our senior trading experts. Available 24/7 for immediate assistance.',
            bgStyle: 'bg-white/10 backdrop-blur-sm',
            borderStyle: 'border border-white/30',
            hoverBorder: 'hover:border-white',
            iconBg: 'bg-gradient-to-br from-black to-gray-800',
            statusBg: 'bg-primary-orange/20',
            contact: '+1-844-694-2090',
            statusInfo: 'Gros Islet, Saint Lucia (24/7)',
            statusText: 'text-gray-300',
            buttonStyle: 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black',
            buttonText: 'CALL NOW'
        },
        {
            icon: 'Mail',
            title: 'PRIORITY EMAIL',
            description: 'Detailed support for complex issues. Comprehensive responses from our expert team within 2 hours.',
            bgStyle: 'bg-white/10 backdrop-blur-sm',
            borderStyle: 'border border-primary-orange/30',
            hoverBorder: 'hover:border-primary-orange',
            iconBg: 'bg-gradient-to-br from-primary-orange to-primary-orange',
            statusBg: 'bg-primary-orange/20',
            statusInfo: 'info@jaazmarkets.com',
            status: 'RESPONSE < 2 HOURS',
            statusText: 'text-primary-orange',
            buttonStyle: 'bg-gradient-to-r from-primary-orange to-primary-orange hover:from-primary-orange/90 hover:to-primary-orange/90',
            buttonText: 'SEND EMAIL'
        }
    ],
    promise: {
        title: 'Our Support Promise',
        stats: [
            { value: '< 30sec', label: 'Chat Response', color: 'text-primary-orange' },
            { value: '24/7', label: 'Always Available', color: 'text-white' },
            { value: '100%', label: 'Issue Resolution', color: 'text-primary-orange' }
        ],
        description: {
            strong: 'Real humans, real solutions.',
            text: 'No bots, no automated responses. Our dedicated support team is committed to solving your trading challenges personally.'
        },
        button: {
            text: 'EXPERIENCE OUR SUPPORT',
            href: 'https://client.jaazmarkets.com/account?tab=register'
        }
    }
}

// Contact Methods Data
const contactMethodsData = {
    heading: {
        start: 'Multiple Ways to',
        highlight: 'Reach Us'
    },
    description: 'Choose the contact method that works best for you. Our team is available 24/5 to assist with your trading needs.',
    methods: [
        {
            icon: 'MessageCircle',
            title: 'Live Chat',
            description: 'Instant support for urgent questions',
            availability: 'Available 24/5',
            bgStyle: 'bg-gradient-to-br from-primary-orange to-orange-600 text-white',
            borderStyle: '',
            iconBg: 'bg-white/20',
            iconColor: 'text-white',
            titleColor: 'text-white',
            descColor: 'text-white/90',
            availabilityColor: 'text-white/80',
            buttonStyle: 'bg-white text-primary-orange hover:bg-gray-100',
            buttonText: 'Start Chat'
        },
        {
            icon: 'Mail',
            title: 'Email Support',
            description: 'Detailed assistance for complex queries',
            availability: 'Response within 24 hours',
            bgStyle: 'bg-gray-50',
            borderStyle: 'border-2 border-transparent hover:border-primary-orange transition-colors',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            titleColor: 'text-gray-900',
            descColor: 'text-gray-600',
            availabilityColor: 'text-gray-500',
            linkStyle: 'bg-primary-orange text-white hover:bg-primary-orange/90',
            buttonText: 'Send Email Directly',
            buttonLink: 'mailto:info@jaazmarkets.com'
        },
        {
            icon: 'Phone',
            title: 'Phone Support',
            description: 'Direct conversation with our experts',
            availability: 'Mon-Fri 8AM-8PM GMT',
            bgStyle: 'bg-gray-50',
            borderStyle: 'border-2 border-transparent hover:border-primary-orange transition-colors',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            titleColor: 'text-gray-900',
            descColor: 'text-gray-600',
            availabilityColor: 'text-gray-500',
            linkStyle: 'bg-primary-orange text-white hover:bg-primary-orange/90',
            buttonText: 'Call Now',
            buttonLink: 'tel:+18446942090'
        },
        {
            title: 'WhatsApp',
            description: 'Quick messaging support',
            availability: 'Available 24/5',
            bgStyle: 'bg-gray-50',
            borderStyle: 'border-2 border-transparent hover:border-primary-orange transition-colors',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            titleColor: 'text-gray-900',
            descColor: 'text-gray-600',
            availabilityColor: 'text-gray-500',
            customIcon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488',
            linkStyle: 'bg-primary-orange text-white hover:bg-primary-orange/90',
            buttonText: 'Message Us',
            buttonLink: 'https://wa.me/971508596279',
            buttonTarget: '_blank'
        }
    ]
}

// Contact Form Data
const contactFormData = {
    heading: {
        start: 'Send Us a',
        highlight: 'Message'
    },
    description: 'Fill out the form below and we\'ll get back to you as soon as possible.',
    contactInfo: [
        {
            icon: 'MapPin',
            title: 'Registered Office',
            content: 'Jaaz Markets LTD<br>Ground Floor, Rodney Court Building, Rodney Bay, Gros Islet, Saint Lucia<br>Registration Number: 2025-00595'
        },
        {
            icon: 'Mail',
            title: 'Email Addresses',
            content: 'General: info@jaazmarkets.com<br>Support: info@jaazmarkets.com<br>Partnerships: info@jaazmarkets.com'
        },
        {
            icon: 'Phone',
            title: 'Phone Number',
            content: '+1-844-694-2090<br>WhatsApp Available'
        },
        {
            icon: 'Clock',
            title: 'Support Hours',
            content: 'Monday - Friday: 24 hours<br>Saturday: 9:00 AM - 5:00 PM GMT<br>Sunday: Closed'
        }
    ],
    socialLinks: [
        {
            href: '#',
            icon: 'M24 4.557c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'
        },
        {
            href: '#',
            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
        }
    ]
}

// FAQ Data
const faqData = {
    heading: {
        start: 'Frequently Asked',
        highlight: 'Questions'
    },
    description: 'Quick answers to common questions. Can\'t find what you\'re looking for? Contact us directly.',
    faqs: [
        {
            id: 1,
            question: 'How do I open a trading account?',
            answer: 'Opening an account is simple and takes just a few minutes. Visit our registration page, fill out the required information, verify your identity, and make your first deposit. You\'ll be ready to trade immediately.'
        },
        {
            id: 2,
            question: 'What is the minimum deposit required?',
            answer: 'The minimum deposit varies by account type. For our Standard account, the minimum deposit is $100. For our Premium account, it\'s $500, and for our VIP account, it\'s $5,000. All deposits are secure and can be made through various payment methods including bank transfers, credit cards, and e-wallets.'
        },
        {
            id: 3,
            question: 'How long do withdrawals take?',
            answer: 'Withdrawal processing times depend on your chosen method. Bank transfers typically take 1-3 business days, credit card withdrawals take 3-5 business days, and e-wallet withdrawals are usually processed within 24 hours. All withdrawals are subject to our standard verification procedures for security.'
        },
        {
            id: 4,
            question: 'Is my money safe with Jaaz Markets?',
            answer: 'Absolutely. Your funds are held in segregated accounts with top-tier banks, completely separate from our operational funds. We\'re fully regulated and maintain strict compliance with international financial standards. Additionally, all client data and transactions are protected with bank-grade encryption.'
        },
        {
            id: 5,
            question: 'Do you offer educational resources?',
            answer: 'Yes! We provide comprehensive educational resources including video tutorials, trading guides, market analysis, webinars, and one-on-one training sessions. Our education center covers everything from basic trading concepts to advanced strategies, suitable for traders of all experience levels.'
        }
    ],
    viewAllLink: '/faq'
}

const page = () => {
    return (
        <main>
            <ContactHero data={contactHeroData} />
            <ContactMethods data={contactMethodsData} />
            <ContactForm data={contactFormData} />
            <FAQ data={faqData} />
            <StartTradingCTA />
        </main>
    )
}

export default page
