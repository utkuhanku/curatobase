import { TrustReportRunner } from '../src/lib/agent/TrustReportRunner';
import 'dotenv/config';

// CLI Wrapper
async function main() {
    const DRY_RUN = process.env.TRUST_REPORT_DRY_RUN === 'true';
    const ENABLED = process.env.TRUST_REPORT_ENABLED === 'true';

    try {
        const result = await TrustReportRunner.run({ dryRun: DRY_RUN, enabled: ENABLED });
        console.log("✅ TrustReportRunner completed:", result);
        process.exit(0);
    } catch (e) {
        console.error("❌ TrustReportRunner failed:", e);
        process.exit(1);
    }
}

main();
