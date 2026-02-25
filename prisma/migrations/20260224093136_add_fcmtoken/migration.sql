-- CreateTable
CREATE TABLE "FcmToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "platform" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "fcmToken" VARCHAR(255) NOT NULL,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_userId_platform_model_key" ON "FcmToken"("userId", "platform", "model");

-- AddForeignKey
ALTER TABLE "FcmToken" ADD CONSTRAINT "FcmToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
