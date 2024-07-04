INSERT INTO Usuario (nome, email, cpf, senha, URLimagem) 
VALUES 
('João Silva', 'joao.silva@gmail.com', '123.456.789-00', 'senha552', NULL),
('Maria Oliveira', 'maria.oliveira@gmail.com', '987.654.321-00', 'senha321', NULL),
('Carlos Pereira', 'carlos.pereira@gmail.com', '456.123.789-11', 'senha446', NULL),
('Alice Silva', 'alice.silva@gmail.com', '123.456.789-01', 'senha123', NULL),
('Bob Oliveira', 'bob.oliveira@gmail.com', '234.567.890-12', 'senha456', NULL),
('Carlos Pereira', 'carlos.pereira@example.com', '345.678.901-23', 'senha789', NULL),
('Diana Costa', 'diana.costa@example.com', '456.789.012-34', 'senha012', NULL);


INSERT INTO Pesquisa (titulo, codigo, dataCriacao, dataTermino, ehPublico, descricao, criador, arquivado, URLimagem, ehVotacao)
VALUES
('Pesquisa de Satisfação', 'PESQ123456', '2024-06-01 12:00:00', '2024-06-15 12:00:00', 1, 'Pesquisa para avaliar a satisfação dos clientes.', 1, 0, NULL, 0),
('Pesquisa de Produtos', 'PESQ789012', '2024-06-05 12:00:00', '2024-06-20 12:00:00', 1, 'Pesquisa para avaliar a aceitação de novos produtos.', 2, 0, NULL, 0),
('Pesquisa de Feedback', 'PESQ345678', '2024-06-22 10:00:00', '2024-07-22 10:00:00', 1, 'Pesquisa para coletar feedback dos usuários.', 3, 0, NULL, 1),
('Pesquisa de Novos Produtos', 'PESQ901234', '2024-06-23 10:00:00', '2024-07-23 10:00:00', 1, 'Pesquisa sobre novos produtos.', 4, 0, NULL, 1),
('Votação DA ECOMP', 'VOT123456', '2024-06-25 15:53:39', '2024-06-27 15:53:42', 1, 'Votação das chapas do Diretório Acadêmico de Computação', 1, 0, NULL, 1);

INSERT INTO Pergunta (texto, URLimagem, pesquisa_id) 
VALUES
('Qual é o seu nível de satisfação com o nosso serviço?', NULL, 1),
('Você recomendaria nossos produtos para outras pessoas?', NULL, 1),
('Qual é o seu produto favorito?', NULL, 3),
('O que você achou do nosso atendimento?', NULL, 3),
('Quais novos produtos você gostaria de ver?', NULL, 4);


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
('2024-06-23 13:00:00', 'hashvoto012');


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
('Feedback');


INSERT INTO Tag_Pesquisa (tag_id, pesquisa_id) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 3),
(5, 4),
(2, 4);
