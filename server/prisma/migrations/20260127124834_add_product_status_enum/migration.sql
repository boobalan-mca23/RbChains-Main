/*
  Warnings:

  - You are about to alter the column `product_status` on the `productstocks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `productstocks` MODIFY `product_status` ENUM('ACTIVE', 'SOLD') NOT NULL;
