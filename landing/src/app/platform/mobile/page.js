// app/platform/mobile/page.js
import StartTradingBanner from '@/components/StartTradingBanner'
import StartTradingCTA from '@/components/StartTradingCTA'
import MobileDownloads from '@/components/MobileDownloads'
import PlatformFeatures from '@/components/PlatformFeatures'
import DeviceCompatibility from '@/components/DeviceCompatibility'
import React from 'react'

const bannerProps = {
    buttons: [
        {
            text: "Download for iOS",
            link: "https://download.mql5.com/cdn/mobile/mt5/ios?server=JaazMarkets-Server",
            variant: "primary",
            icon: "apple"
        },
        {
            text: "Download for Android",
            link: "https://download.mql5.com/cdn/mobile/mt5/android?server=JaazMarkets-Server",
            variant: "secondary",
            icon: "android"
        }
    ],
}

const MobileDownloadsData = {
    heading: 'Download MT5 Mobile',
    description: 'Get MT5 for your mobile device and trade with the same powerful features as desktop platforms.',
    downloads: [
        {
            title: 'iOS App',
            compatibility: 'For iPhone and iPad (iOS 12.0+)',
            gradientFrom: 'from-blue-50',
            gradientTo: 'to-indigo-100',
            borderColor: 'border-blue-200 ',
            iconGradient: 'from-blue-500 to-blue-600',
            icon: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
            features: ['Face ID & Touch ID support', 'Native iOS performance', 'Push notifications'],
            buttonText: 'Download from App Store',
            buttonGradient: 'from-blue-600 to-blue-700',
            buttonHover: 'hover:from-blue-700 hover:to-blue-800',
            downloadUrl: 'https://download.mql5.com/cdn/mobile/mt5/ios?server=JaazMarkets-Server'
        },
        {
            title: 'Android App',
            compatibility: 'For Android devices (7.0+)',
            gradientFrom: 'from-green-50',
            gradientTo: 'to-emerald-100',
            borderColor: 'border-green-200 ',
            iconGradient: 'from-green-500 to-green-600',
            icon: 'M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993C18.5223 14.8928 18.0734 15.3414 17.523 15.3414zM6.4766 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993C7.4759 14.8928 7.0277 15.3414 6.4766 15.3414zM12 10.5c-2.2091 0-4-1.7909-4-4s1.7909-4 4-4 4 1.7909 4 4S14.2091 10.5 12 10.5z',
            features: ['Fingerprint authentication', 'Widget support', 'Optimized for all screen sizes'],
            buttonText: 'Get it on Google Play',
            buttonGradient: 'from-green-600 to-green-700',
            buttonHover: 'hover:from-green-700 hover:to-green-800',
            downloadUrl: 'https://download.mql5.com/cdn/mobile/mt5/android?server=JaazMarkets-Server'
        },
        {
            title: 'Huawei App',
            compatibility: 'For Huawei devices (AppGallery)',
            gradientFrom: 'from-red-50',
            gradientTo: 'to-pink-100',
            borderColor: 'border-red-200 ',
            iconGradient: 'from-red-500 to-red-600',
            icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            features: ['HMS integration', 'Optimized for Huawei devices', 'Push notifications'],
            buttonText: 'Get on AppGallery',
            buttonGradient: 'from-red-600 to-red-700',
            buttonHover: 'hover:from-red-700 hover:to-red-800',
            downloadUrl: 'https://download.mql5.com/cdn/mobile/mt5/android/app-gallery'
        }
    ]
}

const MobileFeaturesData = {
    heading: 'Mobile Trading Features',
    description: 'Full trading functionality optimized for mobile devices with intuitive touch interface.',
    features: [
        {
            title: 'One-Touch Trading',
            description: 'Execute trades with a single tap using optimized mobile interface and quick order entry.',
            bgColor: 'bg-primary-orange/10',
            iconColor: 'text-primary-orange',
            icon: 'M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11',
            benefits: []
        },
        {
            title: 'Advanced Charts',
            description: 'Full charting capabilities with technical indicators, drawing tools, and multiple timeframes.',
            bgColor: 'bg-blue-100 /30',
            iconColor: 'text-blue-600',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            benefits: []
        },
        {
            title: 'Smart Notifications',
            description: 'Receive instant alerts for price movements, order executions, and market news on your device.',
            bgColor: 'bg-green-100 /30',
            iconColor: 'text-green-600',
            icon: 'M15 17h5l-5 5v-5zM21 8a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3v2z',
            benefits: []
        },
        {
            title: 'Biometric Security',
            description: 'Secure access using Face ID, Touch ID, or fingerprint authentication for enhanced security.',
            bgColor: 'bg-purple-100 /30',
            iconColor: 'text-purple-600',
            icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
            benefits: []
        },
        {
            title: 'Offline Charts',
            description: 'View historical data and analyze charts even when offline for uninterrupted trading analysis.',
            bgColor: 'bg-yellow-100 /30',
            iconColor: 'text-yellow-600',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
            benefits: []
        },
        {
            title: 'Cross-Device Sync',
            description: 'Seamlessly sync your settings, watchlists, and charts across mobile and desktop platforms.',
            bgColor: 'bg-red-100 /30',
            iconColor: 'text-red-600',
            icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
            benefits: []
        }
    ]
}

const DeviceCompatibilityData = {
    heading: 'Device Compatibility',
    description: 'MT5 mobile apps work perfectly on phones and tablets with optimized interfaces for different screen sizes.',
    devices: [
        {
            type: 'phone',
            title: 'Smartphone Interface',
            containerClass: 'w-64 h-96',
            rounded: 'rounded-3xl',
            innerRounded: 'rounded-2xl',
            description: 'Optimized for one-handed operation with quick access to essential trading functions.'
        },
        {
            type: 'tablet',
            title: 'Tablet Interface',
            containerClass: 'w-80 h-60',
            rounded: 'rounded-2xl',
            innerRounded: 'rounded-xl',
            description: 'Desktop-like experience with multiple panels and advanced trading tools on larger screens.'
        }
    ]
}

const ctaProps = {
    buttons: [
        {
            text: "Download for iOS",
            href: "https://download.mql5.com/cdn/mobile/mt5/ios?server=JaazMarkets-Server",
            variant: "primary",
            icon: "apple"
        },
        {
            text: "Download for Android",
            href: "https://download.mql5.com/cdn/mobile/mt5/android?server=JaazMarkets-Server",
            variant: "secondary",
            icon: "android"
        }
    ],
}

const ctaData = {
    heading: 'Start Mobile Trading Today',
    description: 'Download MT5 mobile app and trade professionally from anywhere. Available on all major app stores.',
    buttons: ctaProps.buttons
}

const page = () => {
    return (
        <main>
            <StartTradingBanner {...bannerProps} />
            <MobileDownloads data={MobileDownloadsData} />
            <PlatformFeatures data={MobileFeaturesData} />
            <DeviceCompatibility data={DeviceCompatibilityData} />
            <StartTradingCTA {...ctaData} />
        </main>
    )
}

export default page
