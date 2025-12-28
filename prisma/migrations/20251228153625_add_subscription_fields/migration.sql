-- AlterTable
ALTER TABLE `payments` ADD COLUMN `paymentType` VARCHAR(191) NOT NULL DEFAULT 'package',
    MODIFY `package_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subscriptionEnd` DATETIME(3) NULL,
    ADD COLUMN `subscriptionStart` DATETIME(3) NULL,
    ADD COLUMN `subscriptionStatus` VARCHAR(191) NOT NULL DEFAULT 'inactive';
