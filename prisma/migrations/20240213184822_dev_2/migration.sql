/*
  Warnings:

  - Made the column `price` on table `Campground` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Campground` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Campground` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Campground` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Campground` MODIFY `price` DECIMAL(65, 30) NOT NULL,
    MODIFY `description` VARCHAR(255) NOT NULL,
    MODIFY `location` VARCHAR(191) NOT NULL,
    MODIFY `image` VARCHAR(191) NOT NULL;
