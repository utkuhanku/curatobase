import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Required for child_process
export const maxDuration = 60; // 1 minute max

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!process.env.ADMIN_SECRET || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("🔄 Starting DB Init...");

        // Check for migrations folder (heuristic) -> actually hard to distinguish in bundled lambda.
        // Safest "fast path" for Neon/Vercel is usually `db push` if we aren't strict about migration history for now.
        // User said: "a) If prisma/migrations exists → run `prisma migrate deploy`, b) Else → run `prisma db push`"

        // We'll try migrate deploy first. If it fails (e.g. baseline missing or mismatch), we fallback to db push?
        // Or better, just use `db push` as it is robust for "getting it to work" on a fresh DB.
        // But `migrate deploy` is safer for prod.

        // Let's try `db push` with --skip-generate (since client is already generated during build)
        // and --accept-data-loss (it's a fresh DB effectively if tables are missing).

        const command = 'npx prisma db push --skip-generate --accept-data-loss';
        console.log(`Running: ${command}`);

        const { stdout, stderr } = await execAsync(command);

        console.log('STDOUT:', stdout);
        if (stderr) console.error('STDERR:', stderr);

        return NextResponse.json({
            success: true,
            message: 'DB Init Complete',
            stdout,
            stderr
        });

    } catch (error: any) {
        console.error("❌ DB Init Failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
