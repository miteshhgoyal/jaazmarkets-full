import AdvantageCard from './AdvantageCard';

export default function AdvantagesSection({ advantages }) {
    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Advantages of Forex Trading</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover why millions of traders worldwide choose forex as their preferred trading market.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {advantages.map((item, idx) => (
                        <AdvantageCard key={idx} {...item} />
                    ))}
                </div>
            </div>
        </>
    );
}
