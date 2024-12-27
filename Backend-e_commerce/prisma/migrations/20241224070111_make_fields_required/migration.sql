/*
  Warnings:

  - Made the column `emailAddress` on table `customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `emailAddress` VARCHAR(191) NOT NULL,
    MODIFY `phoneNumber` INTEGER NOT NULL;
