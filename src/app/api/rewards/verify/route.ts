import { NextRequest, NextResponse } from 'next/server';
import { RewardAgent } from '@/lib/agent/rewards';

export async function POST(req: NextRequest) {
    try {
        // This endpoint triggers the verification loop
        await RewardAgent.verifyPendingRewards();
        return NextResponse.json({ success: true, message: "Verification loop completed" });
    } catch (error) {
        console.error("Rewards Verify API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
