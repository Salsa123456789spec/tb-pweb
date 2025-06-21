/*
  Warnings:

  - The values [SATU,DUA,TIGA] on the enum `Pengumuman_tahapan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `pengumuman` ADD COLUMN `user_id` INTEGER NULL,
    MODIFY `tahapan` ENUM('tahap1', 'tahap2', 'tahap3') NULL;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
