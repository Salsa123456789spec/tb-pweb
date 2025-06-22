/*
  Warnings:

  - A unique constraint covering the columns `[tugas_id,pendaftaran_id]` on the table `PengumpulanTugas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PengumpulanTugas_tugas_id_pendaftaran_id_key` ON `PengumpulanTugas`(`tugas_id`, `pendaftaran_id`);
