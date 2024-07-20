/*
  Warnings:

  - You are about to drop the `ValidationCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ValidationCode` DROP FOREIGN KEY `ValidationCode_user_id_fkey`;

-- DropTable
DROP TABLE `ValidationCode`;

-- CreateTable
CREATE TABLE `CodigoValidacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,

    INDEX `CodigoValidacao_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CodigoValidacao` ADD CONSTRAINT `CodigoValidacao_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
