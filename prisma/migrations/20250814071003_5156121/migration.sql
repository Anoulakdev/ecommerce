/*
  Warnings:

  - You are about to drop the column `pstatusId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `punitId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Pstatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Punit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productstatusId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productunitId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_pstatusId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_punitId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "pstatusId",
ADD COLUMN     "productstatusId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "punitId",
ADD COLUMN     "productunitId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Pstatus";

-- DropTable
DROP TABLE "public"."Punit";

-- CreateTable
CREATE TABLE "public"."ProductUnit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255),

    CONSTRAINT "ProductUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductStatus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(255),

    CONSTRAINT "ProductStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_productunitId_fkey" FOREIGN KEY ("productunitId") REFERENCES "public"."ProductUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_productstatusId_fkey" FOREIGN KEY ("productstatusId") REFERENCES "public"."ProductStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
