/*
  Warnings:

  - A unique constraint covering the columns `[oib]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mbs]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Made the column `oib` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mbs` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "oib" SET NOT NULL,
ALTER COLUMN "mbs" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_oib_key" ON "Company"("oib");

-- CreateIndex
CREATE UNIQUE INDEX "Company_mbs_key" ON "Company"("mbs");

-- CreateIndex
CREATE UNIQUE INDEX "Company_phone_key" ON "Company"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
