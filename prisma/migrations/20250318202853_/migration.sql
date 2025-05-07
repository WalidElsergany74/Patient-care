/*
  Warnings:

  - You are about to drop the column `order` on the `Specialty` table. All the data in the column will be lost.
  - Changed the type of `name` on the `Specialty` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SpecialtyType" AS ENUM ('GENERAL_PHYSICIAN', 'GYNECOLOGIST', 'DERMATOLOGIST', 'PEDIATRICIAN', 'NEUROLOGIST', 'GASTROENTEROLOGIST');

-- AlterTable
ALTER TABLE "Specialty" DROP COLUMN "order",
DROP COLUMN "name",
ADD COLUMN     "name" "SpecialtyType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");
