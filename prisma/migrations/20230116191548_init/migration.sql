/*
  Warnings:

  - You are about to drop the column `birthday` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipId` on the `Parent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Parent_phone_key";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "birthday",
DROP COLUMN "location",
DROP COLUMN "phone",
DROP COLUMN "relationshipId";

-- CreateTable
CREATE TABLE "ParentProfile" (
    "id" SERIAL NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "ParentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParentProfile_phone_key" ON "ParentProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ParentProfile_parentId_key" ON "ParentProfile"("parentId");

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
