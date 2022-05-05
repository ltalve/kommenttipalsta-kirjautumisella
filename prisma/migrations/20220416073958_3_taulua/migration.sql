-- CreateTable
CREATE TABLE "kommentti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kayttajaID" INTEGER NOT NULL,
    "aika" DATETIME NOT NULL,
    "uutinenID" INTEGER NOT NULL
);
