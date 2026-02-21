'use client';

import { useState, useMemo } from 'react';

type Lens = 'SAFE' | 'OBSERVE' | 'AVOID';

interface Props {
    reportText: string;
    date: string;
    meta: any;
}

export default function ReportViewer({ reportText, date, meta }: Props) {
    const [activeLens, setActiveLens] = useState<Lens>('SAFE');

    const sections = useMemo(() => parseReport(reportText), [reportText]);

    const activeSection = useMemo(() => {
        if (activeLens === 'SAFE') return sections.delivered;
        if (activeLens === 'OBSERVE') return sections.watchlist;
        return sections.redFlags;
    }, [activeLens, sections]);

    const getLensColor = (lens: Lens) => {
        if (lens === 'SAFE') return 'text-[#00FF7A] border-[#00FF7A]';
        if (lens === 'OBSERVE') return 'text-[#FFD166] border-[#FFD166]';
        return 'text-[#FF4D4D] border-[#FF4D4D]';
    };

    const getLensBg = (lens: Lens) => {
        if (lens === 'SAFE') return 'bg-[#002200]';
        if (lens === 'OBSERVE') return 'bg-[#221a00]';
        return 'bg-[#220000]';
    };

    return (
        <div className="space-y-6">
            {/* LENS SELECTOR */}
            <div className="flex gap-2 text-xs font-bold font-mono border-b border-[#0A2A1A] pb-4 overflow-x-auto">
                <button
                    onClick={() => setActiveLens('SAFE')}
                    className={`px-3 py-1 border transition-all ${activeLens === 'SAFE' ? 'bg-[#00FF7A] text-black border-[#00FF7A]' : 'text-zinc-500 border-transparent hover:text-[#00FF7A]'}`}
                >
                    [1] SAFE_TO_USE
                </button>
                <button
                    onClick={() => setActiveLens('OBSERVE')}
                    className={`px-3 py-1 border transition-all ${activeLens === 'OBSERVE' ? 'bg-[#FFD166] text-black border-[#FFD166]' : 'text-zinc-500 border-transparent hover:text-[#FFD166]'}`}
                >
                    [2] OBSERVE
                </button>
                <button
                    onClick={() => setActiveLens('AVOID')}
                    className={`px-3 py-1 border transition-all ${activeLens === 'AVOID' ? 'bg-[#FF4D4D] text-black border-[#FF4D4D]' : 'text-zinc-500 border-transparent hover:text-[#FF4D4D]'}`}
                >
                    [3] AVOID (RISKY)
                </button>
            </div>

            {/* CURATOR NOTE (Always Visible) */}
            {meta.curatorNote && (
                <div className={`border-l-2 pl-4 py-2 text-sm italic opacity-80 ${getLensColor(activeLens).split(' ')[0]}`}>
                    <span className="font-bold text-xs opacity-50 block mb-1">CURATOR NOTE:</span>
                    {meta.curatorNote}
                </div>
            )}

            {/* ACTIVE LIST */}
            <div className={`min-h-[200px] rounded p-4 border border-opacity-20 ${getLensColor(activeLens)} ${getLensBg(activeLens)} bg-opacity-10`}>
                <h3 className={`font-bold mb-4 tracking-wider ${getLensColor(activeLens).split(' ')[0]}`}>
                    {activeLens === 'SAFE' && '✅ SAFE TODAY ON BASE'}
                    {activeLens === 'OBSERVE' && '⚠️ WORTH WATCHING (NO ACTION YET)'}
                    {activeLens === 'AVOID' && '❌ DO NOT USE (UNVERIFIED / RISKY)'}
                </h3>

                {/* Render List Items */}
                <div className="space-y-6 whitespace-pre-wrap text-sm leading-relaxed opacity-90 font-mono">
                    {activeSection.length > 0 ? (
                        activeSection.map((block, i) => (
                            <div key={i} className="border-b border-white/5 pb-4 last:border-0">
                                <HighlightLog text={block} />
                            </div>
                        ))
                    ) : (
                        <div className="opacity-50 italic">
                            {activeLens === 'SAFE' ? 'No verified apps today.' : ''}
                            {activeLens === 'OBSERVE' ? 'No apps in watchlist today.' : ''}
                            {activeLens === 'AVOID' ? 'No red flags detected today.' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-xs opacity-30 font-mono pt-4 text-center">
                Use lenses to filter signal. Default: SAFE_TO_USE.
            </div>
        </div>
    );
}

function parseReport(text: string) {
    // Determine bounds with safety
    const deliverIdx = text.indexOf('✅ Reward Delivered');
    const watchIdx = text.indexOf('⚠️ Watchlist');
    const redIdx = text.indexOf('❌ Red Flags');
    const methodIdx = text.indexOf('Method: deterministic');

    const cleanBlock = (str: string) => {
        // Remove header line (e.g. "✅ Reward Delivered (0)")
        const lines = str.trim().split('\n');
        if (lines[0] && lines[0].includes('(') && lines[0].includes(')')) {
            lines.shift();
        }
        // Remove empty lines or "(None today)"
        const content = lines.join('\n').trim();
        if (content.includes('(None today)')) return [];

        // Split by "🔹" which denotes start of an app block
        // Re-add the emoji for display
        return content.split('🔹').filter(s => s.trim().length > 0).map(s => '🔹' + s);
    };

    // Defaults if not found
    const end = text.length;

    // Safety Slices
    const deliveredStr = (deliverIdx !== -1)
        ? text.substring(deliverIdx, watchIdx !== -1 ? watchIdx : (redIdx !== -1 ? redIdx : end))
        : "";

    const watchlistStr = (watchIdx !== -1)
        ? text.substring(watchIdx, redIdx !== -1 ? redIdx : (methodIdx !== -1 ? methodIdx : end))
        : "";

    const redFlagStr = (redIdx !== -1)
        ? text.substring(redIdx, methodIdx !== -1 ? methodIdx : end)
        : "";

    return {
        delivered: cleanBlock(deliveredStr),
        watchlist: cleanBlock(watchlistStr),
        redFlags: cleanBlock(redFlagStr)
    };
}

// Simple highlighter for Terminal Log (Reused)
function HighlightLog({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <>
            {(() => {
                let inInsightBlock = false;
                return lines.map((line, i) => {
                    let className = "";

                    if (line.includes('STATUS: DELIVERED')) className = "text-[#00FF7A] font-bold";
                    else if (line.includes('STATUS: PROMISED_UNDER_OBSERVATION')) className = "text-[#FFD166] font-bold";
                    else if (line.includes('STATUS: PROMISED_NO_PROOF')) className = "text-[#FF4D4D] font-bold";
                    else if (line.includes('USER_SIGNAL: SAFE_TO_USE')) className = "text-[#00FF7A]";
                    else if (line.includes('USER_SIGNAL: AVOID')) className = "text-[#FF4D4D]";
                    else if (line.includes('DEV CONTEXT:')) {
                        inInsightBlock = false;
                        className = "text-xs opacity-50 mt-2 font-bold uppercase tracking-wider";
                    }
                    else if (line.includes('AGENT INSIGHT:')) {
                        inInsightBlock = true;
                        className = "text-blue-400 font-bold mt-3 uppercase tracking-wider text-xs";
                    }
                    else if (line.includes('🔹')) {
                        inInsightBlock = false;
                        className = "text-white font-bold text-lg block mb-2";
                    }

                    // Style everything inside the insight block
                    if (inInsightBlock && !line.includes('AGENT INSIGHT:')) {
                        // Skip empty lines to prevent floating borders
                        if (line.trim().length > 0) {
                            className = "text-blue-400/90 italic pl-4 border-l-2 border-blue-500/40 my-1 py-0.5";
                        }
                    }

                    return <div key={i} className={className}>{line || '\u00A0'}</div>
                });
            })()}
        </>
    );
}
