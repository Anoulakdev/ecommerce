/*
  Warnings:

  - You are about to drop the column `fcmToken` on the `FcmToken` table. All the data in the column will be lost.
  - Added the required column `fcmtoken` to the `FcmToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FcmToken" DROP COLUMN "fcmToken",
ADD COLUMN     "fcmtoken" VARCHAR(255) NOT NULL;
