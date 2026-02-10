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

        // Upsert singleton row (id: 1)
        const assoc = await prisma.accountAssociation.upsert({
            where: { id: 1 },
            update: { header, payload, signature },
            create: { id: 1, header, payload, signature }
        });

        return NextResponse.json({ success: true, association: assoc });

    } catch (error: any) {
        console.error("Failed to save association:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const assoc = await prisma.accountAssociation.findUnique({
            where: { id: 1 }
        });

        return NextResponse.json({
            exists: !!assoc,
            association: assoc
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
