import { AlertTriangle, AlertCircle, ShieldAlert, Book } from 'lucide-react';

const iconMap = {
    AlertTriangle,
    AlertCircle,
    ShieldAlert,
    Book,
};

export default function RiskDisclaimerCard({ title, desc, icon, iconBg, textColor }) {
    const IconComponent = iconMap[icon];
    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
                <div className={`${iconBg} rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1`}>
                    <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{title}</h3>
                    <p className="text-sm text-gray-300">{desc}</p>
                </div>
            </div>
        </div>
    );
}
