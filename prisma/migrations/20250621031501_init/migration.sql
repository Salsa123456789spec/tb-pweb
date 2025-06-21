-- CreateTable
CREATE TABLE `PengumpulanTugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tugas_id` INTEGER NOT NULL,
    `pendaftaran_id` INTEGER NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `tanggal_kumpul` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_tugas_id_fkey` FOREIGN KEY (`tugas_id`) REFERENCES `Tugas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
