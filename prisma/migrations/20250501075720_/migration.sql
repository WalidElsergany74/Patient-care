/*
  Warnings:

  - You are about to drop the column `name_en` on the `Specialty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Specialty" DROP COLUMN "name_en";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
