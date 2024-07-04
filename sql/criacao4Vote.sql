CREATE DATABASE IF NOT EXISTS `teste_4vote`;
USE `teste_4vote`;

CREATE TABLE IF NOT EXISTS `Opcao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pergunta_id` int NOT NULL,
  `texto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantVotos` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `Pergunta_Opcao` (`pergunta_id`),
  CONSTRAINT `Pergunta_Opcao` FOREIGN KEY (`pergunta_id`) REFERENCES `Pergunta` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Opcao_Votada` (
  `voto_id` int NOT NULL,
  `opcao_id` int NOT NULL,
  PRIMARY KEY (`voto_id`,`opcao_id`),
  KEY `Opcao_Opcoes_Votadas` (`opcao_id`),
  CONSTRAINT `Opcao_Opcoes_Votadas` FOREIGN KEY (`opcao_id`) REFERENCES `Opcao` (`id`),
  CONSTRAINT `Voto_Opcoes_Votadas` FOREIGN KEY (`voto_id`) REFERENCES `Voto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Participacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pesquisa_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Participacao_Pesquisa` (`pesquisa_id`),
  KEY `Usuario_Participacao` (`usuario_id`),
  CONSTRAINT `Participacao_Pesquisa` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa` (`id`),
  CONSTRAINT `Usuario_Participacao` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Pergunta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `URLimagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pesquisa_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pesquisa_Pergunta` (`pesquisa_id`),
  CONSTRAINT `Pesquisa_Pergunta` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Pesquisa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataCriacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dataTermino` timestamp NOT NULL,
  `ehPublico` tinyint(1) NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `criador` int NOT NULL,
  `arquivado` tinyint(1) NOT NULL DEFAULT '0',
  `URLimagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ehVotacao` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Pesquisa_ak_codigo` (`codigo`),
  KEY `Criar` (`criador`),
  CONSTRAINT `Criar` FOREIGN KEY (`criador`) REFERENCES `Usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_ak_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Tag_Pesquisa` (
  `tag_id` int NOT NULL,
  `pesquisa_id` int NOT NULL,
  PRIMARY KEY (`tag_id`,`pesquisa_id`),
  KEY `Pesquisa_Tags_Pesquisa` (`pesquisa_id`),
  CONSTRAINT `Pesquisa_Tags_Pesquisa` FOREIGN KEY (`pesquisa_id`) REFERENCES `Pesquisa` (`id`),
  CONSTRAINT `Tag_Tags_Pesquisa` FOREIGN KEY (`tag_id`) REFERENCES `Tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `URLimagem` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Usuario_ak_email` (`email`),
  UNIQUE KEY `Usuario_ak_cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Voto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` datetime NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
