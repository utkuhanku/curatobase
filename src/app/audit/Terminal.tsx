"use client";

import React, { useState, useMemo } from 'react';
import { CurationStatus } from '@/lib/types';

// Types for the Terminal
export type TerminalApp = {
    id: string;
    appKey: string;
    builderHandle: string;
    status: CurationStatus;
    seenCount: number;
    replies: number;
    uniqueRepliers: number;
    hasDemo: boolean;
    hasRepo: boolean;
    isBaseApp: boolean; // NEW
    hasReward: boolean;
    rewardStatus: string;
    onchainVerified: boolean;
    promotionReady: boolean;
    promoReasons: string[];
    promoMissing: string[];
    score: number;
    updatedAt: string;
    description: string;
    urls: { sourceCast?: string, baseApp?: string, demo?: string };
    source: string;
    insight: string;
    confidence: string;
};

export type TerminalReport = {
    id: string;
    date: string;
    title: string;
    summary: string;
    fullText: string;
    itemCount: number;
    published: boolean;
};

type ViewMode = 'RADAR' | 'PROMOTION_QUEUE' | 'PRESTIGE_PICKS' | 'SILENCE_POOL' | 'AUDIT_LOG' | 'TRUST_REPORTS';

interface TerminalProps {
    data: TerminalApp[];
    reports: TerminalReport[];
    lastCycle: string;
}

export default function Terminal({ data, reports, lastCycle }: TerminalProps) {
    const [view, setView] = useState<ViewMode>('RADAR');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Filter Logic
    const filteredData = useMemo(() => {
        let list = [...data];
        switch (view) {
            case 'RADAR':
                // All items, sorted by score
                list.sort((a, b) => b.score - a.score);
                break;
            case 'PROMOTION_QUEUE':
                // Not Ready, Not Silence, Not Ignored
                list = list.filter(item => !item.promotionReady && item.status !== CurationStatus.SILENCE && item.status !== CurationStatus.IGNORED);
                list.sort((a, b) => b.score - a.score);
                break;
            case 'PRESTIGE_PICKS':
                // Only Prestige (Curated)
                list = list.filter(item => item.status === CurationStatus.CURATED);
                break;
            case 'SILENCE_POOL':
                // Only Silence
                list = list.filter(item => item.status === CurationStatus.SILENCE);
                break;
            case 'AUDIT_LOG':
                // Time sort
                list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                break;
        }
        return list;
    }, [data, view]);

    const selectedApp = useMemo(() => {
        if (view === 'TRUST_REPORTS') return null; // No app details for report currently
        return data.find(d => d.id === selectedId) || null;
    }, [data, selectedId, view]);

    // Select Report
    const selectedReport = useMemo(() => {
        if (view !== 'TRUST_REPORTS') return null;
        return reports.find(r => r.id === selectedId) || null;
    }, [reports, selectedId, view]);

    // Helpers
    const getStatusBadge = (status: CurationStatus) => {
        switch (status) {
            case CurationStatus.CURATED: return <span className="text-[#FFD700] border border-[#FFD700]/30 px-1 py-0.5 text-[9px] bg-[#FFD700]/5">[PRESTIGE]</span>;
            case CurationStatus.TOP_PICK: return <span className="text-[#4DFFE6] border border-[#4DFFE6]/30 px-1 py-0.5 text-[9px] bg-[#4DFFE6]/5">[TOP_PICK]</span>;
            case CurationStatus.WATCHLIST: return <span className="text-[#2B5C3F] border border-[#2B5C3F]/30 px-1 py-0.5 text-[9px]">[WATCH]</span>;
            case CurationStatus.SILENCE: return <span className="text-[#2B5C3F] border border-[#2B5C3F]/30 px-1 py-0.5 text-[9px]">[SILENCE]</span>;
            default: return <span className="text-red-900 border border-red-900 px-1 py-0.5 text-[9px]">[{status}]</span>;
        }
    };

    return (
        <div className="relative flex flex-col h-screen w-full bg-[#050607] text-[#00FF7A] font-mono text-[13px] tracking-wide leading-relaxed overflow-hidden">

            {/* CRT VISUAL OVERLAY - FORCE PASS THROUGH */}
            <div className="fixed inset-0 z-50 overflow-hidden h-full w-full pointer-events-none" style={{ pointerEvents: 'none' }}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03] bg-white animate-pulse pointer-events-none" />
            </div>

            {/* MAIN FRAME - RELATIVE Z-10 TO SIT UNDER OVERLAY BUT ABOVE BG */}
            <div className="flex flex-col flex-1 m-4 border border-[#0A2A1A] rounded-[10px] shadow-[0_0_0_1px_rgba(0,255,122,0.08),inset_0_0_40px_rgba(0,255,122,0.05)] bg-[#050607] overflow-hidden relative z-10">

                {/* TOP BAR */}
                <header className="h-12 border-b border-[#0A2A1A] flex items-center justify-between px-6 bg-[#050607] shrink-0 select-none">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-[#00FF7A] tracking-wider crt-text-glow">CURATOBASE v6.1</span>
                        <span className="text-[#2B5C3F]">::</span>
                        <span className="text-[#7CFFB2] opacity-80">EDITORIAL CURATION TERMINAL</span>
                    </div>
                    <div className="flex items-center gap-6 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#00FF7A] rounded-full shadow-[0_0_8px_#00FF7A] animate-pulse"></span>
                            <span className="text-[#00FF7A]">LIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#00FF7A] rounded-full shadow-[0_0_8px_#00FF7A]"></span>
                            <span className="text-[#7CFFB2]">AUTONOMOUS</span>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT NAV - FORCE Z-20 TO BE CLICKABLE */}
                    <nav className="w-56 bg-[#050607] border-r border-[#0A2A1A] flex flex-col py-4 shrink-0 relative z-20">
                        {[
                            { id: 'RADAR', label: 'RADAR' },
                            { id: 'PROMOTION_QUEUE', label: 'PROMOTION_QUEUE' },
                            { id: 'PRESTIGE_PICKS', label: 'PRESTIGE_PICKS' },
                            { id: 'SILENCE_POOL', label: 'SILENCE_POOL' },
                            { id: 'AUDIT_LOG', label: 'AUDIT_LOG' },
                            { id: 'TRUST_REPORTS', label: 'TRUST_REPORTS' }
                        ].map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setView(item.id as ViewMode);
                                    setSelectedId(null);
                                }}
                                className={`px-6 py-2.5 text-left transition-all border-l-2 text-xs font-bold uppercase tracking-wide outline-none focus:outline-none ${view === item.id
                                    ? 'border-[#00FF7A] text-[#00FF7A] bg-[#00FF7A]/10 crt-text-glow'
                                    : 'border-transparent text-[#2B5C3F] hover:text-[#7CFFB2] hover:bg-[#00FF7A]/5'
                                    }`}
                                data-view={item.id}
                            >
                                <span className="opacity-50 mr-2">{view === item.id ? '>' : '#'}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* MAIN TABLE */}
                    <main className="flex-1 flex flex-col min-w-0 bg-[#050607] relative z-10">

                        {/* DEBUG HEADER (REQUIRED FOR DIAGNOSIS) */}
                        <div className="px-6 py-2 bg-[#0A2A1A]/30 border-b border-[#0A2A1A] text-[10px] font-mono text-[#7CFFB2] flex gap-6">
                            <span>VIEW: <span className="text-[#00FF7A] font-bold">{view}</span></span>
                            <span>TOTAL: <span className="text-white">{data.length}</span></span>
                            <span>SHOWING: <span className="text-white">{filteredData.length}</span></span>
                        </div>

                        <div className="grid grid-cols-12 px-6 py-2 border-b border-[#0A2A1A] bg-[#050607] text-[#2B5C3F] uppercase tracking-widest text-[10px] font-bold sticky top-0 select-none">
                            <div className="col-span-4 pl-1">Target Identity</div>
                            <div className="col-span-2">System Status</div>
                            <div className="col-span-2 text-center">Engagement</div>
                            <div className="col-span-2 text-center">Factual Proof</div>
                            <div className="col-span-2 text-right pr-1">Promotion</div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0A2A1A]">
                            {view === 'TRUST_REPORTS' ? (
                                // Render Reports List
                                reports.map(report => {
                                    const isSelected = selectedId === report.id;
                                    return (
                                        <button
                                            key={report.id}
                                            type="button"
                                            onClick={() => setSelectedId(report.id)}
                                            className={`w-full text-left grid grid-cols-12 px-6 py-2.5 border-b border-[#0A2A1A] cursor-pointer transition-colors hover:bg-[#00FF7A]/[0.03] group outline-none focus:outline-none ${isSelected ? 'bg-[#00FF7A]/[0.08]' : ''}`}
                                        >
                                            <div className="col-span-4 pr-4">
                                                <div className="text-[#00FF7A] font-bold text-xs">{report.title}</div>
                                                <div className="text-[#2B5C3F] text-[10px]">{report.date}</div>
                                            </div>
                                            <div className="col-span-2">
                                                {report.published ? <span className="text-[#00FF7A]">[PUBLISHED]</span> : <span className="text-[#2B5C3F]">[DRY_RUN]</span>}
                                            </div>
                                            <div className="col-span-2 text-center text-[#7CFFB2]">{report.itemCount} ITEMS</div>
                                            <div className="col-span-4 text-right text-[10px] text-[#2B5C3F] truncate">{report.summary}</div>
                                        </button>
                                    );
                                })
                            ) : (
                                // Render Apps
                                filteredData.map(app => {
                                    const isSelected = selectedId === app.id;

                                    return (
                                        <button
                                            key={app.id}
                                            type="button"
                                            onClick={() => setSelectedId(app.id)}
                                            className={`w-full text-left grid grid-cols-12 px-6 py-2.5 border-b border-[#0A2A1A] cursor-pointer transition-colors hover:bg-[#00FF7A]/[0.03] group outline-none focus:outline-none ${isSelected ? 'bg-[#00FF7A]/[0.08]' : ''}`}
                                        >
                                            {/* App */}
                                            <div className="col-span-4 pr-4 overflow-hidden">
                                                <div className="text-[#7CFFB2] font-bold truncate group-hover:text-[#00FF7A] text-xs">
                                                    {app.appKey}
                                                </div>
                                                <div className="text-[#2B5C3F] text-[10px] truncate">
                                                    @{app.builderHandle}
                                                    {app.source === 'TWITTER' ? <span className="ml-2 text-blue-400 opacity-80">[X]</span> : <span className="ml-2 opacity-50">[FC]</span>}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-2 flex items-center">
                                                {getStatusBadge(app.status)}
                                            </div>

                                            {/* Engagement */}
                                            <div className="col-span-2 text-center flex flex-col justify-center">
                                                <div className="text-[#7CFFB2]">R:{app.replies} U:{app.uniqueRepliers}</div>
                                                <div className="text-[#2B5C3F] text-[9px]">SEEN:{app.seenCount}</div>
                                            </div>

                                            {/* Proof */}
                                            <div className="col-span-2 text-center flex flex-col justify-center text-[9px] text-[#2B5C3F] font-bold">
                                                {app.isBaseApp ? <span className="text-[#0052FF] crt-text-glow">BASE:APP</span> : (app.hasDemo ? <span className="text-[#7CFFB2]">DEMO:YES</span> : <span>DEMO:--</span>)}
                                                {app.hasRepo ? <span className="text-[#7CFFB2]">REPO:YES</span> : <span>REPO:--</span>}
                                                {app.rewardStatus.includes("VERIFIED") ? <span className="text-[#FFD700] opacity-80">RWD:{app.rewardStatus.replace('VERIFIED_', '')}</span> : <span>RWD:--</span>}
                                            </div>

                                            {/* Promotion */}
                                            <div className="col-span-2 text-right flex items-center justify-end">
                                                {app.promotionReady
                                                    ? <span className="text-[#00FF7A] font-bold crt-text-glow">[OBSERVATION_ACTIVE]</span>
                                                    : <span className="text-[#2B5C3F] opacity-50">[OBSERVING]</span>
                                                }
                                            </div>
                                        </button>
                                    );
                                })
                            )}

                            {((view !== 'TRUST_REPORTS' && filteredData.length === 0) || (view === 'TRUST_REPORTS' && reports.length === 0)) && (
                                <div className="p-12 text-center text-[#2B5C3F] italic font-mono">
                                     // SYSTEM_RESPONSE: NO_ENTRIES_FOUND
                                </div>
                            )}
                        </div>
                    </main>

                    {/* DETAIL PANE */}
                    {selectedApp && (
                        <aside className="w-[420px] bg-[#050607] border-l border-[#0A2A1A] flex flex-col shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0A2A1A] relative z-20">
                            <div className="p-6 border-b border-[#0A2A1A] bg-[#050607]">
                                <h2 className="text-xl font-bold text-[#00FF7A] mb-1 tracking-wider crt-text-glow truncate">{selectedApp.appKey}</h2>
                                <div className="text-[#2B5C3F] mb-4 text-[10px] break-all">ID::{selectedApp.id}</div>

                                <div className="flex gap-4">
                                    <a href={selectedApp.urls.baseApp || '#'} target="_blank" className="text-[#7CFFB2] hover:text-[#00FF7A] hover:underline decoration-1 underline-offset-4 text-[11px] uppercase">[ OPEN_MINIAPP ]</a>
                                    {selectedApp.urls.sourceCast && (
                                        <a href={selectedApp.urls.sourceCast} target="_blank" className="text-[#2B5C3F] hover:text-[#7CFFB2] hover:underline decoration-1 underline-offset-4 text-[11px] uppercase">[ VIEW_SOURCE ]</a>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 space-y-8 select-text">
                                {/* IDENTITY */}
                                <section>
                                    <div className="text-[#00FF7A] font-bold mb-2">:: IDENTITY ──────────────────────</div>
                                    <div className="space-y-1 text-[#7CFFB2]">
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">BUILDER</span>
                                            <span>@{selectedApp.builderHandle}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">CONFIDENCE</span>
                                            <span>{selectedApp.confidence}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">SEEN_COUNT</span>
                                            <span>{selectedApp.seenCount} CYCLES</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">SOURCE</span>
                                            <span>{selectedApp.source === 'TWITTER' ? 'X (TWITTER)' : 'FARCASTER'}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* ENGAGEMENT */}
                                <section>
                                    <div className="text-[#00FF7A] font-bold mb-2">:: ENGAGEMENT ────────────────────</div>
                                    <div className="space-y-1 text-[#7CFFB2]">
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">REPLIES</span>
                                            <span>{selectedApp.replies}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-[#0A2A1A]/50 pb-1 border-dashed">
                                            <span className="opacity-60 text-[#2B5C3F]">UNIQUE_ACTORS</span>
                                            <span>{selectedApp.uniqueRepliers}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* PROOF */}
                                <section>
                                    <div className="text-[#00FF7A] font-bold mb-2">:: FACTUAL_PROOF ──────────────────</div>
                                    <div className="space-y-1 text-[#7CFFB2]">
                                        <div className="flex justify-between">
                                            <span className="opacity-60 text-[#2B5C3F]">BASE_NATIVE_APP</span>
                                            <span className={selectedApp.isBaseApp ? "text-[#0052FF] font-bold crt-text-glow" : "text-[#2B5C3F]"}>{selectedApp.isBaseApp ? "YES [DETECTED]" : "NO"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-60 text-[#2B5C3F]">DEMO_AVAILABLE</span>
                                            <span className={selectedApp.hasDemo ? "text-[#00FF7A]" : "text-[#2B5C3F]"}>{selectedApp.hasDemo ? "YES" : "NO"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-60 text-[#2B5C3F]">SOURCE_REPO</span>
                                            <span className={selectedApp.hasRepo ? "text-[#00FF7A]" : "text-[#2B5C3F]"}>{selectedApp.hasRepo ? "YES" : "NO"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-60 text-[#2B5C3F]">REWARD_VERIFIED</span>
                                            <span className={selectedApp.rewardStatus.includes("VERIFIED") ? "text-[#FFD700]" : "text-[#2B5C3F]"}>{selectedApp.rewardStatus === 'UNVERIFIED' ? 'CLAIM_NOT_VERIFIED_YET' : selectedApp.rewardStatus}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-60 text-[#2B5C3F]">ONCHAIN_ANCHOR</span>
                                            <span className={selectedApp.onchainVerified ? "text-[#FFD700]" : "text-[#2B5C3F]"}>{selectedApp.onchainVerified ? "YES" : "NO"}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* DECISION */}
                                <section className="pt-2">
                                    <div className="text-[#00FF7A] font-bold mb-2">:: DECISION_MATRIX ────────────────</div>

                                    <div className="border border-[#0A2A1A] bg-[#0A2A1A]/30 p-4 mb-4">
                                        <div className="text-[10px] text-[#2B5C3F] mb-1">PROMOTION_STATUS</div>
                                        {selectedApp.promotionReady ? (
                                            <div className="text-xl font-bold text-[#00FF7A] crt-text-glow">OBSERVATION_ACTIVE</div>
                                        ) : (
                                            <div className="text-xl font-bold text-[#2B5C3F]">OBSERVATION_INACTIVE</div>
                                        )}
                                    </div>

                                    {selectedApp.promoReasons.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-[10px] text-[#2B5C3F] mb-1">SATISFIED_BLOCKS</div>
                                            <div className="space-y-1 text-[#7CFFB2]">
                                                {selectedApp.promoReasons.map(r => (
                                                    <div key={r} className="flex gap-2">
                                                        <span className="text-[#00FF7A]">+</span>
                                                        <span>{r}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApp.promoMissing.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-[10px] text-[#2B5C3F] mb-1">MISSING_BLOCKS</div>
                                            <div className="space-y-1 text-[#7CFFB2]">
                                                {selectedApp.promoMissing.map(m => (
                                                    <div key={m} className="flex gap-2">
                                                        <span className="text-[#FF4D4D]">-</span>
                                                        <span>{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <div className="text-[#2B5C3F] text-[10px] mb-2">// AGENT_INSIGHT_LOG</div>
                                    <div className="text-[#7CFFB2] font-mono border-l-2 border-[#2B5C3F] pl-3 py-1 italic opacity-80 leading-relaxed">
                                        "{selectedApp.insight}"
                                    </div>
                                </section>
                            </div>
                        </aside>
                    )}

                    {/* REPORT DETAIL PANE */}
                    {selectedReport && (
                        <aside className="w-[420px] bg-[#050607] border-l border-[#0A2A1A] flex flex-col shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0A2A1A] relative z-20">
                            <div className="p-6 border-b border-[#0A2A1A] bg-[#050607]">
                                <h2 className="text-xl font-bold text-[#00FF7A] mb-1 tracking-wider crt-text-glow truncate">{selectedReport.title}</h2>
                                <div className="text-[#2B5C3F] mb-4 text-[10px] break-all">ID::{selectedReport.id}</div>
                            </div>
                            <div className="p-6 whitespace-pre-wrap font-mono text-[#7CFFB2] text-xs leading-relaxed">
                                {selectedReport.fullText}
                            </div>
                        </aside>
                    )}
                </div>

                {/* BOTTOM STATUS BAR */}
                <footer className="h-6 bg-[#0A2A1A] flex items-center justify-between px-6 text-[10px] text-[#2B5C3F] shrink-0">
                    <div>TERMINAL_ID: CRTO-V6</div>
                    <div>SECURE_CONNECTION // {lastCycle}</div>
                </footer>
            </div>
        </div>
    );
}
