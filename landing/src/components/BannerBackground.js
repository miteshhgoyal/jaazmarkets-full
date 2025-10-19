import React from 'react'

const BannerBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden">

            <div className="absolute inset-0">

                <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-[25%] left-[85%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: 1 }}></div>
                <div className="absolute top-[35%] left-[20%] w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-50" style={{ animationDelay: 2 }}></div>
                <div className="absolute top-[45%] left-[75%] w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: 0.5 }}></div>
                <div className="absolute top-[55%] left-[15%] w-1.5 h-1.5 bg-primary-orange rounded-full animate-ping opacity-80" style={{ animationDelay: 3 }}></div>
                <div className="absolute top-[65%] left-[90%] w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: 1.5 }}></div>
                <div className="absolute top-[75%] left-[30%] w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" style={{ animationDelay: 4 }}></div>
                <div className="absolute top-[85%] left-[70%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-55" style={{ animationDelay: 2.5 }}></div>


                <div className="absolute top-[20%] left-[45%] w-1 h-1 bg-red-400 rounded-full animate-ping opacity-40" style={{ animationDelay: 3.5 }}></div>
                <div className="absolute top-[30%] left-[60%] w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-65" style={{ animationDelay: 0.8 }}></div>
                <div className="absolute top-[40%] left-[5%] w-2 h-2 bg-primary-orange rounded-full animate-ping opacity-75" style={{ animationDelay: 1.8 }}></div>
                <div className="absolute top-[50%] left-[95%] w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: 4.2 }}></div>
                <div className="absolute top-[60%] left-[40%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-70" style={{ animationDelay: 2.8 }}></div>
                <div className="absolute top-[70%] left-[80%] w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: 1.2 }}></div>
                <div className="absolute top-[80%] left-[25%] w-2 h-2 bg-green-400 rounded-full animate-ping opacity-65" style={{ animationDelay: 3.8 }}></div>
                <div className="absolute top-[90%] left-[55%] w-1.5 h-1.5 bg-primary-orange rounded-full animate-pulse opacity-60" style={{ animationDelay: 0.3 }}></div>


                <div className="absolute top-[12%] left-[65%] w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-35" style={{ animationDelay: 5 }}></div>
                <div className="absolute top-[22%] left-[35%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-55" style={{ animationDelay: 1.7 }}></div>
                <div className="absolute top-[32%] left-[88%] w-1 h-1 bg-green-400 rounded-full animate-ping opacity-40" style={{ animationDelay: 3.2 }}></div>
                <div className="absolute top-[42%] left-[12%] w-2 h-2 bg-red-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: 0.7 }}></div>
                <div className="absolute top-[52%] left-[78%] w-1 h-1 bg-primary-orange rounded-full animate-ping opacity-50" style={{ animationDelay: 4.5 }}></div>
                <div className="absolute top-[62%] left-[48%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-45" style={{ animationDelay: 2.2 }}></div>
                <div className="absolute top-[72%] left-[8%] w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-65" style={{ animationDelay: 1.4 }}></div>
                <div className="absolute top-[82%] left-[92%] w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: 3.7 }}></div>
            </div>


            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <svg viewBox="0 0 800 600" className="w-full h-full">

                    <path d="M0,400 Q200,350 400,300 T800,200" stroke="#10B981" strokeWidth="3" fill="none" className="animate-draw-line">
                        <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite"></animate>
                    </path>

                    <path d="M0,200 Q200,250 400,300 T800,400" stroke="#EF4444" strokeWidth="3" fill="none" className="animate-draw-line" style={{ animationDelay: 2 }}>
                        <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite" begin="2s"></animate>
                    </path>

                    <path d="M0,300 Q200,280 400,320 T800,300" stroke="#F59E0B" strokeWidth="2" fill="none" className="animate-draw-line" style={{ animationDelay: 4 }}>
                        <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="8s" repeatCount="indefinite" begin="4s"></animate>
                    </path>
                </svg>
            </div>


            <div className="absolute top-20 left-10 transform rotate-12 opacity-20">
                <div className="bg-gray-800 rounded-lg p-4 border border-primary-orange/30 animate-float">
                    <div className="text-green-400 text-sm font-mono">EURUSD ↗</div>
                    <div className="text-white text-lg font-bold">1.0847</div>
                    <div className="text-green-400 text-xs">+0.0023</div>
                </div>
            </div>

            <div className="absolute top-40 right-20 transform -rotate-6 opacity-20">
                <div className="bg-gray-800 rounded-lg p-4 border border-red-500/30 animate-float" style={{ animationDelay: 2 }}>
                    <div className="text-red-400 text-sm font-mono">GBPUSD ↘</div>
                    <div className="text-white text-lg font-bold">1.2634</div>
                    <div className="text-red-400 text-xs">-0.0019</div>
                </div>
            </div>

            <div className="absolute bottom-40 left-1/4 transform rotate-3 opacity-20">
                <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/30 animate-float" style={{ animationDelay: 4 }}>
                    <div className="text-blue-400 text-sm font-mono">BTC/USD ↗</div>
                    <div className="text-white text-lg font-bold">43,250</div>
                    <div className="text-green-400 text-xs">+1,847</div>
                </div>
            </div>


            <div className="absolute bottom-20 right-10 opacity-20">
                <svg width="150" height="100" viewBox="0 0 150 100">

                    <g className="animate-pulse">
                        <rect x="10" y="30" width="8" height="40" fill="#10B981" className="animate-scale-y"></rect>
                        <line x1="14" y1="20" x2="14" y2="80" stroke="#10B981" strokeWidth="2"></line>
                    </g>
                    <g className="animate-pulse" style={{ animationDelay: 0.5 }}>
                        <rect x="30" y="40" width="8" height="30" fill="#EF4444" className="animate-scale-y"></rect>
                        <line x1="34" y1="25" x2="34" y2="75" stroke="#EF4444" strokeWidth="2"></line>
                    </g>
                    <g className="animate-pulse" style={{ animationDelay: 1 }}>
                        <rect x="50" y="20" width="8" height="50" fill="#10B981" className="animate-scale-y"></rect>
                        <line x1="54" y1="15" x2="54" y2="85" stroke="#10B981" strokeWidth="2"></line>
                    </g>
                    <g className="animate-pulse" style={{ animationDelay: 1.5 }}>
                        <rect x="70" y="35" width="8" height="35" fill="#10B981" className="animate-scale-y"></rect>
                        <line x1="74" y1="20" x2="74" y2="80" stroke="#10B981" strokeWidth="2"></line>
                    </g>
                    <g className="animate-pulse" style={{ animationDelay: 2 }}>
                        <rect x="90" y="45" width="8" height="25" fill="#EF4444" className="animate-scale-y"></rect>
                        <line x1="94" y1="30" x2="94" y2="85" stroke="#EF4444" strokeWidth="2"></line>
                    </g>
                </svg>
            </div>


            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-orange opacity-5 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-green-500 opacity-5 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-blue-600 opacity-5 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>


            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90"></div>
        </div>
    )
}

export default BannerBackground
