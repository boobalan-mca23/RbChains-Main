/*
  Warnings:

  - Made the column `item_type` on table `item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `item_type` ENUM('PARENT', 'CHILD') NOT NULL;
