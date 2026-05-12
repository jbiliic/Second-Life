/*
  Warnings:

  - You are about to drop the column `carbon_credit` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `trust_score` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `CompanyPaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `isReusable` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `company_payment_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_cost` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payment_type` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedListing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_company_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_listing_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_company_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "SavedListing" DROP CONSTRAINT "SavedListing_company_id_fkey";

-- DropForeignKey
ALTER TABLE "SavedListing" DROP CONSTRAINT "SavedListing_listing_id_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "carbon_credit",
DROP COLUMN "trust_score";

-- AlterTable
ALTER TABLE "CompanyPaymentMethod" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "currency",
DROP COLUMN "isReusable";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "company_payment_id",
DROP COLUMN "currency",
DROP COLUMN "delivery_cost",
DROP COLUMN "payment_status",
DROP COLUMN "payment_type",
DROP COLUMN "subtotal";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "SavedListing";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PaymentType";
