-- AlterTable
ALTER TABLE "App" ADD COLUMN "agentInsight" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Builder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "handles" TEXT NOT NULL,
    "wallets" TEXT NOT NULL,
    "trustScore" REAL NOT NULL DEFAULT 0.0,
    "confidenceLevel" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Builder" ("createdAt", "handles", "id", "trustScore", "updatedAt", "wallets") SELECT "createdAt", "handles", "id", "trustScore", "updatedAt", "wallets" FROM "Builder";
DROP TABLE "Builder";
ALTER TABLE "new_Builder" RENAME TO "Builder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
