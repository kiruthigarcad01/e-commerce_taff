/*
  Warnings:

  - You are about to alter the column `id` on the `admin` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `adminId` on the `product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_adminId_fkey`;

-- DropIndex
DROP INDEX `Product_adminId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `admin` MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropIndex
DROP INDEX `Admin_id_key` ON `admin`;

-- AlterTable
ALTER TABLE `product` MODIFY `adminId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
