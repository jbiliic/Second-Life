-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('cardboard', 'plastic', 'wood', 'metal', 'glass', 'other');

-- CreateEnum
CREATE TYPE "MaterialCondition" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('kg', 'T', 'kom');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('waiting', 'confirmed', 'in_progress', 'picked_up', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PickupMethod" AS ENUM ('pick_up', 'delivery');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('waiting', 'paid', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('card', 'bank_transfer', 'cash');

-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('boxes', 'pallets', 'styrofoam', 'stretch_film', 'plastic', 'ibc_tanks', 'big_bags', 'bubble_wrap', 'other');

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "oib" VARCHAR(11),
    "mbs" VARCHAR(20),
    "logo_url" VARCHAR,
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "website" VARCHAR,
    "is_buyer" BOOLEAN NOT NULL,
    "is_seller" BOOLEAN NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "trust_score" DECIMAL(65,30),
    "carbon_credit" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyPaymentMethod" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "type" "PaymentType" NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "iban" VARCHAR NOT NULL,
    "bank_name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" UUID NOT NULL,
    "country" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "zip" VARCHAR NOT NULL,
    "street" VARCHAR NOT NULL,
    "street_number" VARCHAR NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationCompany" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "material_type" "MaterialType" NOT NULL,
    "condition" "MaterialCondition" NOT NULL,
    "listing_category" "ListingCategory" NOT NULL,
    "isReusable" BOOLEAN NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" "UnitType" NOT NULL,
    "min_order" DECIMAL(65,30) NOT NULL,
    "price_per_unit" DECIMAL(65,30) NOT NULL,
    "currency" VARCHAR NOT NULL,
    "delivery_available" BOOLEAN NOT NULL DEFAULT false,
    "available_until" DATE NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_schedule_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingImage" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "image_url" VARCHAR NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "buyer_company_id" UUID NOT NULL,
    "seller_company_id" UUID NOT NULL,
    "pickup_slot_id" UUID NOT NULL,
    "company_payment_id" UUID NOT NULL,
    "pickup_location_id" UUID NOT NULL,
    "destination_id" UUID NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" "UnitType" NOT NULL,
    "currency" VARCHAR NOT NULL,
    "price_per_unit" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "delivery_cost" DECIMAL(65,30) NOT NULL,
    "platform_fee" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "pickup_method" "PickupMethod" NOT NULL,
    "qr_code" VARCHAR NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "co2_saved_kg" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "rating_accuracy" INTEGER NOT NULL,
    "rating_condition" INTEGER NOT NULL,
    "rating_communication" INTEGER NOT NULL,
    "rating_comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "category" "ListingCategory" NOT NULL,
    "material_type" "MaterialType" NOT NULL,
    "condition" "MaterialCondition" NOT NULL,
    "max_distance_km" INTEGER NOT NULL,
    "max_price_per_unit" DECIMAL(65,30) NOT NULL,
    "min_quantity" DECIMAL(65,30) NOT NULL,
    "unit" "UnitType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupSlot" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PickupSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringSchedule" (
    "id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "cron_expression" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedListing" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "listing_id" UUID NOT NULL,
    "wasSeen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyPaymentMethod" ADD CONSTRAINT "CompanyPaymentMethod_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationCompany" ADD CONSTRAINT "LocationCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationCompany" ADD CONSTRAINT "LocationCompany_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_recurring_schedule_id_fkey" FOREIGN KEY ("recurring_schedule_id") REFERENCES "RecurringSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyer_company_id_fkey" FOREIGN KEY ("buyer_company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_seller_company_id_fkey" FOREIGN KEY ("seller_company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickup_slot_id_fkey" FOREIGN KEY ("pickup_slot_id") REFERENCES "PickupSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_company_payment_id_fkey" FOREIGN KEY ("company_payment_id") REFERENCES "CompanyPaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pickup_location_id_fkey" FOREIGN KEY ("pickup_location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupSlot" ADD CONSTRAINT "PickupSlot_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringSchedule" ADD CONSTRAINT "RecurringSchedule_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
