import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { header, payload, signature } = body;

        if (!header || !payload || !signature) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Use a consistent ID for the config signal to allow upsert logic (simulated by delete-create or find-update)
        // Since we don't have a unique constraint on type/source, we'll delete old configs first.

        // 1. Delete existing config
        await prisma.signal.deleteMany({
            where: {
                type: 'SYSTEM_CONFIG',
                source: 'MANIFEST'
            }
        });

        // 2. Create new config
        await prisma.signal.create({
            data: {
                type: 'SYSTEM_CONFIG',
                source: 'MANIFEST',
                rawText: 'Manifest Configuration',
                authorHandle: 'admin',
                timestamp: new Date(),
                metadata: JSON.stringify({
                    accountAssociation: { header, payload, signature }
                }),
                urls: '[]'
            }
        });

        return NextResponse.json({ success: true, message: 'Configuration saved' });

    } catch (error: any) {
        console.error("Failed to save config:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
