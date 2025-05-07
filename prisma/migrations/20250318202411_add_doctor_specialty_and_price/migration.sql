/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `AvailableTimeSlot` table. All the data in the column will be lost.
  - You are about to drop the `_DoctorToSpecialty` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[doctorId,appointmentTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Specialty` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `name` on the `Specialty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AvailableTimeSlot" DROP CONSTRAINT "AvailableTimeSlot_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToSpecialty" DROP CONSTRAINT "_DoctorToSpecialty_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToSpecialty" DROP CONSTRAINT "_DoctorToSpecialty_B_fkey";

-- AlterTable
ALTER TABLE "AvailableTimeSlot" DROP COLUMN "appointmentId";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "specialtyId" TEXT NOT NULL DEFAULT 'DEFAULT_SPECIALTY_ID',
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Specialty" DROP COLUMN "name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PATIENT';

-- DropTable
DROP TABLE "_DoctorToSpecialty";

-- DropEnum
DROP TYPE "SpecialtyTypes";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_appointmentTime_key" ON "Appointment"("doctorId", "appointmentTime");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
