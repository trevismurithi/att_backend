/*
  Warnings:

  - You are about to drop the column `To` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `to` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "To",
ADD COLUMN     "to" TIMESTAMP(3) NOT NULL;
