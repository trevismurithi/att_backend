/*
  Warnings:

  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunday_class` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "bio",
DROP COLUMN "userId",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "school_class" VARCHAR(255),
ADD COLUMN     "school_name" VARCHAR(255),
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD COLUMN     "sunday_class" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "email" VARCHAR(255),
    "birthday" TIMESTAMP(3) NOT NULL,
    "sex" TEXT NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relationshipId" INTEGER NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_phone_key" ON "Parent"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_studentId_key" ON "Profile"("studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
