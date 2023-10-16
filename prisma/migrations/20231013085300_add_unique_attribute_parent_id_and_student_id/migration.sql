/*
  Warnings:

  - A unique constraint covering the columns `[parentId,studentId]` on the table `Relationship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Relationship_parentId_studentId_key" ON "Relationship"("parentId", "studentId");
