
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const assoc = await prisma.accountAssociation.findUnique({ where: { id: 1 } });
    console.log("Current Association in DB:");
    console.log(JSON.stringify(assoc, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
