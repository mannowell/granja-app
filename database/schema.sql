PRAGMA foreign_keys = ON;

-- Pavilhões
CREATE TABLE IF NOT EXISTS pavilhoes (
    numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 1 AND 7),
    status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'ocupado', 'manutencao')),
    lote_atual_id INTEGER,
    observacao TEXT
);

-- Lotes
CREATE TABLE IF NOT EXISTS lotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_entrada DATE NOT NULL,
    data_saida_prevista DATE NOT NULL,
    quantidade_inicial INTEGER NOT NULL,
    peso_medio_inicial DECIMAL(5,2),
    status TEXT CHECK (status IN ('ativo', 'finalizado', 'em_quarentena')),
    pavilhao_id INTEGER,
    FOREIGN KEY (pavilhao_id) REFERENCES pavilhoes (numero)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_pavilhao_id ON lotes(pavilhao_id);
CREATE INDEX IF NOT EXISTS idx_lote_atual ON pavilhoes(lote_atual_id);

-- Silos
CREATE TABLE IF NOT EXISTS silos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL,
    tipo_racao TEXT NOT NULL,
    capacidade_total DECIMAL(8,2) NOT NULL,
    nivel_atual DECIMAL(8,2) NOT NULL,
    ultima_recarga DATE
);

-- Manutenções
CREATE TABLE IF NOT EXISTS manutencoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    area TEXT NOT NULL,
    tipo_manutencao TEXT NOT NULL,
    data_programada DATE NOT NULL,
    data_conclusao DATE,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
    prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta')),
    observacoes TEXT,
    tipo_periodicidade TEXT DEFAULT 'unica' CHECK (tipo_periodicidade IN ('unica', 'diaria', 'semanal', 'mensal')),
    intervalo_dias INTEGER
);

-- Registros Sanitários
CREATE TABLE IF NOT EXISTS registros_sanitarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lote_id INTEGER REFERENCES lotes(id),
    tipo TEXT NOT NULL,
    descricao TEXT,
    data_registro DATE NOT NULL,
    data_prevista DATE,
    medicamento TEXT,
    dosagem TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluido'))
);

CREATE TABLE animais_status (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    data_medicao DATE NOT NULL,
    peso_medio DECIMAL(5,2),
    quantidade_atual INT,
    mortalidade_periodo INT,
    causa_mortalidade VARCHAR(100)
);

CREATE TABLE fases_producao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    peso_inicial DECIMAL(5,2),
    peso_final DECIMAL(5,2),
    consumo_diario_estimado DECIMAL(5,2)
);

CREATE TABLE mortalidade (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    data_morte DATE NOT NULL,
    quantidade INT NOT NULL,
    causa VARCHAR(100),
    observacoes TEXT
);

CREATE TABLE vacinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    intervalo_dias INT,
    idade_aplicacao_dias INT,
    descricao TEXT
);

CREATE TABLE vacinacao_lote (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    vacina_id INT REFERENCES vacinas(id),
    data_prevista DATE NOT NULL,
    data_aplicacao DATE,
    status VARCHAR(20) CHECK (status IN ('pendente', 'realizada', 'atrasada')),
    observacoes TEXT
);

CREATE TABLE medicamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    principio_ativo VARCHAR(100),
    unidade_medida VARCHAR(20),
    estoque_atual DECIMAL(8,2),
    estoque_minimo DECIMAL(8,2)
);

CREATE TABLE tratamentos (
    id SERIAL PRIMARY KEY,
    lote_id INT REFERENCES lotes(id),
    medicamento_id INT REFERENCES medicamentos(id),
    data_inicio DATE NOT NULL,
    data_fim DATE,
    dosagem VARCHAR(50),
    motivo TEXT,
    status VARCHAR(20) CHECK (status IN ('em_andamento', 'finalizado', 'cancelado'))
);

CREATE TABLE historico_recargas (
    id SERIAL PRIMARY KEY,
    silo_id INT REFERENCES silos(id),
    data_recarga DATE NOT NULL,
    quantidade DECIMAL(8,2) NOT NULL,
    nivel_anterior DECIMAL(8,2) NOT NULL,
    nivel_posterior DECIMAL(8,2) NOT NULL
); 