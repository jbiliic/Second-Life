/*
  Warnings:

  - You are about to drop the column `mbs` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Company_mbs_key";

-- DropIndex
DROP INDEX "Company_phone_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "mbs",
DROP COLUMN "phone",
DROP COLUMN "website";
