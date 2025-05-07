/*
  Warnings:

  - Added the required column `image` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `specialty` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Specialty" AS ENUM ('GENERAL_PHYSICIAN', 'GYNECOLOGIST', 'DERMATOLOGIST', 'PEDIATRICIAN', 'NEUROLOGIST', 'GASTROENTEROLOGIST');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "specialty",
ADD COLUMN     "specialty" "Specialty" NOT NULL;
