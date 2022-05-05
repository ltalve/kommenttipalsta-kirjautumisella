/*
  Warnings:

  - A unique constraint covering the columns `[tunnus]` on the table `kayttaja` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "kayttaja_tunnus_key" ON "kayttaja"("tunnus");
