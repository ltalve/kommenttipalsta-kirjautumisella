/*
  Warnings:

  - Added the required column `teksti` to the `kommentti` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_kommentti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajaID" INTEGER NOT NULL,
    "aika" DATETIME NOT NULL,
    "uutinenID" INTEGER NOT NULL,
    "teksti" TEXT NOT NULL,
    CONSTRAINT "kommentti_uutinenID_fkey" FOREIGN KEY ("uutinenID") REFERENCES "uutinen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "kommentti_kayttajaID_fkey" FOREIGN KEY ("kayttajaID") REFERENCES "kayttaja" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_kommentti" ("aika", "id", "kayttajaID", "uutinenID") SELECT "aika", "id", "kayttajaID", "uutinenID" FROM "kommentti";
DROP TABLE "kommentti";
ALTER TABLE "new_kommentti" RENAME TO "kommentti";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
