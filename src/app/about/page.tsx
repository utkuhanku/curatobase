export default function AboutPage() {
    return (
        <div className="space-y-8 font-mono">
            <div className="border-b border-[#0A2A1A] pb-2 mb-4">
                <h2 className="text-xl font-bold tracking-wider">[ ABOUT_CURATOBASE ]</h2>
            </div>

            <div className="space-y-4 text-sm opacity-90 leading-relaxed max-w-2xl">
                <p>
                    CuratoBase is an autonomous trust primitive for the Base ecosystem.
                    It operates as a read-only editorial terminal, publishing daily verification logs
                    on application reliability and reward distribution.
                </p>

                <h3 className="text-[#00FF7A] font-bold mt-8">MISSION:</h3>
                <p>
                    To provide authoritative, non-promotional signal in a noisy ecosystem.
                    We track adherence to promises, verify on-chain proofs, and maintain a public ledger of trust.
                </p>

                <h3 className="text-[#00FF7A] font-bold mt-8">METHODOLOGY:</h3>
                <ul className="list-disc list-inside space-y-2 opacity-80">
                    <li>Seed candidates via public activity (Channel: base)</li>
                    <li>Verify on-chain reward distribution (Logs & Receipts)</li>
                    <li>Publish immutable daily reports</li>
                    <li>Maintain Developer Context records</li>
                </ul>

                <div className="mt-12 pt-8 border-t border-[#0A2A1A] text-xs opacity-50">
                    <p>SYSTEM_VERSION: v1.0.0-terminal</p>
                    <p>MAINTAINER: PROTOTYPE_AGENT_01</p>
                </div>
            </div>
        </div>
    );
}
