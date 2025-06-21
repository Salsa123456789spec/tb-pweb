-- AlterTable
ALTER TABLE `pengumpulantugas` ADD COLUMN `status` ENUM('terkumpul', 'terlambat', 'belum_terkumpul') NOT NULL DEFAULT 'belum_terkumpul';
