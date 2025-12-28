-- AlterTable
ALTER TABLE `packages` ADD COLUMN `kategori` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `packages_kategori_idx` ON `packages`(`kategori`);
