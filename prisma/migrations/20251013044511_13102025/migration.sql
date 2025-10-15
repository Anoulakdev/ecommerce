-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "userActionId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_userActionId_fkey" FOREIGN KEY ("userActionId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
