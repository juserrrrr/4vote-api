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


INSERT INTO Usuario (nome, email, cpf, senha, URLimagem) 
VALUES 
('João Silva', 'joao.silva@gmail.com', '123.456.789-00', 'senha552', NULL),
('Maria Oliveira', 'maria.oliveira@gmail.com', '987.654.321-00', 'senha321', NULL),
('Carlos Pereira', 'carlos.pereira@gmail.com', '456.123.789-11', 'senha446', NULL),
('Alice Silva', 'alice.silva@gmail.com', '123.456.789-01', 'senha123', NULL),
('Bob Oliveira', 'bob.oliveira@gmail.com', '234.567.890-12', 'senha456', NULL),
('Carlos Pereira', 'carlos.pereira@example.com', '345.678.901-23', 'senha789', NULL),
('Diana Costa', 'diana.costa@example.com', '456.789.012-34', 'senha012', NULL),
('Roberto Oliveira', 'roberto.oliveira@gmail.com', '895.854.963-99', 'senha888', NULL), 
('Fernanda Gomes', 'fernanda.gomes@gmail.com', '567.890.123-45', 'senha999', NULL),
('Igor Santos', 'igor.santos@gmail.com', '678.901.234-56', 'senha111', NULL),
('Patricia Lima', 'patricia.lima@gmail.com', '789.012.345-67', 'senha222', NULL),
('Leonardo Souza', 'leonardo.souza@gmail.com', '890.123.456-78', 'senha333', NULL),
('Gabriela Rocha', 'gabriela.rocha@gmail.com', '901.234.567-89', 'senha444', NULL),
('Mateus Ribeiro', 'mateus.ribeiro@gmail.com', '012.345.678-90', 'senha555', NULL),
('Larissa Costa', 'larissa.costa@gmail.com', '123.456.789-12', 'senha666', NULL),
('Juliana Dias', 'juliana.dias@gmail.com', '234.567.890-23', 'senha777', NULL),
('Felipe Martins', 'felipe.martins@gmail.com', '345.678.901-34', 'senha888', NULL),
('Renata Almeida', 'renata.almeida@gmail.com', '456.789.012-45', 'senha999', NULL),
('Thiago Fernandes', 'thiago.fernandes@gmail.com', '567.890.123-56', 'senha000', NULL),
('Marcela Souza', 'marcela.souza@gmail.com', '678.901.234-67', 'senha1111', NULL);

INSERT INTO Pesquisa (titulo, codigo, dataCriacao, dataTermino, ehPublico, descricao, criador, arquivado, URLimagem, ehVotacao)
VALUES
('Pesquisa de Satisfação', 'PESQ123456', '2024-06-01 12:00:00', '2024-06-15 12:00:00', 1, 'Pesquisa para avaliar a satisfação dos clientes.', 1, 0, NULL, 0),
('Pesquisa de Produtos', 'PESQ789012', '2024-06-05 12:00:00', '2024-06-20 12:00:00', 1, 'Pesquisa para avaliar a aceitação de novos produtos.', 2, 0, NULL, 0),
('Pesquisa de Feedback', 'PESQ345678', '2024-06-22 10:00:00', '2024-07-22 10:00:00', 1, 'Pesquisa para coletar feedback dos usuários.', 3, 0, NULL, 1),
('Pesquisa de Novos Produtos', 'PESQ901234', '2024-06-23 10:00:00', '2024-07-23 10:00:00', 1, 'Pesquisa sobre novos produtos.', 4, 0, NULL, 1),
('Votação DA ECOMP', 'VOT123456', '2024-06-25 15:53:39', '2024-06-27 15:53:42', 1, 'Votação das chapas do Diretório Acadêmico de Computação', 1, 0, NULL, 1),
('Pesquisa de Mercado', 'PESQ567890', '2024-07-01 09:00:00', '2024-07-15 09:00:00', 1, 'Pesquisa para entender as tendências de mercado.', 5, 0, NULL, 0),
('Pesquisa de Satisfação Interna', 'PESQ234567', '2024-07-05 08:30:00', '2024-07-20 08:30:00', 1, 'Pesquisa para avaliar a satisfação dos funcionários.', 6, 0, NULL, 0),
('Pesquisa de Engajamento', 'PESQ678901', '2024-07-10 14:00:00', '2024-07-25 14:00:00', 1, 'Pesquisa para medir o engajamento dos usuários.', 7, 0, NULL, 0),
('Pesquisa de Inovação', 'PESQ345679', '2024-07-15 10:00:00', '2024-07-30 10:00:00', 1, 'Pesquisa para avaliar ideias inovadoras.', 8, 0, NULL, 0),
('Pesquisa de Qualidade', 'PESQ012345', '2024-07-20 11:00:00', '2024-08-05 11:00:00', 1, 'Pesquisa para avaliar a qualidade dos serviços.', 9, 0, NULL, 0),
('Votação Conselho Estudantil', 'VOT789012', '2024-07-25 16:00:00', '2024-07-28 16:00:00', 1, 'Votação para eleger os membros do Conselho Estudantil.', 2, 0, NULL, 1),
('Pesquisa de Desenvolvimento', 'PESQ456789', '2024-08-01 12:00:00', '2024-08-15 12:00:00', 1, 'Pesquisa para identificar áreas de desenvolvimento.', 10, 0, NULL, 0),
('Pesquisa de Preferências', 'PESQ678902', '2024-08-05 10:30:00', '2024-08-20 10:30:00', 1, 'Pesquisa para entender as preferências dos usuários.', 11, 0, NULL, 0),
('Votação de Projeto', 'VOT345678', '2024-08-10 09:00:00', '2024-08-15 09:00:00', 1, 'Votação para aprovação de novos projetos.', 3, 0, NULL, 1),
('Pesquisa de Atendimento', 'PESQ890123', '2024-08-15 14:30:00', '2024-08-30 14:30:00', 1, 'Pesquisa para avaliar o atendimento ao cliente.', 12, 0, NULL, 0),
('Pesquisa de Usabilidade', 'PESQ234568', '2024-08-20 11:00:00', '2024-09-05 11:00:00', 1, 'Pesquisa para medir a usabilidade do sistema.', 13, 0, NULL, 0),
('Pesquisa de Satisfação dos Parceiros', 'PESQ678903', '2024-08-25 15:00:00', '2024-09-10 15:00:00', 1, 'Pesquisa para avaliar a satisfação dos parceiros.', 14, 0, NULL, 0),
('Votação Presidente da Empresa', 'VOT012345', '2024-08-30 16:00:00', '2024-09-02 16:00:00', 1, 'Votação para eleger o novo presidente da empresa.', 4, 0, NULL, 1),
('Pesquisa de Sustentabilidade', 'PESQ345680', '2024-09-05 12:00:00', '2024-09-20 12:00:00', 1, 'Pesquisa para entender a opinião sobre sustentabilidade.', 15, 0, NULL, 0),
('Pesquisa de Tecnologia', 'PESQ567891', '2024-09-10 10:00:00', '2024-09-25 10:00:00', 1, 'Pesquisa para avaliar o uso de novas tecnologias.', 16, 0, NULL, 0);

INSERT INTO Pergunta (texto, URLimagem, pesquisa_id) 
VALUES
('Qual é o seu nível de satisfação com o nosso serviço?', NULL, 1),
('Você recomendaria nossos produtos para outras pessoas?', NULL, 1),
('Qual é o seu produto favorito?', NULL, 3),
('O que você achou do nosso atendimento?', NULL, 3),
('Quais novos produtos você gostaria de ver?', NULL, 4),
('Como podemos melhorar nosso serviço?', NULL, 1),
('Você está satisfeito com a variedade de produtos oferecidos?', NULL, 1),
('Quais são os pontos fortes dos nossos produtos?', NULL, 3),
('O que podemos fazer para melhorar nosso atendimento?', NULL, 3),
('Você considera importante a adição de produtos sustentáveis?', NULL, 4),
('Quais funcionalidades adicionais você gostaria de ver no nosso produto?', NULL, 4),
('Qual é a sua opinião sobre a organização do evento?', NULL, 5),
('Você participaria novamente de um evento como este?', NULL, 5),
('Quais são os principais desafios que você enfrenta no seu dia a dia?', NULL, 6),
('Como podemos ajudar a tornar seu trabalho mais eficiente?', NULL, 6),
('Qual é a sua opinião sobre a iniciativa X da empresa?', NULL, 7),
('Você tem sugestões para melhorar a comunicação interna?', NULL, 7),
('Quais são as suas expectativas em relação aos próximos lançamentos de produtos?', NULL, 8),
('Você gostaria de participar de testes de novos produtos?', NULL, 8),
('Você acredita que as políticas atuais são eficazes?', NULL, 9),
('Como podemos promover um ambiente de trabalho mais inclusivo?', NULL, 9),
('Qual é a sua opinião sobre o novo sistema implementado?', NULL, 10),
('Você tem sugestões para aprimorar a usabilidade?', NULL, 10),
('Quais são os principais aspectos que influenciam sua decisão de compra?', NULL, 11),
('Você prefere comprar online ou em lojas físicas?', NULL, 11);



INSERT INTO Opcao (pergunta_id, texto, quantVotos) 
VALUES
(1, 'Muito satisfeito', 0),
(1, 'Satisfeito', 0),
(1, 'Neutro', 0),
(1, 'Insatisfeito', 0),
(1, 'Muito insatisfeito', 0),
(2, 'Sim', 0),
(2, 'Não', 0),
(3, 'Produto A', 0),
(3, 'Produto B', 0),
(3, 'Produto C', 0),
(4, 'Excelente', 0),
(4, 'Bom', 0),
(4, 'Razoável', 0),
(4, 'Ruim', 0),
(5, 'Cabo USB', 0),
(5, 'SSD', 0),
(5, 'Monitor', 0);


INSERT INTO Voto (data, hash) VALUES
('2024-06-10 12:00:00', 'hash1'),
('2024-06-11 13:00:00', 'hash2'),
('2024-06-21 10:00:00', 'hashvoto123'),
('2024-06-21 11:00:00', 'hashvoto456'),
('2024-06-22 12:00:00', 'hashvoto789'),
('2024-06-23 13:00:00', 'hashvoto012'),
('2024-06-24 14:00:00', 'hash3'),
('2024-06-25 15:00:00', 'hash4'),
('2024-06-26 16:00:00', 'hash5'),
('2024-06-27 17:00:00', 'hash6'),
('2024-06-28 18:00:00', 'hash7'),
('2024-06-29 19:00:00', 'hash8'),
('2024-06-30 20:00:00', 'hash9'),
('2024-07-01 21:00:00', 'hash10'),
('2024-07-02 22:00:00', 'hash11'),
('2024-07-03 23:00:00', 'hash12'),
('2024-07-04 00:00:00', 'hash13'),
('2024-07-05 01:00:00', 'hash14'),
('2024-07-06 02:00:00', 'hash15');


INSERT INTO Opcao_Votada (voto_id, opcao_id) VALUES
(1, 1),
(1, 6),
(2, 2),
(2, 7),
(3, 6),
(3, 7),
(4, 9),
(4, 10);


INSERT INTO Participacao (pesquisa_id, usuario_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 3),
(4, 4),
(3, 4),
(4, 1);


INSERT INTO Tag (nome) VALUES
('Satisfação'),
('Produtos'),
('Qualidade'),
('Preferências'),
('Feedback'),
('Atendimento'),
('Inovação'),
('Usabilidade'),
('Mercado'),
('Tecnologia'),
('Política');

INSERT INTO Tag_Pesquisa (tag_id, pesquisa_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 3),
(5, 4),
(2, 4);
