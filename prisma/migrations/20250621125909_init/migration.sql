/*
  Warnings:

  - Made the column `pewawancara_id` on table `jadwalwawancara` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `jadwalwawancara` DROP FOREIGN KEY `JadwalWawancara_pewawancara_id_fkey`;

-- DropIndex
DROP INDEX `JadwalWawancara_pewawancara_id_fkey` ON `jadwalwawancara`;

-- AlterTable
ALTER TABLE `jadwalwawancara` MODIFY `pewawancara_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pewawancara` MODIFY `kontak` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pewawancara_id_fkey` FOREIGN KEY (`pewawancara_id`) REFERENCES `Pewawancara`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
