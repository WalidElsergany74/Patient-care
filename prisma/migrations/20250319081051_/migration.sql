/*
  Warnings:

  - The values [GENERAL_PHYSICIAN] on the enum `SpecialtyType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpecialtyType_new" AS ENUM ('GENERAL', 'GYNECOLOGIST', 'DERMATOLOGIST', 'PEDIATRICIAN', 'NEUROLOGIST', 'GASTROENTEROLOGIST');
ALTER TABLE "Specialty" ALTER COLUMN "name" TYPE "SpecialtyType_new" USING ("name"::text::"SpecialtyType_new");
ALTER TYPE "SpecialtyType" RENAME TO "SpecialtyType_old";
ALTER TYPE "SpecialtyType_new" RENAME TO "SpecialtyType";
DROP TYPE "SpecialtyType_old";
COMMIT;
