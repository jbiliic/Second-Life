/*
  Warnings:

  - You are about to drop the column `is_buyer` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `is_seller` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "is_buyer",
DROP COLUMN "is_seller";
