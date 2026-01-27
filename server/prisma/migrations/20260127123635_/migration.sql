/*
  Warnings:

  - A unique constraint covering the columns `[item_id]` on the table `masterjewelItemMapper` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `masterjewelItemMapper_item_id_key` ON `masterjewelItemMapper`(`item_id`);
