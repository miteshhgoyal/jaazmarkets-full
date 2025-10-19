import React from 'react'
import BannerBackground from './BannerBackground'
import Link from "next/link"
import { Monitor, Download, Smartphone, ExternalLink, ArrowRight, Play } from 'lucide-react';

const StartTradingBanner = (props) => {
    // Default values
    const defaultTitle = {
        main: "Master the Markets.",
        highlight: "Trade with Confidence."
    };

    const defaultSubtitle = "Join thousands of traders who choose Jaaz Markets for lightning-fast execution, razor-sharp spreads, and institutional-grade trading technology.";

    const defaultStats = [
        { value: "0.0", label: "Pips Spreads" },
        { value: "50ms", label: "Execution" },
        { value: "500+", label: "Instruments" },
        { value: "24/7", label: "Support" }
    ];

    const defaultButtons = [
        {
            text: "Start Trading Today",
            link: "https://client.jaazmarkets.com/account?tab=register",
            variant: "primary",
            icon: "arrow"
        },
        {
            text: "Try Demo Account",
            link: "/demo",
            variant: "secondary",
            icon: "monitor"
        }
    ];

    const defaultTrustIndicators = [
        { text: "Regulated & Secure", icon: "shield" },
        { text: "Ultra-Fast Execution", icon: "zap" },
        { text: "Institutional Spreads", icon: "dollar" },
        { text: "24/7 Expert Support", icon: "clock" }
    ];

    // Use props or default values
    const title = props?.title || defaultTitle;
    const subtitle = props?.subtitle || defaultSubtitle;
    const stats = props?.stats || defaultStats;
    const buttons = props?.buttons || defaultButtons;
    const trustIndicators = props?.trustIndicators || defaultTrustIndicators;

    // Icon mapping for buttons - comprehensive list
    const getButtonIcon = (iconType) => {
        switch (iconType) {
            case 'arrow':
                return <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />;
            case 'monitor':
                return <Monitor className="w-5 h-5 ml-2" />;
            case 'download':
                return <Download className="w-5 h-5 ml-2" />;
            case 'smartphone':
                return <Smartphone className="w-5 h-5 ml-2" />;
            case 'external':
                return <ExternalLink className="w-5 h-5 ml-2" />;
            case 'play':
                return <Play className="w-5 h-5 ml-2" />;
            case 'smile':
                return (
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            case 'apple':
                return (
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                );
            case 'android':
                return (
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 48 48" fill="currentColor">
                        <path d="M7.7,16.2A2.7,2.7,0,0,0,5,18.9V30.3a2.8,2.8,0,0,0,1.2,2.3,2.6,2.6,0,0,0,1.5.4,2.7,2.7,0,0,0,2.2-1.1l.2-.3.3-.7v-12A2.7,2.7,0,0,0,7.7,16.2Z" />
                        <path d="M29.6,6l1.9-3.4c0-.1.1-.1.1-.2a.8.8,0,0,0-.2-.4h-.5l-2,3.5a4.9,4.9,0,0,0-1.7-.6,13.6,13.6,0,0,0-3.6-.5H21.8a12.9,12.9,0,0,0-3.5,1L16.4,2.2A.5.5,0,0,0,16,2h-.2a.4.4,0,0,0-.1.3v.2L17.6,6h0a11.8,11.8,0,0,0-4.4,3.9l-.5.8-.6,1.4a8.9,8.9,0,0,0-.7,3.6H35.8A11.1,11.1,0,0,0,29.6,6ZM18.1,11.4A1.1,1.1,0,0,1,17,10.3a1.1,1.1,0,0,1,1.1-1,1.1,1.1,0,0,1,1,1A1.1,1.1,0,0,1,18.1,11.4Zm11.1,0a1,1,0,0,1-1-1.1,1,1,0,0,1,2,0A1,1,0,0,1,29.2,11.4Z" />
                        <path d="M11.5,16.8V34.4a2.9,2.9,0,0,0,2.9,2.9h2v6A2.6,2.6,0,0,0,18,45.8h1.1l1-.2a2.7,2.7,0,0,0,1.7-2.5v-6h3.7v6a2.7,2.7,0,1,0,5.4,0v-6h2a3.5,3.5,0,0,0,1.7-.6,2.9,2.9,0,0,0,1.2-2.3V16.8Z" />
                        <path d="M42.2,18.9a2.6,2.6,0,0,0-2.1-2.6h-.6a2.7,2.7,0,0,0-2.7,2.7V30.3a2.7,2.7,0,1,0,5.4,0Z" />
                    </svg>
                );
            case 'windows':
                return (
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 3.5h11.5V12H0V3.5zm12.5 0H24V12H12.5V3.5zM0 12.5h11.5V21H0v-8.5zm12.5 0H24V21H12.5v-8.5z" />
                    </svg>
                );
            case 'macos':
                return (
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                );
            default:
                return <ArrowRight className="w-5 h-5 ml-2" />;
        }
    };

    // Icon mapping for trust indicators
    const getTrustIcon = (iconType) => {
        switch (iconType) {
            case 'shield':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-orange mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                );
            case 'zap':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                );
            case 'dollar':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                );
            case 'clock':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    // Get stat value colors
    const getStatColor = (index) => {
        const colors = ["text-primary-orange", "text-green-400", "text-blue-400", "text-yellow-400"];
        return colors[index] || "text-primary-orange";
    };

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
            <BannerBackground />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-32">
                <div className="max-w-6xl mx-auto text-center">

                    {/* Dynamic Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tighter tracking-tight mb-8">
                        {title.main}<br />
                        <span className="text-primary-orange">{title.highlight}</span>
                    </h1>

                    {/* Dynamic Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-tight mb-12">
                        {subtitle.includes('Jaaz Markets') ?
                            <>
                                {subtitle.split('Jaaz Markets')[0]}
                                <span className="text-primary-orange font-semibold">Jaaz Markets</span>
                                {subtitle.split('Jaaz Markets')[1]}
                            </>
                            : subtitle
                        }
                    </p>

                    {/* Dynamic Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                                <div className={`${getStatColor(index)} text-2xl font-bold`}>{stat.value}</div>
                                <div className="text-gray-300 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.link}
                                className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl ${button.variant === 'primary'
                                    ? 'bg-gradient-to-r from-primary-orange to-orange-700 hover:from-primary-orange-dark hover:to-primary-orange text-white'
                                    : 'bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-gray-400/10 hover:border-white hover:text-white'
                                    }`}
                            >
                                {button.text}
                                {getButtonIcon(button.icon)}
                            </a>
                        ))}
                    </div>

                    {/* Dynamic Trust Indicators */}
                    <div className="pt-8 border-t border-gray-800/50 flex flex-wrap justify-center gap-x-12 gap-y-6">
                        {trustIndicators.map((indicator, index) => (
                            <div key={index} className="flex items-center text-gray-300 hover:text-primary-orange transition-colors">
                                {getTrustIcon(indicator.icon)}
                                <span className="font-medium">{indicator.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StartTradingBanner
