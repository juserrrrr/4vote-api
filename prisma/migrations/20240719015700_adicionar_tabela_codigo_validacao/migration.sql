/*
  Warnings:

  - You are about to drop the column `code` on the `CodigoValidacao` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `CodigoValidacao` table. All the data in the column will be lost.
  - Added the required column `codigo` to the `CodigoValidacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `CodigoValidacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CodigoValidacao` DROP FOREIGN KEY `CodigoValidacao_user_id_fkey`;

-- AlterTable
ALTER TABLE `CodigoValidacao` DROP COLUMN `code`,
    DROP COLUMN `user_id`,
    ADD COLUMN `codigo` VARCHAR(191) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `CodigoValidacao_usuarioId_idx` ON `CodigoValidacao`(`usuarioId`);

-- AddForeignKey
ALTER TABLE `CodigoValidacao` ADD CONSTRAINT `CodigoValidacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
