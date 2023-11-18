/*
  Warnings:

  - You are about to drop the column `studentId` on the `Attendace` table. All the data in the column will be lost.
  - Added the required column `total` to the `Attendace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendace" DROP CONSTRAINT "Attendace_studentId_fkey";

-- AlterTable
ALTER TABLE "Attendace" DROP COLUMN "studentId",
ADD COLUMN     "total" INTEGER NOT NULL;
