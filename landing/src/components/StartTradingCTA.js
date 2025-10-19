import React from 'react';
import Link from "next/link";
import { User, Monitor, ArrowRight, DollarSign, ExternalLink, Download, Smartphone, Play, Search } from 'lucide-react';

const StartTradingCTA = ({
    heading = "Ready to start trading?",
    description = "Choose your account type and join thousands of traders who trust Jaaz Markets for their trading success.",
    buttons = [
        {
            text: "Open Live Account",
            href: "https://client.jaazmarkets.com/account?tab=register",
            target: "_self",
            variant: "primary",
            icon: "user",
        },
        {
            text: "Try Demo Account",
            href: "/demo",
            target: "_self",
            variant: "secondary",
            icon: "monitor",
        },
    ],
}) => {
    // Comprehensive icon mapping for all button types
    const getButtonIcon = (iconType) => {
        switch (iconType) {
            case 'user':
                return <User className="w-5 h-5 mr-2" />;
            case 'monitor':
                return <Monitor className="w-5 h-5 mr-2" />;
            case 'arrow':
                return <ArrowRight className="w-5 h-5 mr-2" />;
            case 'dollar':
                return <DollarSign className="w-5 h-5 mr-2" />;
            case 'external':
                return <ExternalLink className="w-5 h-5 mr-2" />;
            case 'download':
                return <Download className="w-5 h-5 mr-2" />;
            case 'smartphone':
                return <Smartphone className="w-5 h-5 mr-2" />;
            case 'play':
                return <Play className="w-5 h-5 mr-2" />;
            case 'search':
                return <Search className="w-5 h-5 mr-2" />;
            case 'apple':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                );
            case 'android':
                return (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="currentColor">
                        <path d="M7.7,16.2A2.7,2.7,0,0,0,5,18.9V30.3a2.8,2.8,0,0,0,1.2,2.3,2.6,2.6,0,0,0,1.5.4,2.7,2.7,0,0,0,2.2-1.1l.2-.3.3-.7v-12A2.7,2.7,0,0,0,7.7,16.2Z" />
                        <path d="M29.6,6l1.9-3.4c0-.1.1-.1.1-.2a.8.8,0,0,0-.2-.4h-.5l-2,3.5a4.9,4.9,0,0,0-1.7-.6,13.6,13.6,0,0,0-3.6-.5H21.8a12.9,12.9,0,0,0-3.5,1L16.4,2.2A.5.5,0,0,0,16,2h-.2a.4.4,0,0,0-.1.3v.2L17.6,6h0a11.8,11.8,0,0,0-4.4,3.9l-.5.8-.6,1.4a8.9,8.9,0,0,0-.7,3.6H35.8A11.1,11.1,0,0,0,29.6,6ZM18.1,11.4A1.1,1.1,0,0,1,17,10.3a1.1,1.1,0,0,1,1.1-1,1.1,1.1,0,0,1,1,1A1.1,1.1,0,0,1,18.1,11.4Zm11.1,0a1,1,0,0,1-1-1.1,1,1,0,0,1,2,0A1,1,0,0,1,29.2,11.4Z" />
                        <path d="M11.5,16.8V34.4a2.9,2.9,0,0,0,2.9,2.9h2v6A2.6,2.6,0,0,0,18,45.8h1.1l1-.2a2.7,2.7,0,0,0,1.7-2.5v-6h3.7v6a2.7,2.7,0,1,0,5.4,0v-6h2a3.5,3.5,0,0,0,1.7-.6,2.9,2.9,0,0,0,1.2-2.3V16.8Z" />
                        <path d="M42.2,18.9a2.6,2.6,0,0,0-2.1-2.6h-.6a2.7,2.7,0,0,0-2.7,2.7V30.3a2.7,2.7,0,1,0,5.4,0Z" />
                    </svg>
                );
            case 'windows':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 3.5h11.5V12H0V3.5zm12.5 0H24V12H12.5V3.5zM0 12.5h11.5V21H0v-8.5zm12.5 0H24V21H12.5v-8.5z" />
                    </svg>
                );
            case 'macos':
                return (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                );
            case 'smile':
                return (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            default:
                return <ArrowRight className="w-5 h-5 mr-2" />;
        }
    };

    return (
        <section className="bg-gradient-to-br from-primary-orange to-orange-700 py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-white max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{heading}</h2>
                    <p className="text-lg lg:text-xl mb-8 opacity-90 leading-relaxed">
                        {description.includes('Jaaz Markets') ?
                            <>
                                {description.split('Jaaz Markets')[0]}
                                <span className="font-semibold">Jaaz Markets</span>
                                {description.split('Jaaz Markets')[1]}
                            </>
                            : description
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {buttons.map((button, index) => {
                            const isPrimary = button.variant === 'primary';

                            return (
                                <a
                                    key={index}
                                    href={button.href}
                                    target={button.target || "_self"}
                                    className={`inline-flex items-center justify-center px-8 py-4 font-medium rounded-lg transition text-lg ${isPrimary
                                        ? 'bg-white text-primary-orange hover:bg-gray-100'
                                        : 'border-2 border-white text-white hover:bg-white hover:text-primary-orange'
                                        }`}
                                >
                                    {getButtonIcon(button.icon)}
                                    {button.text}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StartTradingCTA;
