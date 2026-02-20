import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.app.deleteMany({ where: { name: "SuperDapp" } });
    await prisma.app.deleteMany({ where: { name: "BasePaint v2" } });
    console.log("Mock data wiped.");
}
main().finally(() => window.process.exit()); // use process exits properly
