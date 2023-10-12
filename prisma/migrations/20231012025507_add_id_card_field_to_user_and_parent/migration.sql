/*
  Warnings:

  - You are about to drop the column `birthday` on the `ParentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `User` table. All the data in the column will be lost.
  - Added the required column `idCard` to the `ParentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idCard` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParentProfile" DROP COLUMN "birthday",
ADD COLUMN     "idCard" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthday",
ADD COLUMN     "idCard" TEXT NOT NULL;
