/*
  Warnings:

  - You are about to drop the `LocationCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LocationCompany" DROP CONSTRAINT "LocationCompany_company_id_fkey";

-- DropForeignKey
ALTER TABLE "LocationCompany" DROP CONSTRAINT "LocationCompany_location_id_fkey";

-- DropTable
DROP TABLE "LocationCompany";

-- CreateTable
CREATE TABLE "_CompanyToLocation" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CompanyToLocation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToLocation_B_index" ON "_CompanyToLocation"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToLocation" ADD CONSTRAINT "_CompanyToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToLocation" ADD CONSTRAINT "_CompanyToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
