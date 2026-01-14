-- CreateTable
CREATE TABLE `lotInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_initial_weight` DOUBLE NULL,
    `scarpDate` VARCHAR(191) NOT NULL,
    `master_id` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customerInfo` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_shop_name` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterProcess` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `process_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterProcessMapper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `master_id` INTEGER NOT NULL,
    `process_id` INTEGER NOT NULL,
    `process_order_sort` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attributeInfo` (
    `attribute_id` INTEGER NOT NULL AUTO_INCREMENT,
    `attribute_type` VARCHAR(191) NOT NULL,
    `attribute_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attribute_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LotProcess` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `process_name` VARCHAR(191) NOT NULL,
    `process_description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `processSteps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `process_id` INTEGER NOT NULL,
    `attribute_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attributeValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NULL,
    `attribute_id` INTEGER NOT NULL,
    `items_id` INTEGER NULL,
    `value` DOUBLE NULL,
    `touchValue` DOUBLE NULL,
    `item_name` VARCHAR(191) NULL,
    `process_step_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NOT NULL,
    `item_type` VARCHAR(191) NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductStocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `product_status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_status` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `total_price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `stock_id` INTEGER NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `touchValue` DOUBLE NOT NULL,
    `productWeight` DOUBLE NOT NULL,
    `final_price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_jewel_type` (
    `master_jewel_id` INTEGER NOT NULL AUTO_INCREMENT,
    `jewel_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`master_jewel_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_jewel_type_customer_value` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `masterJewel_id` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `attribute1` DOUBLE NULL,
    `attribute2` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterjewelItemMapper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_id` INTEGER NOT NULL,
    `master_jewel_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Balance` (
    `balance_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `gold_weight` DOUBLE NOT NULL,
    `gold_touch` DOUBLE NOT NULL,
    `gold_pure` DOUBLE NOT NULL,
    `remaining_gold_balance` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`balance_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClosingBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `closing_balance` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClosingBalance_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scarpInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lot_id` INTEGER NOT NULL,
    `process_id` INTEGER NOT NULL,
    `scarpDate` VARCHAR(191) NOT NULL,
    `itemTotal` INTEGER NOT NULL,
    `scarp` DOUBLE NOT NULL,
    `touch` DOUBLE NULL,
    `cuttingScarp` DOUBLE NULL,
    `totalScarp` DOUBLE NOT NULL,

    UNIQUE INDEX `scarpInfo_lot_id_process_id_key`(`lot_id`, `process_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `receipt` (
    `receipt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `goldRate` DOUBLE NOT NULL,
    `givenGold` DOUBLE NOT NULL,
    `touch` DOUBLE NOT NULL,
    `purityWeight` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,

    PRIMARY KEY (`receipt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customerBalance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_id` INTEGER NOT NULL,
    `expure` DOUBLE NULL,
    `balance` DOUBLE NULL,

    UNIQUE INDEX `customerBalance_customer_id_key`(`customer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MasterProcessToProcessSteps` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MasterProcessToProcessSteps_AB_unique`(`A`, `B`),
    INDEX `_MasterProcessToProcessSteps_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lotInfo` ADD CONSTRAINT `lotInfo_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `masterProcess`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterProcessMapper` ADD CONSTRAINT `masterProcessMapper_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `masterProcess`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterProcessMapper` ADD CONSTRAINT `masterProcessMapper_process_id_fkey` FOREIGN KEY (`process_id`) REFERENCES `LotProcess`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `processSteps` ADD CONSTRAINT `processSteps_process_id_fkey` FOREIGN KEY (`process_id`) REFERENCES `LotProcess`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `processSteps` ADD CONSTRAINT `processSteps_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `attributeInfo`(`attribute_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attributeValue` ADD CONSTRAINT `attributeValue_lot_id_fkey` FOREIGN KEY (`lot_id`) REFERENCES `lotInfo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attributeValue` ADD CONSTRAINT `attributeValue_items_id_fkey` FOREIGN KEY (`items_id`) REFERENCES `item`(`item_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attributeValue` ADD CONSTRAINT `attributeValue_attribute_id_fkey` FOREIGN KEY (`attribute_id`) REFERENCES `attributeInfo`(`attribute_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attributeValue` ADD CONSTRAINT `attributeValue_process_step_id_fkey` FOREIGN KEY (`process_step_id`) REFERENCES `processSteps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_lot_id_fkey` FOREIGN KEY (`lot_id`) REFERENCES `lotInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductStocks` ADD CONSTRAINT `ProductStocks_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterOrder` ADD CONSTRAINT `masterOrder_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `masterOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_stock_id_fkey` FOREIGN KEY (`stock_id`) REFERENCES `ProductStocks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_jewel_type_customer_value` ADD CONSTRAINT `master_jewel_type_customer_value_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `master_jewel_type_customer_value` ADD CONSTRAINT `master_jewel_type_customer_value_masterJewel_id_fkey` FOREIGN KEY (`masterJewel_id`) REFERENCES `master_jewel_type`(`master_jewel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterjewelItemMapper` ADD CONSTRAINT `masterjewelItemMapper_master_jewel_id_fkey` FOREIGN KEY (`master_jewel_id`) REFERENCES `master_jewel_type`(`master_jewel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterjewelItemMapper` ADD CONSTRAINT `masterjewelItemMapper_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item`(`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balance` ADD CONSTRAINT `Balance_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Balance` ADD CONSTRAINT `Balance_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `masterOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClosingBalance` ADD CONSTRAINT `ClosingBalance_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scarpInfo` ADD CONSTRAINT `scarpInfo_lot_id_fkey` FOREIGN KEY (`lot_id`) REFERENCES `lotInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `receipt` ADD CONSTRAINT `receipt_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customerBalance` ADD CONSTRAINT `customerBalance_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customerInfo`(`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MasterProcessToProcessSteps` ADD CONSTRAINT `_MasterProcessToProcessSteps_A_fkey` FOREIGN KEY (`A`) REFERENCES `masterProcess`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MasterProcessToProcessSteps` ADD CONSTRAINT `_MasterProcessToProcessSteps_B_fkey` FOREIGN KEY (`B`) REFERENCES `processSteps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
