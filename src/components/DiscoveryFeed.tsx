import { prisma } from "@/lib/db";
import { CurationStatus } from "@/lib/types";
import { ExternalLink, Github, Globe, Hexagon, Database, AlertCircle, TrendingUp, UserCheck, HelpCircle, UserPlus, Zap } from "lucide-react";

export async function DiscoveryFeed() {
    const curatedApps = await prisma.app.findMany({
        where: { status: CurationStatus.CURATED },
        include: { builder: true },
        orderBy: { lastEventAt: 'desc' },
        take: 10
    });

    const watchlistApps = await prisma.app.findMany({
        where: { status: CurationStatus.WATCHLIST },
        include: { builder: true },
        orderBy: { lastEventAt: 'desc' },
        take: 20
    });

    const ConfidenceBadge = ({ level }: { level: string }) => {
        let color = "text-gray-500 bg-gray-800 border-gray-700";
        let icon = <HelpCircle size={10} />;
        let text = "Unknown";

        if (level === "PROVEN_BUILDER") {
            color = "text-green-400 bg-green-900/30 border-green-500/30";
            icon = <UserCheck size={10} />;
            text = "PVN. PROVEN BUILDER";
        } else if (level === "ACTIVE_BUILDER") {
            color = "text-blue-400 bg-blue-900/30 border-blue-500/30";
            icon = <Zap size={10} />;
            text = "ACT. ACTIVE BUILDER";
        } else if (level === "NEW_BUILDER") {
            color = "text-yellow-400 bg-yellow-900/30 border-yellow-500/30";
            icon = <UserPlus size={10} />;
            text = "NEW. FIRST SIGNAL";
        }

        return (
            <span className={`flex items-center gap-1.5 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest rounded border ${color}`}>
                {icon} {text}
            </span>
        );
    };

    const AppCard = ({ app, isCurated }: { app: any, isCurated: boolean }) => {
        const urls = JSON.parse(app.urls);

        return (
            <div className={`glass-panel p-6 border-l-4 ${isCurated ? 'border-l-electric-blue' : 'border-l-gray-600'} transition-all hover:bg-white/5`}>
                {/* Header: Name + Builder Signal */}
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-1">
                            {app.name}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm font-normal font-mono">by @{JSON.parse(app.builder.handles).farcaster || app.builderId.slice(0, 8)}</span>
                            <ConfidenceBadge level={app.builder.confidenceLevel} />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-5 text-sm leading-relaxed">{app.description}</p>

                {/* Verdict (The "Why") - Only show if insight exists */}
                {app.agentInsight && (
                    <div className="mb-5 pl-4 border-l-2 border-electric-blue/30">
                        <div className="text-[9px] uppercase text-electric-blue/70 font-bold mb-1 tracking-widest">
                            CURATOR VERDICT
                        </div>
                        <p className="text-sm text-gray-200 font-medium italic leading-relaxed">
                            "{app.agentInsight}"
                        </p>
                    </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                    {urls.website && (
                        <a href={urls.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors">
                            <Globe size={14} /> Website
                        </a>
                    )}
                    {urls.baseApp && (
                        <a href={urls.baseApp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-electric-blue hover:text-white transition-colors">
                            <Hexagon size={14} /> Base App
                        </a>
                    )}
                    {urls.repo && (
                        <a href={urls.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
                            <Github size={14} /> Code
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-12">
            {/* Curated Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Hexagon className="text-electric-blue" size={24} />
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Curated Drops</h2>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            High-proof shipping events detected by the agent.
                        </p>
                    </div>
                </div>

                {curatedApps.length > 0 ? (
                    <div className="grid gap-6">
                        {curatedApps.map(app => <AppCard key={app.id} app={app} isCurated={true} />)}
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-800 rounded-lg p-8 text-center bg-white/5">
                        <AlertCircle className="mx-auto text-gray-600 mb-2" size={32} />
                        <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
                            No curated drops yet. The agent is strictly monitoring for high-proof shipping signals and will promote builders who demonstrate significant effort.
                        </p>
                    </div>
                )}
            </section>

            {/* Watchlist Section */}
            {watchlistApps.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6 pt-8 border-t border-gray-800">
                        <Database className="text-gray-500" size={20} />
                        <div>
                            <h2 className="text-lg font-bold text-gray-400 tracking-tight">Emerging Signals</h2>
                            <p className="text-xs text-gray-600 font-mono mt-1">
                                New activity detected. Monitoring for further proof.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-6 opacity-75 hover:opacity-100 transition-opacity">
                        {watchlistApps.map(app => <AppCard key={app.id} app={app} isCurated={false} />)}
                    </div>
                </section>
            )}
        </div>
    );
}
