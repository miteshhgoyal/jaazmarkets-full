"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

// Import icons with fallback handling
let TrendingUp, BarChart3, Users, Settings, LogIn, Menu, X, ChevronDown,
    Monitor, Building, HeadphonesIcon, HelpCircle, Download, Shield, Globe, BookOpen, Calendar, MoreHorizontal;

const icons = require("lucide-react");
TrendingUp = icons.TrendingUp;
BarChart3 = icons.BarChart3;
Users = icons.Users;
Settings = icons.Settings;
LogIn = icons.LogIn;
Menu = icons.Menu;
X = icons.X;
ChevronDown = icons.ChevronDown;
Monitor = icons.Monitor;
Building = icons.Building;
HeadphonesIcon = icons.Headphones;
HelpCircle = icons.HelpCircle;
Download = icons.Download;
Shield = icons.Shield;
Globe = icons.Globe;
BookOpen = icons.BookOpen
Calendar = icons.Calendar
MoreHorizontal = icons.MoreHorizontal

// Navigation Configuration
const NAVIGATION_CONFIG = {
    markets: {
        id: 'markets',
        label: 'Markets',
        icon: TrendingUp,
        items: [
            { href: '/products', label: 'All Products', icon: BarChart3, description: 'View all trading products' },
            { href: '/trading/forex', label: 'Forex', icon: TrendingUp, description: 'Currency trading' },
            { href: '/trading/advantages-of-forex', label: 'Advantages of Forex', icon: BarChart3, description: 'Benefits of forex trading' },
            { href: '/trading/stocks', label: 'Stocks', icon: Building, description: 'Stock market trading' },
            { href: '/trading/crypto', label: 'Cryptocurrencies', icon: TrendingUp, description: 'Digital currency trading' },
            { href: '/trading/indices', label: 'Indices', icon: BarChart3, description: 'Index trading' },
            { href: '/trading/metals', label: 'Precious Metals', icon: Shield, description: 'Gold, silver trading' },
            { href: '/trading/commodities', label: 'Commodities', icon: Globe, description: 'Raw materials trading' }
        ]
    },
    trading: {
        id: 'trading',
        label: 'Trading',
        icon: BarChart3,
        items: [
            { href: '/trading/account-types', label: 'Account Types', icon: Users, description: 'Different account options' },
            { href: '/trading/conditions', label: 'Trading Conditions', icon: Settings, description: 'Terms and conditions' },
            { href: '/trading/deposit-withdrawal', label: 'Deposit & Withdrawal', icon: BarChart3, description: 'Fund management' },
            { href: '/trading/hours', label: 'Trading Hours', icon: Globe, description: 'Market hours' },
            { href: '/trust/security', label: 'Security', icon: Shield, description: 'Account security' },
            // { href: '/trust/regulation', label: 'Regulation', icon: Building, description: 'Regulatory compliance' },
            { href: '/trust/cybersecurity', label: 'Cybersecurity', icon: Shield, description: 'Digital security measures' }
        ]
    },
    platforms: {
        id: 'platforms',
        label: 'Platforms',
        icon: Monitor,
        items: [
            { href: '/platform/overview', label: 'MT5 Overview', icon: Monitor, description: 'Platform overview' },
            { href: '/platform/web', label: 'Web Terminal', icon: Globe, description: 'Web-based trading' },
            { href: '/platform/desktop', label: 'Desktop Application', icon: Monitor, description: 'Desktop trading app' },
            { href: '/platform/mobile', label: 'Mobile Apps', icon: Monitor, description: 'Mobile trading apps' }
        ]
    },
    tools: {
        id: 'tools',
        label: 'Tools',
        icon: Settings,
        sections: [
            {
                title: 'Trading Tools',
                items: [
                    { href: '/tools/technical-analysis', label: 'Technical Analysis', icon: TrendingUp, description: 'Chart analysis tools' },
                    { href: '/tools/specifications', label: 'Product Specifications', icon: BarChart3, description: 'Product details' },
                    { href: '/tools/glossary', label: 'Trading Glossary', icon: BookOpen, description: 'Trading terms' },
                    { href: '/tools/calendar', label: 'Economic Calendar', icon: Calendar, description: 'Economic events' },
                    { href: '/tools/news', label: 'Market News', icon: Globe, description: 'Latest market news' },
                    { href: '/tools/calculators', label: 'Trading Calculators', icon: Settings, description: 'Trading calculators' }
                ]
            },
            {
                title: 'Education',
                items: [
                    { href: '/academy', label: 'Trading Academy', icon: BookOpen, description: 'Learn to trade' },
                    { href: '/blog', label: 'Market News & Blog', icon: Globe, description: 'News and insights' }
                ]
            }
        ]
    },
    more: {
        id: 'more',
        label: 'More',
        icon: MoreHorizontal,
        sections: [
            {
                title: 'Company',
                items: [
                    { href: '/about', label: 'About Us', icon: Building, description: 'Company information' },
                    { href: '/why-choose-us', label: 'Why Choose Us', icon: Shield, description: 'Our advantages' },
                    { href: '/contact', label: 'Contact Us', icon: HeadphonesIcon, description: 'Get in touch' }
                ]
            },
            {
                title: 'Support',
                items: [
                    { href: '/faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
                    { href: '/contact', label: 'Contact Support', icon: HeadphonesIcon, description: 'Support help' },
                    { href: '/legal', label: 'Legal Documents', icon: Building, description: 'Legal information' }
                ]
            }
        ]
    }
};

const SINGLE_LINKS = [
    { href: '/partners', label: 'Partners', icon: Users, description: 'Partnership opportunities' }
];

const CTA_BUTTONS = {
    login: { href: 'https://client.jaazmarkets.com/account?tab=login', label: 'Login', icon: LogIn, variant: 'secondary' },
    register: { href: 'https://client.jaazmarkets.com/account?tab=register', label: 'Start Trading', icon: TrendingUp, variant: 'primary' }
};

export default function Navbar() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileSection, setActiveMobileSection] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const navRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
                setActiveMobileSection(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
                setIsMobileMenuOpen(false);
                setActiveMobileSection(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Dropdown hover handlers with delay
    const handleDropdownEnter = (menuId) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setActiveDropdown(menuId);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    // Mobile menu handlers
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileMenuOpen) setActiveMobileSection(null);
    };

    const toggleMobileSection = (sectionId) => {
        setActiveMobileSection(activeMobileSection === sectionId ? null : sectionId);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveMobileSection(null);
    };

    // Safe icon renderer
    const renderIcon = (IconComponent, className = "w-4 h-4") => {
        if (!IconComponent) return null;
        return <IconComponent className={className} />;
    };

    // Component renderers
    const renderDesktopDropdown = (config) => {
        const isOpen = activeDropdown === config.id;

        return (
            <div
                key={config.id}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(config.id)}
                onMouseLeave={handleDropdownLeave}
            >
                <button
                    className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:text-orange-600 focus:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    {renderIcon(config.icon, "w-4 h-4 text-primary-orange")}
                    <span className="font-medium">{config.label}</span>
                    {renderIcon(ChevronDown, `w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`)}
                </button>

                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 ${config.id === 'support' ? 'w-80 right-0 left-auto' : 'w-64'} bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200 z-50 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                    <div className="py-2">
                        {config.sections ? (
                            // Render sections (for support menu)
                            config.sections.map((section, index) => (
                                <div key={section.title} className={index > 0 ? "border-t border-gray-100 pt-2" : ""}>
                                    <div className="px-3 pb-2">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            {section.title}
                                        </h3>
                                        {section.items.map((item) => (
                                            <a
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                                title={item.description}
                                            >
                                                {renderIcon(item.icon, "w-4 h-4 text-primary-orange")}
                                                <span className="text-sm">{item.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Render regular items
                            config.items.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 mx-2"
                                    title={item.description}
                                >
                                    {renderIcon(item.icon, "w-4 h-4 text-primary-orange")}
                                    <span className="text-sm">{item.label}</span>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderDesktopLink = (link) => {
        return (
            <a
                key={link.href}
                href={link.href}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 focus:text-orange-600 transition-colors duration-200 rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                title={link.description}
            >
                {renderIcon(link.icon, "w-4 h-4 text-primary-orange")}
                <span className="font-medium">{link.label}</span>
            </a>
        );
    };

    const renderCTAButton = (button) => {
        const isPrimary = button.variant === 'primary';

        return (
            <a
                key={button.href}
                href={button.href}
                className={`inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isPrimary
                    ? 'bg-primary-orange text-white hover:bg-orange-600 focus:ring-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'text-primary-orange bg-white border border-primary-orange hover:bg-orange-50 hover:border-primary-orange focus:ring-primary-orange'
                    }`}
            >
                {renderIcon(button.icon, "w-4 h-4")}
                <span>{button.label}</span>
            </a>
        );
    };

    const renderMobileSection = (config) => {
        const isExpanded = activeMobileSection === config.id;

        return (
            <div key={config.id} className="border-b border-gray-100 last:border-b-0">
                <button
                    className="w-full flex items-center justify-between px-4 py-4 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleMobileSection(config.id)}
                    aria-expanded={isExpanded}
                >
                    <div className="flex items-center space-x-3">
                        {renderIcon(config.icon, "w-5 h-5 text-primary-orange")}
                        <span className="font-medium">{config.label}</span>
                    </div>
                    {renderIcon(ChevronDown, `w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`)}
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-4 pb-4">
                        {config.sections ? (
                            config.sections.map((section, index) => (
                                <div key={section.title} className={index > 0 ? "mt-4 pt-4 border-t border-gray-100" : ""}>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                                        {section.title}
                                    </h4>
                                    {section.items.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center space-x-3 px-2 py-0.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                            onClick={closeMobileMenu}
                                        >
                                            {renderIcon(item.icon, "w-4 h-4 text-orange-400")}
                                            <span className="text-sm">{item.label}</span>
                                        </a>
                                    ))}
                                </div>
                            ))
                        ) : (
                            config.items.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center space-x-3 px-2 py-0.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    {renderIcon(item.icon, "w-4 h-4 text-orange-400")}
                                    <span className="text-sm">{item.label}</span>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderMobileLink = (link) => {
        return (
            <div key={link.href} className="border-b border-gray-100">
                <a
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={closeMobileMenu}
                >
                    {renderIcon(link.icon, "w-5 h-5 text-primary-orange")}
                    <span className="font-medium">{link.label}</span>
                </a>
            </div>
        );
    };

    return (
        <header
            ref={navRef}
            className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b transition-all duration-300 py-1.5 ${isScrolled ? 'border-gray-200 shadow-lg bg-white/98' : 'border-gray-100 shadow-sm'
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0">
                        <span className="text-xl px-0.5 font-black uppercase tracking-tighter bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent transition-all duration-300">
                            Jaaz Markets
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-0">
                        {Object.values(NAVIGATION_CONFIG).map(renderDesktopDropdown)}
                        {SINGLE_LINKS.map(renderDesktopLink)}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {Object.values(CTA_BUTTONS).map(renderCTAButton)}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors duration-200"
                        onClick={toggleMobileMenu}
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? renderIcon(X, "w-6 h-6") : renderIcon(Menu, "w-6 h-6")}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white border-t border-gray-100 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {/* Mobile Navigation Items */}
                        <div className="py-2">
                            {Object.values(NAVIGATION_CONFIG).map(renderMobileSection)}
                            {SINGLE_LINKS.map(renderMobileLink)}
                        </div>

                        {/* Mobile CTA Buttons */}
                        <div className="p-4 space-y-3">
                            {Object.values(CTA_BUTTONS).map((button) => (
                                <a
                                    key={button.href}
                                    href={button.href}
                                    className={`w-full inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${button.variant === 'primary'
                                        ? 'bg-primary-orange text-white hover:bg-orange-600 shadow-md'
                                        : 'text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100'
                                        }`}
                                    onClick={closeMobileMenu}
                                >
                                    {renderIcon(button.icon, "w-4 h-4")}
                                    <span>{button.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}