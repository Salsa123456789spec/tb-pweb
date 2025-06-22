/*
  Warnings:

  - You are about to drop the column `kategori` on the `tugas` table. All the data in the column will be lost.
  - You are about to drop the column `lampiran` on the `tugas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tugas` DROP COLUMN `kategori`,
    DROP COLUMN `lampiran`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `tahapan` ENUM('tahap1', 'tahap2', 'tahap3') NULL;

-- CreateTable
CREATE TABLE `Magang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `kelompok_id` INTEGER NOT NULL,

    UNIQUE INDEX `Magang_pendaftaran_id_key`(`pendaftaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kelompok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Magang` ADD CONSTRAINT `Magang_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Magang` ADD CONSTRAINT `Magang_kelompok_id_fkey` FOREIGN KEY (`kelompok_id`) REFERENCES `Kelompok`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelompok` ADD CONSTRAINT `Kelompok_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
