'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';

export default function StatusPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/miniapp/validate')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(e => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 font-mono text-green-500 animate-pulse">Scanning System Configuration...</div>;
    if (!data) return <div className="p-8 font-mono text-red-500">Failed to load status.</div>;

    const isReady = data.overall === 'READY';

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono max-w-2xl mx-auto">
            <header className="mb-8 border-b border-white/10 pb-4">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    {isReady ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-yellow-500" />}
                    Mini App Status: <span className={isReady ? "text-green-500" : "text-yellow-500"}>{data.overall}</span>
                </h1>
                <p className="text-xs text-gray-500 mt-2">Target: {data.manifestUrl}</p>
            </header>

            <div className="space-y-4">
                {data.checks.map((check: any) => (
                    <div key={check.id} className="flex items-start justify-between p-4 border border-white/10 rounded bg-white/5">
                        <div className="flex items-center gap-3">
                            {check.status === 'PASS' && <CheckCircle className="text-green-500" size={18} />}
                            {check.status === 'FAIL' && <XCircle className="text-red-500" size={18} />}
                            {check.status === 'WARN' && <AlertTriangle className="text-yellow-500" size={18} />}

                            <div>
                                <div className="font-bold text-sm">{check.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{check.details}</div>
                            </div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded ${check.status === 'PASS' ? 'bg-green-900/20 text-green-400' :
                                check.status === 'FAIL' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'
                            }`}>
                            {check.status}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-[#111] p-4 rounded border border-white/10 overflow-x-auto">
                <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">Manifest Dump</h3>
                <pre className="text-[10px] text-green-400 leading-relaxed">
                    {JSON.stringify(data.manifestBody, null, 2)}
                </pre>
            </div>

            {!isReady && (
                <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <Search size={16} className="text-blue-400" /> Action Required
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-2 text-gray-300">
                        {data.checks.find((c: any) => c.id === 'signature' && c.status === 'FAIL') && (
                            <li>
                                <strong>Generate Signature</strong>: Go to <a href="https://warpcast.com/~/developers/domains" target="_blank" className="text-blue-400 underline">Warpcast Developer Tools</a>, verify `curatobase.vercel.app`, and update `src/app/.well-known/farcaster.json/route.ts`.
                            </li>
                        )}
                        {data.checks.find((c: any) => c.id === 'miniapp-key' && c.status === 'FAIL') && (
                            <li>
                                <strong>Add MiniApp Key</strong>: Your manifest is missing the `miniapp` object. Update the route handler.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
