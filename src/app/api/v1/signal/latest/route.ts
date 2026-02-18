import { NextRequest, NextResponse } from 'next/server';
import { getPaymentHeaders, verifyPayment } from '@/lib/agent/payment-verifier';

export async function GET(req: NextRequest) {
    const txHash = req.headers.get('x-payment-tx') || req.nextUrl.searchParams.get('tx');

    // 1. No Payment Verification provided -> 402
    if (!txHash) {
        return NextResponse.json(
            {
                error: "Payment Required",
                message: "This is a premium autonomous signal.",
                payment_instructions: {
                    to: process.env.REVENUE_CONTRACT_ADDRESS,
                    amount: "0.0001 ETH",
                    chainId: 8453,
                    reason: "Signal Access (24h Pass)",
                    method: "Send ETH then retry request with 'x-payment-tx' header containing the hash."
                }
            },
            {
                status: 402,
                headers: getPaymentHeaders()
            }
        );
    }

    // 2. Verify Payment
    const verification = await verifyPayment(txHash);

    if (verification.status !== 'PAID') {
        return NextResponse.json(
            { error: "Payment Verification Failed", details: verification },
            { status: 403 }
        );
    }

    // 3. Return Premium Signal
    // In a real scenario, this fetches from DB. For MVP, we generate a high-value signal.
    const signal = {
        meta: {
            generated_at: new Date().toISOString(),
            agent_version: "2.1.0",
            payment_received: verification.amount,
            builder_code: "curatobase"
        },
        data: {
            signal_type: "TRUST_REPORT",
            focus: "Base Ecosystem",
            top_movers: [
                { name: "Aerodrome", trust_score: 99.9, status: "VERIFIED" },
                { name: "Moonwell", trust_score: 98.5, status: "VERIFIED" },
                { name: "BasePaint", trust_score: 97.2, status: "VERIFIED" }
            ],
            analysis: "High on-chain activity detected in DeFi sector. Risk levels nominal."
        }
    };

    return NextResponse.json(signal, { status: 200 });
}
