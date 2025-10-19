"use client";
import Link from "next/link";
import { useState } from 'react';
import {
    MapPin,
    Mail,
    Phone,
    Shield,
    Award,
    Lock,
    AlertTriangle,
    Globe,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function Footer() {
    const [isRiskDisclaimerExpanded, setIsRiskDisclaimerExpanded] = useState(false);

    return (
        <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 mb-10 sm:mb-12">

                    {/* Brand Section */}
                    <div className="sm:col-span-2 lg:col-span-1 order-1">
                        <div className="flex items-center mb-4 sm:mb-6">
                            <a href="/" className="flex items-center group">
                                <p className="px-0.5 text-lg sm:text-xl lg:text-2xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 transition-all duration-300">
                                    Jaaz Markets
                                </p>
                            </a>
                        </div>
                        <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
                            Your trusted forex broker with competitive spreads, fast execution, and world-class trading platforms. Trade with power, trade with Jaaz.
                        </p>

                        {/* Social Media Links with Better Touch Targets */}
                        <div className="flex space-x-2 sm:space-x-4">
                            <a
                                href="https://www.instagram.com/jaazmarkets/"
                                className="text-gray-400 hover:text-primary-orange transition-colors duration-300 p-2 sm:p-3 rounded-lg hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-opacity-50 group"
                                title="Follow us on Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow Jaaz Markets on Instagram"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.415 2.227.055 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.415-1.274.055-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"></path>
                                </svg>
                            </a>
                            <a
                                href="https://x.com/JazzMarkets"
                                className="text-gray-400 hover:text-primary-orange transition-colors duration-300 p-2 sm:p-3 rounded-lg hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-opacity-50 group"
                                title="Follow us on X (Twitter)"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow Jaaz Markets on X (formerly Twitter)"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="order-3 sm:order-2">
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-gray-200">Quick Links</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li>
                                <a
                                    href="/about"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/platform/overview"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    MT5 Platform
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/trading/account-types"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Account Types
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/academy"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Education
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/partners"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Partner Program
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="order-4 sm:order-3">
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-gray-200">Legal</h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li>
                                <a
                                    href="/legal"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Legal Documents
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/legal/terms-conditions"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Terms &amp; Conditions
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/legal/privacy-policy"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/legal/risk-disclosure"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Risk Disclosure
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/legal/aml-kyc-policy"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    AML/KYC Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/trust/security"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange hover:translate-x-1 inline-block transform"
                                >
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="order-2 sm:order-4 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6 text-gray-200">Contact Us</h3>
                        <ul className="space-y-4 sm:space-y-5">
                            <li className="flex items-start group">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <div className="text-gray-400 text-sm sm:text-base">
                                    <div>Ground Floor, Rodney Court Building, Rodney Bay</div>
                                    <div>Gros Islet, Saint Lucia</div>
                                </div>
                            </li>
                            <li className="flex items-start group">
                                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <a
                                    href="mailto:info@jaazmarkets.com"
                                    className="text-gray-400 hover:text-primary-orange transition-colors duration-300 text-sm sm:text-base focus:outline-none focus:underline focus:decoration-primary-orange"
                                    aria-label="Send email to info@jaazmarkets.com"
                                >
                                    info@jaazmarkets.com
                                </a>
                            </li>
                            <li className="flex items-start group">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-orange mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                                <div className="text-gray-400 text-sm sm:text-base">
                                    <a
                                        href="tel:+18446942090"
                                        className="hover:text-primary-orange transition-colors duration-300 focus:outline-none focus:underline focus:decoration-primary-orange"
                                        aria-label="Call +1-844-694-2090"
                                    >
                                        +1-844-694-2090
                                    </a>
                                    <div className="text-xs sm:text-sm text-gray-500 mt-1">24/7 Support</div>
                                </div>
                            </li>
                        </ul>

                        {/* Trust & Security Badges */}
                        {/* <div className="mt-6 sm:mt-8">
                            <div className="text-xs sm:text-sm font-semibold text-gray-300 mb-3">Trust &amp; Security</div>
                            <div className="flex flex-wrap gap-2">
                                <div className="bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs text-gray-400 border border-gray-700 flex items-center hover:bg-gray-700/50 transition-colors duration-300 group">
                                    <Shield className="w-3 h-3 mr-1 flex-shrink-0 group-hover:text-primary-orange transition-colors duration-300" />
                                    <span>SSL Secured</span>
                                </div>
                                <div className="bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs text-gray-400 border border-gray-700 flex items-center hover:bg-gray-700/50 transition-colors duration-300 group">
                                    <Award className="w-3 h-3 mr-1 flex-shrink-0 group-hover:text-primary-orange transition-colors duration-300" />
                                    <span>Licensed</span>
                                </div>
                                <div className="bg-gray-800 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs text-gray-400 border border-gray-700 flex items-center hover:bg-gray-700/50 transition-colors duration-300 group">
                                    <Lock className="w-3 h-3 mr-1 flex-shrink-0 group-hover:text-primary-orange transition-colors duration-300" />
                                    <span>Regulated</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Risk Disclaimer Section - Collapsible on Mobile */}
                <div className="pt-8 sm:pt-12 pb-6 sm:pb-8 border-t border-gray-800">
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 sm:p-6 md:p-8">
                        <button
                            onClick={() => setIsRiskDisclaimerExpanded(!isRiskDisclaimerExpanded)}
                            className="flex items-start justify-between w-full text-left mb-4 sm:mb-6 lg:cursor-default group"
                            aria-expanded={isRiskDisclaimerExpanded}
                            aria-controls="risk-disclaimer-content"
                            type="button"
                        >
                            <div className="flex items-start">
                                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mr-3 sm:mr-4 mt-1 flex-shrink-0 group-hover:text-primary-orange transition-colors duration-300" />
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-2">Risk Disclaimer</h3>
                                    <p className="text-gray-400 font-semibold text-sm sm:text-base">High Risk Investment Warning</p>
                                </div>
                            </div>
                            <div className="lg:hidden ml-4">
                                {isRiskDisclaimerExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400 hover:text-primary-orange transition-colors duration-300" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 hover:text-primary-orange transition-colors duration-300" />
                                )}
                            </div>
                        </button>

                        <div
                            id="risk-disclaimer-content"
                            className={`space-y-4 text-sm text-gray-400 leading-relaxed transition-all duration-300 overflow-hidden ${isRiskDisclaimerExpanded
                                ? 'max-h-[2000px] opacity-100 lg:max-h-none'
                                : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100'
                                }`}
                            style={{ transitionProperty: 'max-height, opacity' }}
                        >
                            <p>
                                <strong className="text-gray-200">Investment Risk:</strong> An investment in derivatives may mean investors may lose an amount even
                                greater than their original investment. Anyone wishing to invest in any of the products mentioned in https://www.jaazmarkets.com/ should seek their own financial or professional advice. Trading of securities, forex, stock market, commodities, options and futures may not be suitable for everyone and involves the risk of losing part or all of your money. Trading in the financial markets has large potential rewards, but also large potential risk. You must be aware of the risks and be willing to accept them in order to invest in the markets. Don't invest and trade with money which you can't afford to lose. Forex Trading are not allowed in some countries, before investing your money, make sure whether your country is allowing this or not.
                            </p>

                            <p>
                                <strong className="text-gray-200">Professional Advice:</strong> You are strongly advised to obtain independent financial, legal and tax advice before proceeding with any currency or spot metals trade. Nothing in this site should be read or construed as constituting advice on the part of Jaaz Markets Ltd. or any of its affiliates, directors, officers or employees.
                            </p>

                            <div className="bg-gray-700/30 rounded-lg p-4 mt-6 border border-gray-600/30">
                                <h4 className="text-gray-300 font-semibold mb-3 flex items-center text-sm sm:text-base">
                                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-orange" />
                                    Restricted Regions
                                </h4>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    Jaaz Markets Ltd. does not provide services for citizens/residents of the <strong className='text-gray-200'>United States, Cuba, Iraq, Myanmar, North Korea, Sudan, United Arab Emirates and India.</strong> The services of Jaaz Markets Ltd. are not intended for distribution to, or use by, any person in any country or jurisdiction where such distribution or use would be contrary to local law or regulation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="pt-6 sm:pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
                        <div className="text-gray-500 text-xs sm:text-sm">
                            <p>© {new Date().getFullYear()} Jazz Markets. All rights reserved.</p>
                        </div>

                        {/* Hidden SEO Content */}
                        <div className="sr-only">
                            <div className="mb-2">
                                <span>Website Development &amp; Best Forex CRM Solutions powered by </span>
                                <a href="https://brokeret.com" target="_blank" rel="noopener" title="Leading Forex Technology Provider" className="text-primary-orange hover:text-primary-orange-dark transition">Brokeret</a>
                                <span> - Industry-leading Forex CRM Provider</span>
                            </div>
                            <div className="mb-2">
                                <span>Advanced Trading Technology &amp; </span>
                                <a href="https://brokeret.com" target="_blank" rel="noopener" title="Best Forex CRM Platform" className="text-primary-orange hover:text-primary-orange-dark transition">Professional Forex CRM Platform</a>
                                <span> delivering institutional-grade trading solutions</span>
                            </div>
                            <div className="mb-2">
                                <span>Risk Management Systems &amp; </span>
                                <a href="https://brokeret.com" target="_blank" rel="noopener" title="Forex CRM Technology Solutions" className="text-primary-orange hover:text-primary-orange-dark transition">Forex CRM Technology Solutions</a>
                                <span> by leading financial technology innovators</span>
                            </div>
                            <div>
                                <span>MT5 Integration &amp; </span>
                                <a href="https://brokeret.com" target="_blank" rel="noopener" title="Best Forex CRM Software" className="text-primary-orange hover:text-primary-orange-dark transition">Best Forex CRM Software</a>
                                <span> providing comprehensive broker management solutions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
