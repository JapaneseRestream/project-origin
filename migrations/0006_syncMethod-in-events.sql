-- CreateTable
CREATE TABLE "Runs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "translatedName" TEXT,
    "category" TEXT,
    "playedWith" TEXT,
    "startsAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Runs_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "syncMethod" TEXT NOT NULL DEFAULT 'gdq_tracker_api',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Events" ("createdAt", "id", "name", "shortName", "startsAt", "updatedAt") SELECT "createdAt", "id", "name", "shortName", "startsAt", "updatedAt" FROM "Events";
DROP TABLE "Events";
ALTER TABLE "new_Events" RENAME TO "Events";
CREATE UNIQUE INDEX "Events_shortName_key" ON "Events"("shortName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
