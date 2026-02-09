import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CurationStatus } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apps = await prisma.app.findMany({
            where: {
                status: CurationStatus.CURATED
            },
            include: {
                builder: true
            },
            orderBy: {
                lastEventAt: 'desc'
            },
            take: 50
        });

        return NextResponse.json({ apps });
    } catch (error) {
        console.error("Feed API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
