-- CreateTable
CREATE TABLE "StudentAttendace" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAttendace_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentAttendace" ADD CONSTRAINT "StudentAttendace_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
