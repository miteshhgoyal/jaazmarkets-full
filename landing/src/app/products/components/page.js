"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, BarChart3, Clock } from 'lucide-react';

const TradingStatsComponent = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const stats = [
        {
            value: "0.0",
            label: "Pips Spreads",
            icon: <BarChart3 className="w-6 h-6" />,
            color: "text-orange-400",
            bgColor: "from-orange-500/20 to-red-500/20",
            borderColor: "border-orange-500/30"
        },
        {
            value: "50ms",
            label: "Execution",
            icon: <Zap className="w-6 h-6" />,
            color: "text-green-400",
            bgColor: "from-green-500/20 to-emerald-500/20",
            borderColor: "border-green-500/30"
        },
        {
            value: "500+",
            label: "Instruments",
            icon: <TrendingUp className="w-6 h-6" />,
            color: "text-blue-400",
            bgColor: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-500/30"
        },
        {
            value: "24/7",
            label: "Support",
            icon: <Clock className="w-6 h-6" />,
            color: "text-yellow-400",
            bgColor: "from-yellow-500/20 to-orange-500/20",
            borderColor: "border-yellow-500/30"
        }
    ];

    return (
        <div className={`p-8 py-24 transition-all duration-500 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 `}>
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-12">


                <div className="text-center">
                    <h2 className={`text-4xl md:text-5xl xl:text-7xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Master the Markets.
                    </h2>
                    <h3 className="text-3xl md:text-5xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-6">
                        Trade with Confidence.
                    </h3>
                    <p className={`text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto`}>
                        Join thousands of traders who choose{' '}
                        <span className="text-primary-orange font-semibold">Jazz Markets</span>{' '}
                        for lightning-fast execution, razor-sharp spreads, and institutional-grade trading technology.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer ${isDarkMode
                                ? `bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor}`
                                : 'bg-white shadow-lg border border-gray-200 hover:shadow-xl'
                                }`}
                        >
                            {/* Background glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                            <div className="relative z-10 text-center">
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${isDarkMode ? stat.color : 'text-gray-600'
                                    } bg-white/10`}>
                                    {stat.icon}
                                </div>
                                <div className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? stat.color : 'text-gray-900'
                                    }`}>
                                    {stat.value}
                                </div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {stat.label}
                                </div>
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/10 to-transparent transition-all duration-700 ease-out"></div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25">
                        <span className="relative z-10 flex items-center gap-2">
                            Start Trading Today
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>

                    <button className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${isDarkMode
                        ? 'bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-600/50 hover:border-blue-500/50'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:border-blue-400'
                        }`}>
                        Try Demo Account
                        <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TradingStatsComponent;