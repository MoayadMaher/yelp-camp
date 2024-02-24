/*
  Warnings:

  - You are about to drop the column `image` on the `Campground` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Campground` DROP COLUMN `image`;

-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(1000) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `campgroundId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_campgroundId_fkey` FOREIGN KEY (`campgroundId`) REFERENCES `Campground`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
