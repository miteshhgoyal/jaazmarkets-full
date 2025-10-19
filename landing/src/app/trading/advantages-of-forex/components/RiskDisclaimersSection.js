import RiskDisclaimerCard from './RiskDisclaimerCard';

export default function RiskDisclaimersSection({ disclaimers }) {
    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Important Risk Disclaimers</h2>
                        <p className="text-gray-300">Please read and understand these risk factors before trading forex</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {disclaimers.map((item, i) => (
                            <RiskDisclaimerCard key={i} {...item} />
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            <strong>Regulatory Notice:</strong> CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.
                            Between 74-89% of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work
                            and whether you can afford to take the high risk of losing your money. *Commission-free trading applies to Standard accounts only.
                            Raw accounts may have commission charges. Spreads are variable and subject to market conditions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
