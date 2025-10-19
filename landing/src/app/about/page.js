import React from 'react'
import AboutHero from '@/components/company/AboutHero'
import CompanyStats from '@/components/company/CompanyStats'
import OurStory from '@/components/company/OurStory'
import MissionValues from '@/components/company/MissionValues'
import ProfessionalExcellence from '@/components/company/ProfessionalExcellence'
import GlobalPresence from '@/components/company/GlobalPresence'
import StartTradingCTA from '@/components/StartTradingCTA'

const aboutHeroData = {
    badge: 'OUR STORY SINCE 2018',
    title: {
        start: 'Building',
        highlight: 'TRUST',
        middle: 'Through',
        end: 'Excellence'
    },
    subtitle: 'From a visionary idea to a global trading empire - this is the story of how we transformed the way people trade.',
    description: [
        'Founded by seasoned financial experts who believed that <strong>every trader deserves institutional-grade tools</strong>, Jaaz Markets emerged from a simple yet powerful mission: democratize access to professional trading.',
        'Today, we\'re proud to serve <strong>50,000+ traders across 80+ countries</strong>, providing them with the technology, support, and conditions that were once reserved for Wall Street giants.'
    ],
    stats: [
        { value: '6+', label: 'Years of Innovation', bgColor: 'bg-gradient-to-br from-primary-orange to-primary-orange' },
        { value: '80+', label: 'Countries Served', bgColor: 'bg-gradient-to-br from-black to-gray-800' },
        { value: '50K+', label: 'Trusted Traders', bgColor: 'bg-gradient-to-br from-primary-orange to-primary-orange' },
        { value: '24/7', label: 'Dedicated Support', bgColor: 'bg-gradient-to-br from-black to-gray-800' }
    ],
    cta: [
        {
            text: 'Meet Our Team',
            href: '/contact',
            style: 'bg-gradient-to-r from-primary-orange to-primary-orange hover:from-primary-orange hover:to-primary-orange text-white',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        },
        {
            text: 'Why Choose Us',
            href: '/why-choose-us',
            style: 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white',
            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
        }
    ],
    values: [
        {
            title: 'Transparency First',
            description: 'No hidden fees, complete clarity',
            icon: 'Eye',
            bgColor: 'bg-primary-orange/5',
            borderColor: 'border border-primary-orange/20',
            iconBg: 'bg-primary-orange'
        },
        {
            title: 'Innovation Drive',
            description: 'Cutting-edge technology always',
            icon: 'Zap',
            bgColor: 'bg-black/5',
            borderColor: 'border border-black/20',
            iconBg: 'bg-black'
        },
        {
            title: 'Client Success',
            description: 'Your success is our mission',
            icon: 'Shield',
            bgColor: 'bg-primary-orange/5',
            borderColor: 'border border-primary-orange/20',
            iconBg: 'bg-primary-orange'
        }
    ]
}

const companyStatsData = {
    stats: [
        { value: '7+', label: 'Years of Excellence' },
        { value: '50K+', label: 'Active Traders' },
        { value: '80+', label: 'Countries Served' },
        { value: '24/7', label: 'Customer Support' }
    ]
}

const ourStoryData = {
    badge: 'Our Journey',
    title: {
        start: 'From Vision to',
        highlight: 'Global Leader'
    },
    description: [
        'Founded in 2018 by a team of seasoned financial professionals, Jaaz Markets emerged from a simple yet powerful vision: to democratize access to the global financial markets through cutting-edge technology and transparent trading conditions.',
        'What started as a mission to bridge the gap between institutional-grade trading tools and retail traders has evolved into a comprehensive trading ecosystem serving over 50,000 active traders across 80+ countries.',
        'Today, we continue to innovate and expand, always keeping our core values of transparency, integrity, and client-first approach at the heart of everything we do.'
    ],
    buttonText: 'Why Choose Us',
    buttonLink: '/why-choose-us',
    storyStats: [
        { value: '2018', label: 'Founded' },
        { value: '2', label: 'Global Offices' },
        { value: '500+', label: 'Instruments' },
        { value: '<50ms', label: 'Execution Speed' }
    ]
}

const missionValuesData = {
    badge: 'Our Foundation',
    title: {
        start: 'Mission &',
        highlight: 'Core Values'
    },
    description: 'Our mission drives everything we do, while our values guide how we serve our trading community.',
    mission: {
        title: 'Our Mission',
        description: 'To empower traders worldwide with institutional-grade trading technology, transparent market access, and comprehensive support, enabling them to achieve their financial goals in the global markets.'
    },
    values: [
        {
            title: 'Transparency',
            description: 'Complete transparency in pricing, execution, and operations. No hidden fees, no surprises.',
            iconName: 'Eye',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Innovation',
            description: 'Continuously evolving our technology to provide cutting-edge trading solutions.',
            iconName: 'Zap',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Integrity',
            description: 'Conducting business with the highest ethical standards and client-first approach.',
            iconName: 'Shield',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Excellence',
            description: 'Pursuing excellence in every aspect of our service and client experience.',
            iconName: 'Sparkles',
            gradient: 'from-primary-orange to-primary-orange'
        }
    ]
}

const professionalExcellenceData = {
    badge: 'Our Expertise',
    title: {
        start: 'Professional',
        highlight: 'Excellence'
    },
    description: 'Our team combines decades of expertise in financial markets, cutting-edge technology, and exceptional client service to deliver a superior trading experience.',
    expertiseAreas: [
        {
            title: 'Financial Markets Expertise',
            description: 'Our team includes professionals with extensive experience in institutional trading, risk management, and global financial markets.',
            iconName: 'BarChart3',
            gradient: 'from-blue-500 to-blue-600',
            stat: '100+',
            statLabel: 'Years Combined Experience'
        },
        {
            title: 'Technology Innovation',
            description: 'Leading developers and engineers ensuring robust infrastructure, ultra-low latency execution, and cutting-edge trading technology.',
            iconName: 'Code',
            gradient: 'from-purple-500 to-purple-600',
            stat: '<50ms',
            statLabel: 'Average Execution Speed'
        },
        {
            title: 'Client-First Approach',
            description: 'Dedicated support professionals providing 24/7 assistance in multiple languages with deep market knowledge.',
            iconName: 'Target',
            gradient: 'from-green-500 to-green-600',
            stat: '24/7',
            statLabel: 'Support Availability'
        }
    ],
    additionalAreas: [
        {
            title: 'Regulatory Compliance',
            description: 'Expert compliance team ensuring adherence to international regulations and best practices.',
            iconName: 'Shield',
            gradient: 'from-primary-orange/10 to-orange-100/10',
            iconBg: 'bg-primary-orange/20',
            iconColor: 'text-primary-orange'
        },
        {
            title: 'Risk Management',
            description: 'Advanced risk management systems and experienced professionals protecting client interests.',
            iconName: 'Zap',
            gradient: 'from-blue-100/50 to-purple-100/50',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-600'
        }
    ]
}

const globalPresenceData = {
    badge: 'Global Reach',
    title: {
        start: 'Serving Traders',
        highlight: 'Worldwide'
    },
    description: 'With our offices strategically located, we provide 24/7 support to traders across all major time zones. Our multilingual team ensures that language is never a barrier to accessing our services.',
    features: [
        { title: '80+ Countries', subtitle: 'Global Coverage', icon: 'Globe' },
        { title: '24/7 Support', subtitle: 'Round-the-clock', icon: 'Clock' },
        { title: '15+ Languages', subtitle: 'Multilingual Support', icon: 'MessageSquare' },
        { title: '2 Global Offices', subtitle: 'Strategic Locations', icon: 'Building' }
    ],
    buttonText: 'Contact Our Team',
    buttonLink: '/contact',
    offices: [
        {
            location: 'Gros Islet, Saint Lucia',
            type: 'Registered Office',
            address: 'Ground Floor, Rodney Court Building, Rodney Bay',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
    ]
}

const ctaData = {
    heading: 'Ready to Start Your Trading Journey?',
    description: 'Join thousands of traders who trust Jaaz Markets for their trading success. Experience our platform with a free demo account or start trading live today.',
    buttons: [
        {
            text: "Open Live Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "user"
        },
        {
            text: "Try Demo Account",
            href: "/demo",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const page = () => {
    return (
        <main>
            <AboutHero data={aboutHeroData} />
            <CompanyStats data={companyStatsData} />
            <OurStory data={ourStoryData} />
            <MissionValues data={missionValuesData} />
            <ProfessionalExcellence data={professionalExcellenceData} />
            <GlobalPresence data={globalPresenceData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
