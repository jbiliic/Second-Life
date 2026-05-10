/*
  Warnings:

  - You are about to drop the column `recurring_schedule_id` on the `Listing` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_recurring_schedule_id_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "recurring_schedule_id";
