/*
  Warnings:

  - You are about to drop the column `hasil_akhir` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to drop the column `tahap1_status` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to drop the column `tahap2_status` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to drop the column `tahap3_status` on the `pengumuman` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal_diumumkan` on the `pengumuman` table. All the data in the column will be lost.
  - Added the required column `pendaftaran_id` to the `Pengumuman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `pengumuman` DROP FOREIGN KEY `pengumuman_user_id_fkey`;

-- AlterTable
ALTER TABLE `pengumuman` DROP COLUMN `hasil_akhir`,
    DROP COLUMN `tahap1_status`,
    DROP COLUMN `tahap2_status`,
    DROP COLUMN `tahap3_status`,
    DROP COLUMN `tanggal_diumumkan`,
    ADD COLUMN `pendaftaran_id` INTEGER NOT NULL,
    ADD COLUMN `tahapan` ENUM('tahap1', 'tahap2', 'tahap3') NULL;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
