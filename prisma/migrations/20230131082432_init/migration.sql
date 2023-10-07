/*
  Warnings:

  - You are about to drop the column `birthday` on the `Parent` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `birthday` to the `ParentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARENT', 'TEACHER');

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "birthday",
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "ParentProfile" ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(255) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TEACHER';
