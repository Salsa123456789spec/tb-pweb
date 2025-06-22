-- DropForeignKey
ALTER TABLE `jadwalwawancara` DROP FOREIGN KEY `JadwalWawancara_pewawancara_id_fkey`;

-- DropIndex
DROP INDEX `JadwalWawancara_pewawancara_id_fkey` ON `jadwalwawancara`;

-- AlterTable
ALTER TABLE `jadwalwawancara` MODIFY `pewawancara_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pewawancara_id_fkey` FOREIGN KEY (`pewawancara_id`) REFERENCES `Pewawancara`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
