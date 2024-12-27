/*
  Warnings:

  - You are about to drop the column `email` on the `admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Admin_email_key` ON `admin`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `email`,
    ADD COLUMN `emailAddress` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_emailAddress_key` ON `Admin`(`emailAddress`);
