/*
  Warnings:

  - You are about to drop the column `scarpDate` on the `lotinfo` table. All the data in the column will be lost.
  - You are about to drop the column `scarpDate` on the `scarpinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lotinfo` DROP COLUMN `scarpDate`;

-- AlterTable
ALTER TABLE `scarpinfo` DROP COLUMN `scarpDate`;
