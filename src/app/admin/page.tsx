'use client';

import { useState } from 'react';
import { ShieldCheck, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function AdminPage() {
    const [secret, setSecret] = useState('');
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const createTestReport = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/create-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secret}`
                },
                body: JSON.stringify({
                    title: `Persistence Check ${new Date().toLocaleTimeString()}`,
                    verdict: 'VERIFIED_PERSISTENT',
                    notes: 'This report confirms DB writes are working.'
                })
            });
            const data = await res.json();
            setStatus(data);
        } catch (e: any) {
            setStatus({ error: e.message });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LayoutDashboard /> Admin Console
            </h1>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs opacity-70">ADMIN_SECRET</label>
                    <input
                        type="password"
                        value={secret}
                        onChange={e => setSecret(e.target.value)}
                        className="bg-black border border-green-800 p-2 rounded text-white focus:outline-none focus:border-green-500"
                        placeholder="Enter secret..."
                    />
                </div>

                <div className="p-4 border border-green-900 rounded bg-green-900/10">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                        <ShieldCheck size={16} /> Persistence Proof
                    </h3>
                    <p className="text-xs opacity-70 mb-4">
                        Creates a real record in the PostgreSQL database to verify write access.
                    </p>

                    <button
                        onClick={createTestReport}
                        disabled={loading || !secret}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold ${!secret ? 'bg-gray-800 text-gray-500 cursor-not-allowed' :
                                'bg-green-600 text-black hover:bg-green-500'
                            }`}
                    >
                        {loading ? 'Writing...' : 'Create Test Report'}
                    </button>
                    {status && (
                        <div className={`mt-4 p-4 rounded border text-xs ${status.success ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                            <pre>{JSON.stringify(status, null, 2)}</pre>
                        </div>
                    )}
                </div>

                <ConfigForm secret={secret} />
            </div>
        </div>
    );
}

function ConfigForm({ secret }: { secret: string }) {
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const saveConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secret}` },
                body: JSON.stringify({ header, payload, signature })
            });
            const d = await res.json();
            setMsg(d.success ? '✅ Saved! Check /status' : `❌ Error: ${d.error}`);
        } catch (e: any) {
            setMsg(`❌ Error: ${e.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-4 border border-blue-900 rounded bg-blue-900/10">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-blue-400">
                <ShieldCheck size={16} /> Account Association (Signature)
            </h3>
            <div className="space-y-3">
                <input placeholder="Header (eyJ...)" value={header} onChange={e => setHeader(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-xs rounded text-white" />
                <input placeholder="Payload (eyJ...)" value={payload} onChange={e => setPayload(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-xs rounded text-white" />
                <input placeholder="Signature (0x...)" value={signature} onChange={e => setSignature(e.target.value)} className="w-full bg-black border border-gray-700 p-2 text-xs rounded text-white" />

                <div className="flex justify-between items-center">
                    <a href="https://warpcast.com/~/developers/domains" target="_blank" className="text-xs text-blue-400 underline">Generate Signature &rarr;</a>
                    <button onClick={saveConfig} disabled={loading || !secret} className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-500">
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
                {msg && <p className="text-xs font-mono">{msg}</p>}
            </div>
        </div>
    );
}
