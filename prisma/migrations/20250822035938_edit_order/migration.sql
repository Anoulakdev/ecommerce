/*
  Warnings:

  - You are about to drop the column `bankId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paydate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payimg` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `productstatusId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userCode` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_bankId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productstatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userCode_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "bankId",
DROP COLUMN "comment",
DROP COLUMN "paydate",
DROP COLUMN "payimg",
DROP COLUMN "productstatusId",
DROP COLUMN "userCode";

-- CreateTable
CREATE TABLE "public"."OrderDetail" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "userCode" VARCHAR(255) NOT NULL,
    "productstatusId" INTEGER NOT NULL,
    "comment" TEXT,
    "payimg" VARCHAR(255),
    "paydate" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderDetail_orderId_idx" ON "public"."OrderDetail"("orderId");

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_userCode_fkey" FOREIGN KEY ("userCode") REFERENCES "public"."User"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetail" ADD CONSTRAINT "OrderDetail_productstatusId_fkey" FOREIGN KEY ("productstatusId") REFERENCES "public"."ProductStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
