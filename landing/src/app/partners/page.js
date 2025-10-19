import StartTradingBanner from '@/components/StartTradingBanner'
import PartnerBenefits from '@/components/PartnerBenefits'
import CommissionStructure from '@/components/CommissionStructure'
import PartnershipTypes from '@/components/PartnershipTypes'
import GetStartedSteps from '@/components/GetStartedSteps'
import StartTradingCTA from '@/components/StartTradingCTA'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Become a Partner",
            link: "https://client.jaazmarkets.com/account?tab=register-partner",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Learn More",
            link: "#partner-benefits",
            variant: "secondary",
            icon: "smile"
        }
    ],
}

const benefitsData = {
    heading: 'Why Partner with Jaaz Markets',
    description: 'Access industry-leading commission structures, comprehensive support, and powerful marketing tools to grow your business.',
    benefits: [
        {
            title: 'High Commissions',
            description: 'Earn up to $15 per lot with our competitive commission structure and performance bonuses.',
            iconName: 'DollarSign',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange'
        },
        {
            title: 'Marketing Support',
            description: 'Access professional marketing materials, banners, and promotional content to boost your conversions.',
            iconName: 'Megaphone',
            iconBg: 'bg-blue-100 /30',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Dedicated Support',
            description: 'Get personalized support from our dedicated partner success team to maximize your earning potential.',
            iconName: 'HeadphonesIcon',
            iconBg: 'bg-green-100 /30',
            iconColor: 'text-green-600'
        },
        {
            title: 'Real-Time Reporting',
            description: 'Track your performance with detailed analytics and real-time commission reporting dashboard.',
            iconName: 'BarChart3',
            iconBg: 'bg-purple-100 /30',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Fast Payments',
            description: 'Receive your commissions quickly with multiple payment options and flexible payout schedules.',
            iconName: 'Zap',
            iconBg: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600'
        },
        {
            title: 'Global Reach',
            description: 'Access clients worldwide with our multi-language support and global regulatory compliance.',
            iconName: 'Globe',
            iconBg: 'bg-red-100 /30',
            iconColor: 'text-red-600'
        }
    ]
}

const commissionData = {
    heading: 'Commission Structure',
    description: 'Transparent and competitive commission rates with performance-based bonuses.',
    disclaimer: '* Commission rates and bonus percentages shown are typical/indicative values for illustration purposes only. Actual rates may vary based on account type, trading volume, partnership agreement, and other factors. Commission structures are subject to change. Please contact our partnership team for current rates and personalized commission plans.',
    tiers: [
        {
            level: 'Bronze',
            volume: '0 - 50 lots',
            commission: '$8',
            bonus: null
        },
        {
            level: 'Silver',
            volume: '51 - 200 lots',
            commission: '$10',
            bonus: '5%'
        },
        {
            level: 'Gold',
            volume: '201 - 500 lots',
            commission: '$12',
            bonus: '10%'
        },
        {
            level: 'Platinum',
            volume: '500+ lots',
            commission: '$15',
            bonus: '15%'
        }
    ]
}

const partnershipTypesData = {
    heading: 'Partnership Options',
    description: 'Choose the partnership model that best fits your business needs and goals.',
    types: [
        {
            title: 'Introducing Broker',
            iconName: 'Users',
            iconBg: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            features: [
                'Commission per lot traded',
                'Marketing materials provided',
                'Real-time reporting',
                'Dedicated support'
            ],
            buttonText: 'Apply Now',
            buttonLink: 'https://client.jaazmarkets.com/account?tab=register-partner',
            buttonStyle: 'bg-primary-orange text-white hover:bg-primary-orange/90',
            featured: false
        },
        {
            title: 'White Label',
            badge: 'POPULAR',
            iconName: 'Building',
            iconBg: 'bg-blue-100/30',
            iconColor: 'text-blue-600',
            features: [
                'Your own branded platform',
                'Complete back-office solution',
                'Risk management tools',
                'Technical support'
            ],
            buttonText: 'Learn More',
            buttonLink: '/white-label',
            buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
            featured: true
        },
        {
            title: 'Regional Representative',
            iconName: 'Globe',
            iconBg: 'bg-green-100/30',
            iconColor: 'text-green-600',
            features: [
                'Exclusive territory rights',
                'Higher commission rates',
                'Local marketing support',
                'Training programs'
            ],
            buttonText: 'Contact Us',
            buttonLink: '/contact-regional',
            buttonStyle: 'bg-green-600 text-white hover:bg-green-700',
            featured: false
        }
    ]
}

const stepsData = {
    heading: 'Get Started in 4 Steps',
    description: 'Join our partner program and start earning commissions in just a few simple steps.',
    steps: [
        {
            number: 1,
            title: 'Apply',
            description: 'Submit your partner application with basic business information and requirements.',
            bgColor: 'bg-primary-orange'
        },
        {
            number: 2,
            title: 'Review',
            description: 'Our team reviews your application and contacts you within 24 hours for approval.',
            bgColor: 'bg-blue-600'
        },
        {
            number: 3,
            title: 'Setup',
            description: 'Access your partner dashboard and receive marketing materials and tracking links.',
            bgColor: 'bg-green-600'
        },
        {
            number: 4,
            title: 'Earn',
            description: 'Start referring clients and earning commissions with real-time tracking and reporting.',
            bgColor: 'bg-purple-600'
        }
    ]
}

const ctaData = {
    heading: 'Ready to Partner with Us?',
    description: 'Join thousands of successful partners earning competitive commissions with Jaaz Markets. Start your partnership journey today.',
    buttons: [
        {
            text: "Become a Partner",
            href: "https://client.jaazmarkets.com/account?tab=register-partner",
            variant: "primary",
            icon: "user"
        },
        {
            text: "Contact Us",
            href: "/contact",
            variant: "secondary",
            icon: "monitor"
        }
    ],
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <PartnerBenefits data={benefitsData} />
            <CommissionStructure data={commissionData} />
            {/* <PartnershipTypes data={partnershipTypesData} /> */}
            <GetStartedSteps data={stepsData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
