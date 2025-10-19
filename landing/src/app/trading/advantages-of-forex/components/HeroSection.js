import { DollarSign } from 'lucide-react';
import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-blue-900 via-gray-900 to-blue-900 text-white py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-primary-orange/20 rounded-full">
                            <DollarSign className="w-16 h-16 text-primary-orange" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Why Trade Forex?</h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                        Discover the unique advantages that make forex the world's largest and most liquid financial market,
                        with over $7.5 trillion traded daily.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#advantages" className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-4 rounded-lg font-semibold transition">
                            Explore Advantages
                        </a>
                        <a href="/trading/forex" className="border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold transition">
                            Start Trading Forex
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
