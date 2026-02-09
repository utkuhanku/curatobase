import { prisma } from "@/lib/db";
import { RewardStatus } from "@/lib/types";
import { CheckCircle2, Clock, ExternalLink, Layers, ShieldCheck } from "lucide-react";

export async function RewardList() {
    const rewards = await prisma.rewardEvent.findMany({
        orderBy: { createdAt: 'desc' },
        include: { builder: true },
        take: 50 // Fetch more to aggregate
    });

    if (rewards.length === 0) {
        return (
            <div className="text-center py-20 bg-white/5 rounded-lg border border-dashed border-gray-800">
                <ShieldCheck className="mx-auto text-gray-600 mb-3" size={32} />
                <div className="text-gray-500 font-bold mb-1">No Verified Signals Yet</div>
                <p className="text-gray-600 text-xs font-mono max-w-sm mx-auto">
                    The agent is monitoring for on-chain proof of buildathon rewards or grants distribution.
                </p>
            </div>
        );
    }

    // AGGREGATION LOGIC
    type AggregatedGroup = {
        payer: string;
        token: string;
        totalAmount: number;
        eventCount: number;
        lastEvent: Date;
        txs: string[];
        builderHandle?: string;
        status: string; // Group status
    };

    const groups: Record<string, AggregatedGroup> = {};

    for (const r of rewards) {
        const payer = (r.payerWallet && r.payerWallet !== 'UNKNOWN') ? r.payerWallet : 'Unknown Payer';
        const key = `${payer}-${r.token}`;

        if (!groups[key]) {
            groups[key] = {
                payer,
                token: r.token,
                totalAmount: 0,
                eventCount: 0,
                lastEvent: r.createdAt,
                txs: [],
                builderHandle: JSON.parse(r.builder?.handles || "{}").farcaster,
                status: r.status
            };
        }

        if (r.announcedAmount) groups[key].totalAmount += r.announcedAmount;
        groups[key].eventCount++;

        const rTxs = JSON.parse(r.matchedTxs || "[]");
        if (rTxs.length > 0) groups[key].txs.push(rTxs[0].hash);
        if (r.status === RewardStatus.VERIFIED_PAID) groups[key].status = RewardStatus.VERIFIED_PAID;
    }

    const sortedGroups = Object.values(groups).sort((a, b) => b.lastEvent.getTime() - a.lastEvent.getTime());

    return (
        <div className="space-y-4">
            {sortedGroups.map((group, idx) => {
                const isVerified = group.status === RewardStatus.VERIFIED_PAID;
                const shortPayer = group.payer.startsWith("0x") ? `${group.payer.slice(0, 6)}...${group.payer.slice(-4)}` : group.payer;
                const displayName = group.builderHandle ? `@${group.builderHandle}` : shortPayer;

                return (
                    <div key={idx} className="glass-panel p-5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:bg-white/5 transition-all">

                        {/* Left: Total & Entity */}
                        <div className="flex items-center gap-4 min-w-[240px]">
                            <div className={`p-3 rounded-full ${isVerified ? 'bg-green-500/10 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                                {group.eventCount > 1 ? <Layers size={24} /> : (isVerified ? <CheckCircle2 size={24} /> : <Clock size={24} />)}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-white tracking-tight">
                                    {group.totalAmount.toLocaleString()} {group.token}
                                </div>
                                <div className="text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
                                    From <span className="text-white">{displayName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Curator Context */}
                        <div className="flex-1 border-l border-white/5 pl-6 md:pl-6 border-l-0 md:border-l">
                            <div className="text-sm text-gray-300 font-medium mb-1">
                                {group.eventCount > 1
                                    ? `Multiple events detected, signaling sustained ecosystem support.`
                                    : "One-off distribution detected."
                                }
                            </div>
                            <div className="text-xs text-gray-500">
                                {isVerified ? "On-chain verification confirmed." : "Pending chain verification."}
                            </div>
                        </div>

                        {/* Right: Status & Action */}
                        <div className="flex flex-col items-end gap-2 min-w-[140px]">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${isVerified ? 'bg-green-900/20 text-green-400 border-green-500/20' :
                                    'bg-yellow-900/20 text-yellow-400 border-yellow-500/20'
                                }`}>
                                {isVerified ? "VERIFIED PROOF" : "PENDING PROOF"}
                            </span>

                            {group.txs.length > 0 && (
                                <div className="flex gap-2">
                                    {group.txs.slice(0, 1).map(tx => (
                                        <a
                                            key={tx}
                                            href={`https://basescan.org/tx/${tx}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs text-electric-blue hover:text-white transition-colors"
                                        >
                                            Explorer <ExternalLink size={10} />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                );
            })}
        </div>
    );
}
