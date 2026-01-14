/*
  Warnings:

  - You are about to drop the column `lot_id` on the `scarpinfo` table. All the data in the column will be lost.
  - You are about to drop the column `process_id` on the `scarpinfo` table. All the data in the column will be lost.
  - Added the required column `lotName` to the `lotInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lot_ids` to the `scarpInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `process_ids` to the `scarpInfo` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `itemTotal` on the `scarpinfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `touch` on table `scarpinfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cuttingScarp` on table `scarpinfo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `scarpinfo` DROP FOREIGN KEY `scarpInfo_lot_id_fkey`;

-- DropIndex
DROP INDEX `scarpInfo_lot_id_process_id_key` ON `scarpinfo`;

-- AlterTable
ALTER TABLE `lotinfo` ADD COLUMN `lotName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `scarpinfo` DROP COLUMN `lot_id`,
    DROP COLUMN `process_id`,
    ADD COLUMN `lot_ids` JSON NOT NULL,
    ADD COLUMN `process_ids` JSON NOT NULL,
    DROP COLUMN `itemTotal`,
    ADD COLUMN `itemTotal` JSON NOT NULL,
    MODIFY `scarp` JSON NOT NULL,
    MODIFY `touch` JSON NOT NULL,
    MODIFY `cuttingScarp` JSON NOT NULL,
    MODIFY `totalScarp` JSON NOT NULL;
