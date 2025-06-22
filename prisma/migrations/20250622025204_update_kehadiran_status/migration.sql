/*
  Warnings:

  - The values [Izin,Alfa] on the enum `kehadiran_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `kehadiran` MODIFY `status` ENUM('Hadir', 'Tidak_Hadir') NOT NULL;
