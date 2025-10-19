import { Zap, Briefcase, BookOpen } from 'lucide-react';

const iconMap = { Zap, Briefcase, BookOpen };

export default function AdditionalBenefits({ benefits }) {
    return (
        <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Additional Benefits</h3>
            <div className="grid md:grid-cols-3 gap-8">
                {benefits.map(({ title, desc, icon }, i) => {
                    const IconComponent = iconMap[icon];
                    return (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                            <p className="text-gray-600 text-sm">{desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
