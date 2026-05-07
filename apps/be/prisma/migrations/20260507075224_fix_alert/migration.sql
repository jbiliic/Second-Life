/*
  Warnings:

  - Added the required column `latitude` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "material_type" DROP NOT NULL,
ALTER COLUMN "condition" DROP NOT NULL,
ALTER COLUMN "max_distance_km" DROP NOT NULL,
ALTER COLUMN "max_price_per_unit" DROP NOT NULL,
ALTER COLUMN "min_quantity" DROP NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL;
