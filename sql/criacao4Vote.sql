-- Excluir o banco de dados existente
DROP DATABASE IF EXISTS nome_do_banco;

-- Criar um novo banco de dados
CREATE DATABASE nome_do_banco;

-- Selecionar o banco de dados para uso
USE nome_do_banco;

-- CreateTable
CREATE TABLE `Opcao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta_id` INTEGER NOT NULL,
    `texto` VARCHAR(255) NOT NULL,
    `quantVotos` INTEGER NOT NULL DEFAULT 0,

    INDEX `Pergunta_Opcao`(`pergunta_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Opcao_Votada` (
    `voto_id` INTEGER NOT NULL,
    `opcao_id` INTEGER NOT NULL,

    INDEX `Opcao_Opcoes_Votadas`(`opcao_id`),
    PRIMARY KEY (`voto_id`, `opcao_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Participacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pesquisa_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    INDEX `Participacao_Pesquisa`(`pesquisa_id`),
    INDEX `Usuario_Participacao`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pergunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(255) NOT NULL,
    `URLimagem` VARCHAR(255) NULL,
    `pesquisa_id` INTEGER NOT NULL,

    INDEX `Pesquisa_Pergunta`(`pesquisa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pesquisa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `codigo` VARCHAR(11) NOT NULL,
    `dataCriacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dataTermino` TIMESTAMP(0) NOT NULL,
    `ehPublico` BOOLEAN NOT NULL,
    `descricao` TEXT NULL,
    `criador` INTEGER NOT NULL,
    `arquivado` BOOLEAN NOT NULL DEFAULT false,
    `URLimagem` VARCHAR(255) NULL,
    `ehVotacao` BOOLEAN NOT NULL,

    UNIQUE INDEX `Pesquisa_ak_codigo`(`codigo`),
    INDEX `Criar`(`criador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Tag_ak_nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag_Pesquisa` (
    `tag_id` INTEGER NOT NULL,
    `pesquisa_id` INTEGER NOT NULL,

    INDEX `Pesquisa_Tags_Pesquisa`(`pesquisa_id`),
    PRIMARY KEY (`tag_id`, `pesquisa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `URLimagem` VARCHAR(255) NULL,

    UNIQUE INDEX `Usuario_ak_email`(`email`),
    UNIQUE INDEX `Usuario_ak_cpf`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(0) NOT NULL,
    `hash` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Opcao` ADD CONSTRAINT `Pergunta_Opcao` FOREIGN KEY (`pergunta_id`) REFERENCES `Pergunta`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Opcao_Votada` ADD CONSTRAINT `Opcao_Opcoes_Votadas` FOREIGN KEY (`opcao_id`) REFERENCES `Opcao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Opcao_Votada` ADD CONSTRAINT `Voto_Opcoes_Votadas` FOREIGN KEY (`voto_id`) REFERENCES `Voto`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Participacao` ADD CONSTRAINT `Participacao_Pesquisa` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Participacao` ADD CONSTRAINT `Usuario_Participacao` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pergunta` ADD CONSTRAINT `Pesquisa_Pergunta` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pesquisa` ADD CONSTRAINT `Criar` FOREIGN KEY (`criador`) REFERENCES `Usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tag_Pesquisa` ADD CONSTRAINT `Pesquisa_Tags_Pesquisa` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Tag_Pesquisa` ADD CONSTRAINT `Tag_Tags_Pesquisa` FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
