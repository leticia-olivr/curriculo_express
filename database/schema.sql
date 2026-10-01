CREATE TABLE IF NOT EXISTS pessoas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(30),
    cidade VARCHAR(120),
    estado VARCHAR(100),
    resumo TEXT,
    linkedin TEXT,
    github TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS formacoes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    instituicao VARCHAR(200) NOT NULL,
    curso VARCHAR(200) NOT NULL,
    grau VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status VARCHAR(50) NOT NULL,
    descricao TEXT,
    CONSTRAINT formacoes_datas_validas
        CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

CREATE TABLE IF NOT EXISTS experiencias_profissionais (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    empresa VARCHAR(200) NOT NULL,
    cargo VARCHAR(150) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    atual BOOLEAN NOT NULL DEFAULT FALSE,
    descricao TEXT,
    CONSTRAINT experiencias_datas_validas
        CHECK (data_fim IS NULL OR data_fim >= data_inicio),
    CONSTRAINT experiencia_atual_sem_data_fim
        CHECK (NOT atual OR data_fim IS NULL)
);

CREATE TABLE IF NOT EXISTS projetos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    tecnologias TEXT[] NOT NULL DEFAULT '{}',
    url TEXT,
    repositorio TEXT,
    data_inicio DATE,
    data_fim DATE,
    CONSTRAINT projetos_datas_validas
        CHECK (data_inicio IS NULL OR data_fim IS NULL OR data_fim >= data_inicio)
);

CREATE TABLE IF NOT EXISTS habilidades (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    nivel VARCHAR(50),
    categoria VARCHAR(100),
    CONSTRAINT habilidade_unica_por_pessoa UNIQUE (pessoa_id, nome)
);

CREATE TABLE IF NOT EXISTS certificacoes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pessoa_id BIGINT NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    instituicao VARCHAR(200) NOT NULL,
    data_conclusao DATE,
    validade DATE,
    url TEXT,
    CONSTRAINT certificacoes_datas_validas
        CHECK (
            data_conclusao IS NULL
            OR validade IS NULL
            OR validade >= data_conclusao
        )
);

CREATE INDEX IF NOT EXISTS formacoes_pessoa_id_idx
    ON formacoes (pessoa_id);
CREATE INDEX IF NOT EXISTS experiencias_profissionais_pessoa_id_idx
    ON experiencias_profissionais (pessoa_id);
CREATE INDEX IF NOT EXISTS projetos_pessoa_id_idx
    ON projetos (pessoa_id);
CREATE INDEX IF NOT EXISTS certificacoes_pessoa_id_idx
    ON certificacoes (pessoa_id);