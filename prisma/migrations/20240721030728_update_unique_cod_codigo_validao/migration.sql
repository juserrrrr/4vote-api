/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `CodigoValidacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usuario_id,pesquisa_id]` on the table `Participacao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `CodigoValidacao` MODIFY `codigo` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Voto` MODIFY `data` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE UNIQUE INDEX `codigo_ak_usuario` ON `CodigoValidacao`(`codigo`);

-- CreateIndex
CREATE UNIQUE INDEX `Participacao_usuario_id_pesquisa_id_key` ON `Participacao`(`usuario_id`, `pesquisa_id`);
