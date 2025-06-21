-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NULL,
    `no_aslab` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('mahasiswa', 'admin', 'asisten_lab') NOT NULL,

    UNIQUE INDEX `User_nim_key`(`nim`),
    UNIQUE INDEX `User_no_aslab_key`(`no_aslab`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pendaftaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `domisili` VARCHAR(100) NOT NULL,
    `asal` VARCHAR(100) NOT NULL,
    `nomor_whatsapp` VARCHAR(20) NOT NULL,
    `divisi` VARCHAR(100) NOT NULL,
    `CV_file` VARCHAR(255) NOT NULL,
    `KRS_file` VARCHAR(255) NOT NULL,
    `KHS_file` VARCHAR(255) NOT NULL,
    `surat_permohonan_file` VARCHAR(255) NOT NULL,
    `alasan` TEXT NULL,
    `pernyataan` BOOLEAN NOT NULL,
    `status` ENUM('menunggu', 'diterima', 'ditolak') NOT NULL DEFAULT 'menunggu',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalWawancara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `pewawancara_id` INTEGER NULL,
    `ruang` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pewawancara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kontak` VARCHAR(191) NOT NULL,

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

-- CreateTable
CREATE TABLE `Pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `pendaftaran_id` INTEGER NOT NULL,
    `tahapan` ENUM('tahap1', 'tahap2', 'tahap3') NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `deadline` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengumpulanTugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tugas_id` INTEGER NOT NULL,
    `pendaftaran_id` INTEGER NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `tanggal_kumpul` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('terkumpul', 'terlambat', 'belum_terkumpul') NOT NULL DEFAULT 'belum_terkumpul',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pertanyaan` VARCHAR(191) NOT NULL,
    `jawaban` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pewawancara_id_fkey` FOREIGN KEY (`pewawancara_id`) REFERENCES `Pewawancara`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KomplainJadwal` ADD CONSTRAINT `KomplainJadwal_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `JadwalWawancara`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_tugas_id_fkey` FOREIGN KEY (`tugas_id`) REFERENCES `Tugas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
