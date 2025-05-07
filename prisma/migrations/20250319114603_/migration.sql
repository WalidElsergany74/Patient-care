-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableDays" "WeekDay"[];

-- CreateTable
CREATE TABLE "AvailableTimeSlot" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "timeSlot" TEXT NOT NULL,

    CONSTRAINT "AvailableTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailableTimeSlot_doctorId_day_timeSlot_key" ON "AvailableTimeSlot"("doctorId", "day", "timeSlot");

-- AddForeignKey
ALTER TABLE "AvailableTimeSlot" ADD CONSTRAINT "AvailableTimeSlot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
