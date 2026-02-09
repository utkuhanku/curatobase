import { RewardList } from "@/components/RewardList";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function RewardsPage() {
    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-electric-blue">Curato</span>Base
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Autonomous Builder Discovery</p>
                </div>
                <nav className="flex gap-4 text-sm font-bold font-mono">
                    <Link href="/" className="text-gray-500 hover:text-white transition-colors pb-1">Sup Builders</Link>
                    <Link href="/rewards" className="text-white border-b-2 border-electric-blue pb-1">Verified Rewards</Link>
                </nav>
            </header>

            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg flex items-start gap-3">
                <ShieldCheck className="text-green-500 shrink-0" />
                <p className="text-sm text-gray-300">
                    Rewards are verified on-chain by the agent. Payer identity may appear as 'Unknown' until identity resolution completes.
                </p>
            </div>

            <RewardList />
        </div>
    );
}
