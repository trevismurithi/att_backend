/*
  Warnings:

  - You are about to drop the column `password` on the `Parent` table. All the data in the column will be lost.
  - The `role` column on the `Parent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `enabled` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PARENT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enabled" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
