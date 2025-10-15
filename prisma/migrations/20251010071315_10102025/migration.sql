/*
  Warnings:

  - You are about to drop the column `banklogo` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalprice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `payimg` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `productstatusId` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `userCode` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the column `userCode` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderDetail" DROP CONSTRAINT "OrderDetail_productstatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderDetail" DROP CONSTRAINT "OrderDetail_userCode_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userCode_fkey";

-- DropIndex
DROP INDEX "public"."Order_productId_idx";

-- AlterTable
ALTER TABLE "public"."Bank" DROP COLUMN "banklogo",
DROP COLUMN "name",
ADD COLUMN     "banklogoId" INTEGER,
ADD COLUMN     "shopId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "totalprice",
ADD COLUMN     "currentStatusId" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "grandtotalprice" DECIMAL(10,2),
ADD COLUMN     "shopId" INTEGER;

-- AlterTable
ALTER TABLE "public"."OrderDetail" DROP COLUMN "comment",
DROP COLUMN "createdAt",
DROP COLUMN "payimg",
DROP COLUMN "productstatusId",
DROP COLUMN "userCode",
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "productId" INTEGER,
ADD COLUMN     "quantity" INTEGER DEFAULT 1,
ADD COLUMN     "totalprice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "userCode",
ADD COLUMN     "approved" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "percent" SMALLINT,
ADD COLUMN     "shopId" INTEGER,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Shop" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tel" VARCHAR(255),
    "userCode" VARCHAR(255) NOT NULL,
    "approved" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderStatus" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productstatusId" INTEGER NOT NULL DEFAULT 1,
    "comment" TEXT,
    "payimg" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankLogo" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bankimg" VARCHAR(255) NOT NULL,

    CONSTRAINT "BankLogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_userCode_key" ON "public"."Shop"("userCode");

-- CreateIndex
CREATE INDEX "Order_orderNo_idx" ON "public"."Order"("orderNo");

-- AddForeignKey
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_userCode_fkey" FOREIGN KEY ("userCode") REFERENCES "public"."User"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_currentStatusId_fkey" FOREIGN KEY ("currentStatusId") REFERENCES "public"."ProductStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderStatus" ADD CONSTRAINT "OrderStatus_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderStatus" ADD CONSTRAINT "OrderStatus_productstatusId_fkey" FOREIGN KEY ("productstatusId") REFERENCES "public"."ProductStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bank" ADD CONSTRAINT "Bank_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bank" ADD CONSTRAINT "Bank_banklogoId_fkey" FOREIGN KEY ("banklogoId") REFERENCES "public"."BankLogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
