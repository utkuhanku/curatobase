import { prisma } from '../src/lib/db';

async function main() {
    console.log("🧹 Starting Duplicate Cleanup...");

    // Find all verified rewards with a hash
    const rewards = await prisma.rewardEvent.findMany({
        where: {
            verificationTxHash: { not: null }
        }
    });

    const hashToIdMap = new Map<string, string>();
    const duplicates: string[] = [];

    for (const r of rewards) {
        if (!r.verificationTxHash) continue;

        if (hashToIdMap.has(r.verificationTxHash)) {
            // Found duplicate. We keep the one in map (first one found) or switch logic to keep newest?
            // Let's keep the one currently iterated, delete the old one from map to be safe? 
            // Actually, let's keep the *first* one encountered in DB order (usually oldest) and delete subsequent ones.
            // Wait, findMany order is undefined unless specified. Let's delete the current one 'r'
            duplicates.push(r.id);
        } else {
            hashToIdMap.set(r.verificationTxHash, r.id);
        }
    }

    if (duplicates.length > 0) {
        console.log(`Found ${duplicates.length} duplicates. Deleting...`);
        await prisma.rewardEvent.deleteMany({
            where: { id: { in: duplicates } }
        });
        console.log("✅ Duplicates removed.");
    } else {
        console.log("✅ No duplicates found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
