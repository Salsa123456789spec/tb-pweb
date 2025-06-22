/*
  Warnings:

  - A unique constraint covering the columns `[no_aslab]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `no_aslab` VARCHAR(191) NULL,
    MODIFY `nim` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_no_aslab_key` ON `User`(`no_aslab`);
