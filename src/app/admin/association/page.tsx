'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Save, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AssociationPage() {
    const [secret, setSecret] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // Hydrate from URL param if present (convenience)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) setSecret(token);
    }, []);

    const saveConfig = async () => {
        setLoading(true);
        setMsg('');
        try {
            // Use new dedicated endpoint
            const res = await fetch('/api/admin/association', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secret}` },
                body: JSON.stringify({ header, payload, signature })
            });
            const d = await res.json();
            if (d.success) {
                setMsg('SUCCESS');
            } else {
                setMsg(`ERROR: ${d.error}`);
            }
        } catch (e: any) {
            setMsg(`ERROR: ${e.message}`);
        }
        setLoading(false);
    };

    if (msg === 'SUCCESS') {
        return (
            <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4">
                <div className="bg-green-900/20 border border-green-500/50 p-8 rounded text-center max-w-md w-full">
                    <ShieldCheck size={48} className="mx-auto text-green-500 mb-4" />
                    <h1 className="text-xl font-bold text-green-400 mb-2">Association Saved ✅</h1>
                    <p className="text-sm opacity-70 mb-6">The manifest is now live with your signature.</p>
                    <Link href="/status" className="inline-flex items-center gap-2 bg-green-600 text-black px-6 py-3 rounded font-bold hover:bg-green-500">
                        Check Status <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8 max-w-2xl mx-auto">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="text-blue-500" /> Account Association
                </h1>
                <p className="text-xs text-gray-500 mt-2">Connect your Farcaster account (Domain Verification)</p>
            </header>

            <div className="space-y-6">

                {/* Secret Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Admin Secret</label>
                    <input
                        type="password"
                        value={secret}
                        onChange={e => setSecret(e.target.value)}
                        placeholder="Enter ADMIN_SECRET..."
                        className="bg-gray-900 border border-gray-700 p-3 rounded text-white focus:border-blue-500 outline-none"
                    />
                </div>

                {/* Form Fields */}
                <div className="space-y-4 p-6 border border-blue-900/30 bg-blue-900/5 rounded-lg">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">Farcaster Signature Header</label>
                        <input
                            value={header}
                            onChange={e => setHeader(e.target.value)}
                            placeholder="eyJ..."
                            className="bg-black border border-gray-700 p-3 rounded text-sm font-mono text-blue-300 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">Farcaster Signature Payload</label>
                        <input
                            value={payload}
                            onChange={e => setPayload(e.target.value)}
                            placeholder="eyJ..."
                            className="bg-black border border-gray-700 p-3 rounded text-sm font-mono text-blue-300 focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400">Farcaster Signature</label>
                        <input
                            value={signature}
                            onChange={e => setSignature(e.target.value)}
                            placeholder="0x..."
                            className="bg-black border border-gray-700 p-3 rounded text-sm font-mono text-blue-300 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                    <a href="https://warpcast.com/~/developers/domains" target="_blank" className="text-sm text-gray-500 hover:text-white underline">
                        Need to generate keys?
                    </a>

                    <button
                        onClick={saveConfig}
                        disabled={loading || !secret || !signature}
                        className={`flex items-center gap-2 px-6 py-3 rounded font-bold transition-all ${!secret || !signature ? 'bg-gray-800 text-gray-500 cursor-not-allowed' :
                            'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                            }`}
                    >
                        {loading ? 'Saving...' : <><Save size={18} /> Save Association</>}
                    </button>
                </div>

                {msg && msg.startsWith('ERROR') && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 rounded text-sm font-bold">
                        {msg}
                    </div>
                )}

            </div>
        </div>
    );
}
