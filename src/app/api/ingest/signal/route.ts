import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryAgent } from '@/lib/agent/discovery';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { source, type, rawText, authorHandle, timestamp, urls } = body;

        // Validate inputs
        if (!rawText || !authorHandle) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const app = await DiscoveryAgent.processSignal({
            source,
            type,
            rawText,
            authorHandle,
            timestamp: new Date(timestamp),
            urls: urls || []
        });

        return NextResponse.json({ success: true, app });
    } catch (error) {
        console.error("Ingest API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
