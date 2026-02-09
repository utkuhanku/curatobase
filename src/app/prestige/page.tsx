export default function PrestigePage() {
    return (
        <div className="space-y-8 font-mono">
            <div className="border-b border-[#0A2A1A] pb-2 mb-4">
                <h2 className="text-xl font-bold tracking-wider text-[#FFD700]">[ PRESTIGE_ENDORSEMENTS ]</h2>
            </div>

            <p className="opacity-70 text-sm">
                CuratoBase Prestige tracks applications that have consistently delivered rewards and maintained high trust scores over extended periods.
            </p>

            {/* Placeholder List */}
            <div className="space-y-4">
                <div className="border border-[#FFD700] p-4 bg-[#111] bg-opacity-50">
                    <h3 className="text-lg font-bold text-[#FFD700]">🏆 HALL_OF_FAME_2025</h3>
                    <p className="text-xs opacity-50 mb-4">Apps with &gt;99% reliability score.</p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                            <span>• MOXIE</span>
                            <span className="opacity-50">VERIFIED</span>
                        </li>
                        <li className="flex justify-between">
                            <span>• AERODROME</span>
                            <span className="opacity-50">VERIFIED</span>
                        </li>
                        <li className="flex justify-between">
                            <span>• ZORA</span>
                            <span className="opacity-50">VERIFIED</span>
                        </li>
                    </ul>
                </div>

                <p className="text-xs opacity-30 text-center mt-8">
                    Data aggregation in progress... check back for live updates.
                </p>
            </div>
        </div>
    );
}
