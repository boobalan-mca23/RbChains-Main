/*
  Warnings:

  - You are about to drop the column `created_at` on the `balance` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `balance` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `closingbalance` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `closingbalance` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `master_jewel_type` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `master_jewel_type` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `master_jewel_type_customer_value` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `master_jewel_type_customer_value` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `masterjewelitemmapper` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `masterjewelitemmapper` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `masterorder` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `masterorder` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `orderitems` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orderitems` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `processsteps` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `processsteps` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `productstocks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `productstocks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `scarpinfo` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `scarpinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attributevalue` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `balance` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `closingbalance` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `customerbalance` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `item` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `master_jewel_type` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `master_jewel_type_customer_value` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `masterjewelitemmapper` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `masterorder` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `orderitems` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `processsteps` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `productstocks` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `receipt` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `scarpinfo` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
