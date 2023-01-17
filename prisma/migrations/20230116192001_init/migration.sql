/*
  Warnings:

  - You are about to drop the column `password` on the `Parent` table. All the data in the column will be lost.
  - Made the column `email` on table `Parent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "password",
ALTER COLUMN "email" SET NOT NULL;
