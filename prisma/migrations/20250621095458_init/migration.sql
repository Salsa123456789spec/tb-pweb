/*
  Warnings:

  - You are about to drop the column `kontak_pewwc` on the `jadwalwawancara` table. All the data in the column will be lost.
  - You are about to drop the column `pewawancara` on the `jadwalwawancara` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `jadwalwawancara` DROP COLUMN `kontak_pewwc`,
    DROP COLUMN `pewawancara`,
    ADD COLUMN `pewawancara_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `Pewawancara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kontak` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pewawancara_id_fkey` FOREIGN KEY (`pewawancara_id`) REFERENCES `Pewawancara`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
