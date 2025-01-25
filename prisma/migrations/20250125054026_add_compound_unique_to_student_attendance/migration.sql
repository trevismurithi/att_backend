/*
  Warnings:

  - A unique constraint covering the columns `[date,studentId]` on the table `StudentAttendace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentAttendace_date_studentId_key" ON "StudentAttendace"("date", "studentId");
