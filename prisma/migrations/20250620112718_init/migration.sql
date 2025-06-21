-- CreateTable
CREATE TABLE `JadwalWawancara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `pewawancara` VARCHAR(191) NULL,
    `kontak_pewwc` INTEGER NULL,
    `ruang` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KomplainJadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwal_id` INTEGER NOT NULL,
    `alasan` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'menunggu',
    `tanggal_pengajuan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggal_diajukan` DATETIME(3) NULL,
    `waktu_diajukan` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KomplainJadwal` ADD CONSTRAINT `KomplainJadwal_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `JadwalWawancara`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
