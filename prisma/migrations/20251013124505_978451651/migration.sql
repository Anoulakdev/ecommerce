/*
  Warnings:

  - Added the required column `userCode` to the `OrderStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."OrderStatus" ADD COLUMN     "userCode" VARCHAR(255) NOT NULL,
ALTER COLUMN "productstatusId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."OrderStatus" ADD CONSTRAINT "OrderStatus_userCode_fkey" FOREIGN KEY ("userCode") REFERENCES "public"."User"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
