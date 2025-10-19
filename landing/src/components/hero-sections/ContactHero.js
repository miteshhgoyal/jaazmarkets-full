import React from 'react'
import { MessageCircle, Phone, Mail, Zap } from 'lucide-react'

export default function ContactHero({ data }) {
    const { badge, title, subtitle, channels, promise } = data

    return (
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Simplified Mobile Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Subtle background elements - hidden on mobile, visible on larger screens */}
                <div className="hidden md:block">
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 800 600">
                        <defs>
                            <radialGradient id="supportGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" style={{ stopColor: '#fc572e', stopOpacity: 0.6 }}></stop>
                                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }}></stop>
                            </radialGradient>
                        </defs>

                        {/* Central Support Hub */}
                        <circle cx="400" cy="300" r="6" fill="#fc572e">
                            <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite"></animate>
                        </circle>

                        {/* Simplified Connection Lines */}
                        <line x1="400" y1="300" x2="200" y2="150" stroke="#fc572e" strokeWidth="1" opacity="0.4">
                            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"></animate>
                        </line>
                        <line x1="400" y1="300" x2="600" y2="450" stroke="#fc572e" strokeWidth="1" opacity="0.4">
                            <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" begin="2s"></animate>
                        </line>
                    </svg>
                </div>

                {/* Mobile-optimized floating elements - only on larger screens */}
                <div className="hidden lg:block">
                    <div className="absolute top-20 left-4 xl:left-16 animate-float">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs border border-primary-orange/20">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center mr-2">
                                    <MessageCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-black">Live Chat</span>
                                    <div className="flex items-center">
                                        <div className="w-1.5 h-1.5 bg-primary-orange rounded-full mr-1 animate-pulse"></div>
                                        <span className="text-xs text-gray-600">Online now</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-xs">Response: <strong>30 seconds</strong></p>
                        </div>
                    </div>

                    <div className="absolute top-32 right-4 xl:right-20 animate-float" style={{ animationDelay: '1.5s' }}>
                        <div className="bg-gradient-to-br from-primary-orange to-primary-orange rounded-xl p-4 shadow-lg text-white max-w-xs">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold">Phone Support</span>
                                    <div className="text-xs opacity-90">24/7 Available</div>
                                </div>
                            </div>
                            <p className="text-xs opacity-90">Direct expert connection</p>
                        </div>
                    </div>
                </div>

                {/* Minimal mobile decoration */}
                <div className="absolute inset-0 md:hidden">
                    <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-primary-orange/5 rounded-full blur-lg animate-pulse"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-primary-orange/5 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Subtle dots for larger screens */}
                <div className="hidden md:block absolute inset-0">
                    <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary-orange rounded-full animate-ping opacity-40"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-20" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-primary-orange rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Reduced glow effects */}
                <div className="hidden lg:block absolute top-1/3 right-1/4 w-24 h-24 bg-primary-orange/5 rounded-full blur-xl animate-pulse"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Mobile-first header section */}
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-primary-orange/20 text-primary-orange rounded-full text-xs sm:text-sm font-bold border border-primary-orange/30 mb-4 sm:mb-6 lg:mb-8">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                            {badge}
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-4 sm:mb-6 lg:mb-8 px-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange via-white to-primary-orange">{title}</span>
                        </h1>

                        <div className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 font-medium max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
                            <span className="text-primary-orange font-bold">{subtitle.personal}</span> {subtitle.text}<br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>
                            <span className="text-white font-semibold">{subtitle.available}</span> • <span className="text-primary-orange font-semibold">{subtitle.expert}</span> • <span className="text-white font-semibold">{subtitle.instant}</span>
                        </div>
                    </div>

                    {/* Mobile-optimized contact channels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0">
                        {channels.map((channel, index) => {
                            const IconComp = channel.icon === 'MessageCircle' ? MessageCircle :
                                channel.icon === 'Phone' ? Phone : Mail
                            return (
                                <div key={index} className={`group ${channel.bgStyle} rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 ${channel.borderStyle} hover:bg-white/20 ${channel.hoverBorder} transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 text-center h-full flex flex-col min-h-[280px] sm:min-h-[320px]`}>
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${channel.iconBg} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <IconComp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-black text-white mb-2 sm:mb-3">{channel.title}</h3>
                                    <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm flex-grow">{channel.description}</p>
                                    <div className={`${channel.statusBg} rounded-xl p-3 mb-3 sm:mb-4`}>
                                        {channel.status && (
                                            <div className="flex items-center justify-center mb-1">
                                                <div className="w-2 h-2 bg-primary-orange rounded-full mr-2 animate-pulse"></div>
                                                <span className="text-primary-orange font-bold text-xs">{channel.status}</span>
                                            </div>
                                        )}
                                        <div className={`${channel.statusText} font-bold text-sm`}>{channel.statusInfo}</div>
                                        {channel.contact && (
                                            <div className="text-primary-orange font-bold text-base sm:text-lg">{channel.contact}</div>
                                        )}
                                    </div>
                                    {/* Mobile-optimized button with better touch target */}
                                    <button className={`w-full ${channel.buttonStyle} text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg mt-auto min-h-[44px] text-sm sm:text-base`}>
                                        {channel.buttonText}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile-optimized support promise section */}
                    <div className="text-center px-2 sm:px-0">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-white/20 max-w-4xl mx-auto">
                            <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4">{promise.title}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                                {promise.stats.map((stat, index) => (
                                    <div key={index} className="text-center p-2 sm:p-0">
                                        <div className={`${stat.color} text-lg sm:text-xl font-black mb-1`}>{stat.value}</div>
                                        <div className="text-gray-300 text-xs sm:text-sm font-semibold">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0">
                                <strong>{promise.description.strong}</strong> {promise.description.text}
                            </p>

                            {/* Mobile-optimized CTA button */}
                            <a href={promise.button.href} target="_blank" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-primary-orange to-primary-orange hover:from-primary-orange/90 hover:to-primary-orange/90 text-white font-bold text-sm sm:text-base rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg min-h-[44px] min-w-[200px]">
                                {promise.button.text}
                                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
