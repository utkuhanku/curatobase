import { getHistory } from "@/lib/agent/history";
import { ExternalLink, Hexagon } from "lucide-react";

export async function TerminalFeed() {
    // Instead of static DB apps, we show the LIVE AGENT HISTORY which is dynamic and rich.
    const history = getHistory();

    return (
        <div className="font-mono text-sm bg-black/20 rounded-lg p-2 border border-white/5">
            {/* Table Header */}
            <div className="flex items-center py-3 px-3 gap-4 text-[10px] text-gray-500 border-b border-white/5 uppercase tracking-[0.2em] mb-2 bg-white/[0.02]">
                <div className="w-20">Timestamp</div>
                <div className="w-24 pl-1">Detection</div>
                <div className="flex-1">Intercepted Signal</div>
                <div className="w-32 hidden md:block">Builder ID</div>
                <div className="w-48 hidden lg:block text-right">Analysis</div>
                <div className="w-20 text-right">Uplink</div>
            </div>

            {/* List */}
            <div className="space-y-1">
                {history.map((run, i) => <HistoryRow key={run.runId} run={run} />)}

                {history.length === 0 && (
                    <div className="py-16 text-center text-gray-700 flex flex-col items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span className="tracking-widest text-xs">NO SIGNALS INTERCEPTED</span>
                    </div>
                )}
            </div>

            <div className="mt-4 border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-gray-600 px-2">
                <div>SYNC_RATE: 100ms</div>
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Accessing Global Signal Stream...
                </div>
            </div>
        </div>
    );
}

function HistoryRow({ run }: { run: any }) {
    const isSuccess = run.signalsFound > 0;

    // Parse the 'curatedGem' string if it exists (e.g. "@handle: message")
    const parts = run.curatedGem ? run.curatedGem.split(':') : ['Scanning...', ''];
    const handle = parts[0];
    const message = parts.slice(1).join(':').replace(/"/g, '').trim();

    return (
        <div className={`group relative border border-transparent hover:border-white/5 hover:bg-white/[0.03] rounded-md transition-all duration-300 ${isSuccess ? 'bg-blue-500/[0.02]' : ''}`}>
            <div className="flex items-center py-3 px-3 gap-4 text-xs font-mono relative z-10">
                {/* Time */}
                <div className="w-20 text-gray-600 text-[10px]">
                    {new Date(run.finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                {/* Status */}
                <div className="w-24 shrink-0 flex items-center">
                    {isSuccess ? (
                        <span className="text-electric-blue font-bold text-[10px] tracking-widest px-2 py-0.5 rounded bg-electric-blue/10 border border-electric-blue/20 shadow-[0_0_10px_-5px_#3b82f6]">
                            VERIFIED
                        </span>
                    ) : (
                        <span className="text-gray-700 text-[10px] tracking-widest px-2 py-0.5 border border-white/5 rounded">
                            SCANNING
                        </span>
                    )}
                </div>

                {/* Signal Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`font-bold truncate tracking-tight ${isSuccess ? 'text-white' : 'text-gray-500'}`}>
                            {handle}
                        </span>
                    </div>
                    <div className="text-gray-500 truncate mt-0.5 max-w-md text-[10px]">
                        {message || 'Routine ecosystem scan complete. No high-confidence signals.'}
                    </div>
                </div>

                {/* Builder Stats */}
                <div className="w-32 hidden md:block text-gray-500 truncate text-[10px]">
                    {run.authorStats || '-'}
                </div>

                {/* Sentiment */}
                <div className="w-48 hidden lg:block text-right">
                    {run.sentiment ? (
                        <span className="text-green-400/80 text-[10px] tracking-wide">
                            {run.sentiment}
                        </span>
                    ) : (
                        <span className="text-gray-800 text-[10px] tracking-widest">-</span>
                    )}
                </div>

                {/* Uplink */}
                <div className="w-20 flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    {run.signalUrl && (
                        <a href={run.signalUrl} target="_blank" className="text-electric-blue hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
