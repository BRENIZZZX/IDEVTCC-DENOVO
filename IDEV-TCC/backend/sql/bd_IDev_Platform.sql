USE MASTER 
IF EXISTS(SELECT * FROM SYS.databases WHERE NAME = 'bd_IDev_Platform')
DROP DATABASE bd_IDev_Platform
GO

CREATE DATABASE bd_IDev_Platform
GO

USE bd_IDev_Platform
GO

-- Tabela de usuários
CREATE TABLE USUARIO(
    ID INT IDENTITY(1001, 1) PRIMARY KEY,
    NOME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) NOT NULL UNIQUE,
    SENHA VARCHAR(255) NOT NULL,
    TIPO VARCHAR(20) NOT NULL, -- 'profissional' ou 'empresa'
    TELEFONE VARCHAR(15) NULL,
    FOTO_PERFIL VARCHAR(255) NULL,
    BIO TEXT NULL,
    GITHUB_URL VARCHAR(255) NULL,
    LINKEDIN_URL VARCHAR(255) NULL,
    INSTAGRAM_URL VARCHAR(255) NULL,
    TWITTER_URL VARCHAR(255) NULL,
    SITE_URL VARCHAR(255) NULL,
    COD_STATUS BIT DEFAULT 1 -- 1=ativo, 0=inativo (soft delete)
)
GO

-- COMENTADO: Tabela de projetos não está sendo utilizada no momento
-- Funcionalidade de projetos pode ser reativada no futuro
/*
CREATE TABLE PROJETO(
    ID INT IDENTITY PRIMARY KEY,
    TITULO VARCHAR(200) NOT NULL,
    DESCRICAO TEXT NOT NULL,
    EMPRESA_ID INT NOT NULL,
    PROFISSIONAL_ID INT NULL,
    ORCAMENTO_MIN DECIMAL(10,2) NULL,
    ORCAMENTO_MAX DECIMAL(10,2) NULL,
    STATUS VARCHAR(20) DEFAULT 'ABERTO',
    COD_STATUS BIT DEFAULT 1, -- 1=ativo, 0=inativo (soft delete)
    
    FOREIGN KEY (EMPRESA_ID) REFERENCES USUARIO(ID),
    FOREIGN KEY (PROFISSIONAL_ID) REFERENCES USUARIO(ID)
)
GO
*/

-- COMENTADO: Tabela de requests vinculados a projetos não está sendo utilizada
-- FUNCIONALIDADE DESATIVADA: REQUEST vinculado a PROJETOS não está mais sendo utilizado
-- Tabela mantida comentada para possível reativação futura
/*
CREATE TABLE REQUEST(
    ID BIGINT IDENTITY PRIMARY KEY,
    REMETENTE_ID INT NOT NULL, -- Quem envia
    DESTINATARIO_ID INT NOT NULL, -- Quem recebe
    PROJETO_ID INT NOT NULL, -- Projeto obrigatório (comunicação pós-projeto)
    CATEGORIA VARCHAR(20) NOT NULL, -- reclamacao, sugestao, elogio
    MENSAGEM TEXT NOT NULL,
    ANEXO VARCHAR(500) NULL, -- Link ou imagem
    DATA_ENVIO DATETIME DEFAULT GETDATE(),
    COD_STATUS BIT DEFAULT 1,
    
    FOREIGN KEY (REMETENTE_ID) REFERENCES USUARIO(ID),
    FOREIGN KEY (DESTINATARIO_ID) REFERENCES USUARIO(ID),
    FOREIGN KEY (PROJETO_ID) REFERENCES PROJETO(ID)
)
GO
*/
-- Tabela de mensagens 
CREATE TABLE MENSAGEM (
    id INT IDENTITY(1,1) PRIMARY KEY,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    anexo VARCHAR(500),
    data_envio DATETIME DEFAULT GETDATE(),
    lida BIT DEFAULT 0,
    ignorada BIT DEFAULT 0,
    cod_status BIT DEFAULT 1,
    FOREIGN KEY (remetente_id) REFERENCES USUARIO(id),
    FOREIGN KEY (destinatario_id) REFERENCES USUARIO(id)
)
GO

-- COMENTADO: Tabela de candidaturas vinculada a projetos não está sendo utilizada
/*
CREATE TABLE CANDIDATURA (
    id INT IDENTITY(1,1) PRIMARY KEY,
    projeto_id INT NOT NULL,
    profissional_id INT NOT NULL,
    data_candidatura DATETIME DEFAULT GETDATE(),
    status VARCHAR(20) DEFAULT 'PENDENTE', -- PENDENTE, ACEITA, REJEITADA
    cod_status BIT DEFAULT 1,
    FOREIGN KEY (projeto_id) REFERENCES PROJETO(id),
    FOREIGN KEY (profissional_id) REFERENCES USUARIO(id)
)
GO
*/

-- Inserir usuários (dados de exemplo)
INSERT INTO USUARIO (NOME, EMAIL, SENHA, TIPO, TELEFONE, FOTO_PERFIL, BIO, GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, SITE_URL, COD_STATUS) 
VALUES ('Samuel Nascimento', 'samuel@email.com', 'senha123', 'profissional', '(11) 99999-9999', '/assets/gato-de-terno-suit-cat.png', 'Desenvolvedor Full Stack especializado em React e Node.js', 'https://github.com/samuel', NULL, NULL, NULL, NULL, 1)
GO

INSERT INTO USUARIO (NOME, EMAIL, SENHA, TIPO, TELEFONE, FOTO_PERFIL, BIO, GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, SITE_URL, COD_STATUS) 
VALUES ('Carlos Mendes', 'carlos@email.com', 'senha123', 'profissional', '(21) 88888-8888', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Engenheiro DevOps especializado em AWS e Docker', 'https://github.com/carlos', NULL, NULL, NULL, NULL, 1)
GO

INSERT INTO USUARIO (NOME, EMAIL, SENHA, TIPO, TELEFONE, FOTO_PERFIL, BIO, GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, SITE_URL, COD_STATUS) 
VALUES ('Ana TechStart', 'ana@techstart.com', 'senha123', 'empresa', '(11) 55555-5555', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1)
GO

INSERT INTO USUARIO (NOME, EMAIL, SENHA, TIPO, TELEFONE, FOTO_PERFIL, BIO, GITHUB_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, SITE_URL, COD_STATUS) 
VALUES ('Inovação Digital SA', 'joao@inovacao.com', 'senha123', 'empresa', '(21) 44444-4444', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1)
GO

-- Consultas úteis
SELECT * FROM USUARIO
SELECT * FROM MENSAGEM
SELECT * FROM NOTIFICACAO
-- COMENTADO: Tabelas não utilizadas
-- SELECT * FROM PROJETO
-- SELECT * FROM CANDIDATURA
-- SELECT * FROM REQUEST

-- Adicionar colunas de localizacao e disponibilidade ao USUARIO
ALTER TABLE USUARIO ADD LOCALIZACAO VARCHAR(100) NULL
GO
ALTER TABLE USUARIO ADD DISPONIBILIDADE VARCHAR(20) DEFAULT 'DISPONIVEL'
GO

-- Tabela de notificações
CREATE TABLE NOTIFICACAO (
    ID           BIGINT       IDENTITY(1,1) PRIMARY KEY,
    USUARIO_ID   INT          NOT NULL,
    TITULO       VARCHAR(100) NOT NULL,
    DESCRICAO    TEXT         NOT NULL,
    ICONE        NVARCHAR(10) DEFAULT N'🔔',
    TIPO         VARCHAR(30)  DEFAULT 'GERAL',
    LIDA         BIT          DEFAULT 0,
    DATA_CRIACAO DATETIME     DEFAULT GETDATE(),
    COD_STATUS   BIT          DEFAULT 1,

    FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO(ID)
)
GO

USE bd_IDev_Platform
GO
ALTER TABLE USUARIO ADD LOCALIZACAO VARCHAR(100) NULL
GO
ALTER TABLE USUARIO ADD DISPONIBILIDADE VARCHAR(20) DEFAULT 'DISPONIVEL'
GO

USE bd_IDev_Platform
GO
UPDATE USUARIO SET SENHA = '$2a$10$opuCxlxkYEodzLfN31yenOjE3vMVgC4LaqWCsesJkP/.YoodezCrO' WHERE COD_STATUS = 1
GO

INSERT INTO NOTIFICACAO (USUARIO_ID, TITULO, DESCRICAO, ICONE, TIPO, LIDA, DATA_CRIACAO, COD_STATUS)
VALUES 
(1001, 'Nova mensagem', 'Você recebeu uma mensagem de uma empresa.', '💬', 'MENSAGEM', 0, GETDATE(), 1),
(1001, 'Nova proposta', 'Uma empresa enviou uma proposta para você.', '💼', 'PROPOSTA', 0, GETDATE(), 1),
(1001, 'Avaliação recebida', 'Você recebeu uma nova avaliação.', '⭐', 'AVALIACAO', 1, GETDATE(), 1);


SELECT ID, NOME, FOTO_PERFIL FROM USUARIO WHERE ID IN (1001)
