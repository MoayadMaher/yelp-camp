/*
  Warnings:

  - Added the required column `authorId` to the `Campground` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Campground` ADD COLUMN `authorId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `authorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Campground` ADD CONSTRAINT `Campground_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
