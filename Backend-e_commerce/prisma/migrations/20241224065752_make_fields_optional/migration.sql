/*
  Warnings:

  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Customer_email_key` ON `customer`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `address`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    ADD COLUMN `age` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `country` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `emailAddress` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL DEFAULT 'Not specified',
    ADD COLUMN `location` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    ADD COLUMN `phoneNumber` INTEGER NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL DEFAULT 'Unknown';

-- CreateIndex
CREATE UNIQUE INDEX `Customer_emailAddress_key` ON `Customer`(`emailAddress`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_phoneNumber_key` ON `Customer`(`phoneNumber`);
