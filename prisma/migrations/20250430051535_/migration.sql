/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Specialty" ADD COLUMN     "name_ar" TEXT,
ADD COLUMN     "name_en" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "bio",
ADD COLUMN     "address_ar" TEXT,
ADD COLUMN     "address_en" TEXT,
ADD COLUMN     "bio_ar" TEXT,
ADD COLUMN     "bio_en" TEXT,
ADD COLUMN     "username_ar" TEXT,
ADD COLUMN     "username_en" TEXT;
