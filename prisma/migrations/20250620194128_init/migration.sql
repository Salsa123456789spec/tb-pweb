/*
  Warnings:

  - You are about to alter the column `CV_file` on the `pendaftaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `KRS_file` on the `pendaftaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `KHS_file` on the `pendaftaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `surat_permohonan_file` on the `pendaftaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[user_id]` on the table `Pendaftaran` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pendaftaran` MODIFY `domisili` VARCHAR(191) NOT NULL,
    MODIFY `asal` VARCHAR(191) NOT NULL,
    MODIFY `nomor_whatsapp` VARCHAR(191) NOT NULL,
    MODIFY `divisi` VARCHAR(191) NOT NULL,
    MODIFY `CV_file` VARCHAR(191) NOT NULL,
    MODIFY `KRS_file` VARCHAR(191) NOT NULL,
    MODIFY `KHS_file` VARCHAR(191) NOT NULL,
    MODIFY `surat_permohonan_file` VARCHAR(191) NOT NULL,
    MODIFY `alasan` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `tahapan` ENUM('SATU', 'DUA', 'TIGA') NULL,

    UNIQUE INDEX `Pengumuman_pendaftaran_id_key`(`pendaftaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback_Kuisioner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `kejelasan_soal` INTEGER NOT NULL,
    `alokasi_waktu` INTEGER NOT NULL,
    `kondisi_ruangan` INTEGER NOT NULL,
    `profesionalisme_pewawancara` INTEGER NOT NULL,
    `bimbingan_arahan` INTEGER NOT NULL,
    `supervisi` INTEGER NOT NULL,
    `kualitas_mentoring` INTEGER NOT NULL,
    `proses_keseluruhan` INTEGER NOT NULL,
    `saran` VARCHAR(191) NULL,
    `kesan_pesan` VARCHAR(191) NULL,

    UNIQUE INDEX `Feedback_Kuisioner_pendaftaran_id_key`(`pendaftaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `tanggal_upload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JadwalWawancara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `pewawancara` VARCHAR(191) NULL,
    `kontak_pewwc` INTEGER NULL,
    `ruang` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NULL,

    UNIQUE INDEX `JadwalWawancara_pendaftaran_id_key`(`pendaftaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Magang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `kelompok_id` INTEGER NOT NULL,
    `mulai` DATETIME(3) NULL,
    `selesai` DATETIME(3) NULL,

    UNIQUE INDEX `Magang_pendaftaran_id_key`(`pendaftaran_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kelompok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `kuota` INTEGER NOT NULL,
    `mentor` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FAQ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pertanyaan` VARCHAR(191) NOT NULL,
    `jawaban` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penilaian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengumpulan_id` INTEGER NOT NULL,
    `nilai` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NULL,

    UNIQUE INDEX `Penilaian_pengumpulan_id_key`(`pengumpulan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diskusi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `pesan` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kehadiran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `pertemuan` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `status` ENUM('Hadir', 'Izin', 'Alfa') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kelulusan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaran_id` INTEGER NOT NULL,
    `nilai` INTEGER NOT NULL,
    `divisi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Kelulusan_pendaftaran_id_key`(`pendaftaran_id`),
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

-- CreateIndex
CREATE UNIQUE INDEX `Pendaftaran_user_id_key` ON `Pendaftaran`(`user_id`);

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback_Kuisioner` ADD CONSTRAINT `Feedback_Kuisioner_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materi` ADD CONSTRAINT `Materi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_tugas_id_fkey` FOREIGN KEY (`tugas_id`) REFERENCES `Tugas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengumpulanTugas` ADD CONSTRAINT `PengumpulanTugas_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalWawancara` ADD CONSTRAINT `JadwalWawancara_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Magang` ADD CONSTRAINT `Magang_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Magang` ADD CONSTRAINT `Magang_kelompok_id_fkey` FOREIGN KEY (`kelompok_id`) REFERENCES `Kelompok`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penilaian` ADD CONSTRAINT `Penilaian_pengumpulan_id_fkey` FOREIGN KEY (`pengumpulan_id`) REFERENCES `PengumpulanTugas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diskusi` ADD CONSTRAINT `Diskusi_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelulusan` ADD CONSTRAINT `Kelulusan_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `Pendaftaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KomplainJadwal` ADD CONSTRAINT `KomplainJadwal_jadwal_id_fkey` FOREIGN KEY (`jadwal_id`) REFERENCES `JadwalWawancara`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
