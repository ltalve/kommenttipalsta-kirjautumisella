-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_kommentti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajaID" INTEGER NOT NULL,
    "aika" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uutinenID" INTEGER NOT NULL,
    "teksti" TEXT NOT NULL,
    CONSTRAINT "kommentti_uutinenID_fkey" FOREIGN KEY ("uutinenID") REFERENCES "uutinen" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "kommentti_kayttajaID_fkey" FOREIGN KEY ("kayttajaID") REFERENCES "kayttaja" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_kommentti" ("aika", "id", "kayttajaID", "teksti", "uutinenID") SELECT "aika", "id", "kayttajaID", "teksti", "uutinenID" FROM "kommentti";
DROP TABLE "kommentti";
ALTER TABLE "new_kommentti" RENAME TO "kommentti";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
