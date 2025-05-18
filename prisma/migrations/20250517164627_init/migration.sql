/*
  Warnings:

  - Added the required column `profileProId` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_Organozation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Organozation_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Organozation_B_fkey" FOREIGN KEY ("B") REFERENCES "profile_pros" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profile_pros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "profile_pros_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_profile_pros" ("id", "organizationId", "profileId", "updatedAt") SELECT "id", "organizationId", "profileId", "updatedAt" FROM "profile_pros";
DROP TABLE "profile_pros";
ALTER TABLE "new_profile_pros" RENAME TO "profile_pros";
CREATE UNIQUE INDEX "profile_pros_profileId_key" ON "profile_pros"("profileId");
CREATE TABLE "new_teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organizationId" TEXT NOT NULL,
    "profileProId" TEXT NOT NULL,
    CONSTRAINT "teams_profileProId_fkey" FOREIGN KEY ("profileProId") REFERENCES "profile_pros" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "teams_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_teams" ("createdAt", "description", "id", "name", "order", "organizationId", "updatedAt") SELECT "createdAt", "description", "id", "name", "order", "organizationId", "updatedAt" FROM "teams";
DROP TABLE "teams";
ALTER TABLE "new_teams" RENAME TO "teams";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_Organozation_AB_unique" ON "_Organozation"("A", "B");

-- CreateIndex
CREATE INDEX "_Organozation_B_index" ON "_Organozation"("B");
