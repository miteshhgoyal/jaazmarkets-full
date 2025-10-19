import { Clock, DollarSign, TrendingUp, CreditCard, Eye, Repeat } from 'lucide-react';

const iconMap = {
    Clock,
    DollarSign,
    TrendingUp,
    CreditCard,
    Eye,
    Repeat,
};

export default function AdvantageCard({ title, desc, points, icon, highlightPointIndex }) {
    const IconComponent = iconMap[icon] || Clock;

    return (
        <div className="bg-white rounded-xl p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{title}</h3>
            <p className="text-gray-600 text-center mb-4">{desc}</p>
            <ul className="text-sm text-gray-500 space-y-2">
                {points.map((point, i) => (
                    <li
                        key={i}
                        className={`flex items-center ${highlightPointIndex === i ? 'text-primary-orange' : 'text-green-500'
                            }`}
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {point}
                    </li>
                ))}
            </ul>
        </div>
    );
}
