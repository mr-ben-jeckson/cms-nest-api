-- AlterTable
ALTER TABLE `user` ADD COLUMN `profileId` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
