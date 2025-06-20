-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('mahasiswa', 'admin', 'asisten_lab') NOT NULL,

    UNIQUE INDEX `User_nim_key`(`nim`),
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

-- AddForeignKey
ALTER TABLE `Pendaftaran` ADD CONSTRAINT `Pendaftaran_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
