-- CreateTable
CREATE TABLE `pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tahap1_status` VARCHAR(191) NOT NULL,
    `tahap2_status` VARCHAR(191) NOT NULL,
    `tahap3_status` VARCHAR(191) NOT NULL,
    `hasil_akhir` VARCHAR(191) NOT NULL,
    `tanggal_diumumkan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
