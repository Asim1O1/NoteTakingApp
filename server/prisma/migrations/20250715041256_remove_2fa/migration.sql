/*
  Warnings:

  - You are about to drop the column `is2FAEnabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is2FAEnabled",
DROP COLUMN "twoFactorSecret";
