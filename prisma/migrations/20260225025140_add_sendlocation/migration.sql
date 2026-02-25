-- AlterTable
ALTER TABLE "OrderStatus" ADD COLUMN     "sendlocationId" INTEGER;

-- CreateTable
CREATE TABLE "SendLocation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SendLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderStatus" ADD CONSTRAINT "OrderStatus_sendlocationId_fkey" FOREIGN KEY ("sendlocationId") REFERENCES "SendLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
