/*
  Warnings:

  - You are about to drop the column `favorite` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Bank" ADD COLUMN     "banklogo" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "favorite";

-- CreateTable
CREATE TABLE "public"."UserProduct" (
    "userCode" VARCHAR(255) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "UserProduct_pkey" PRIMARY KEY ("userCode","productId")
);

-- AddForeignKey
ALTER TABLE "public"."UserProduct" ADD CONSTRAINT "UserProduct_userCode_fkey" FOREIGN KEY ("userCode") REFERENCES "public"."User"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProduct" ADD CONSTRAINT "UserProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
