CREATE TABLE IF NOT EXISTS pavilhoes (
    numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 1 AND 7),
    status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'ocupado', 'manutencao')),
    lote_atual_id INTEGER,
    observacao TEXT
);

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

CREATE INDEX idx_pavilhao_id ON lotes(pavilhao_id);
CREATE INDEX idx_lote_atual ON pavilhoes(lote_atual_id);

CREATE TABLE IF NOT EXISTS animais_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lote_id INTEGER REFERENCES lotes(id),
    data_medicao DATE NOT NULL,
    peso_medio DECIMAL(5,2),
    quantidade_atual INTEGER,
    mortalidade_periodo INTEGER,
    causa_mortalidade TEXT
);

CREATE TABLE IF NOT EXISTS silos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero INTEGER NOT NULL,
    tipo_racao TEXT NOT NULL,
    capacidade_total DECIMAL(8,2) NOT NULL,
    nivel_atual DECIMAL(8,2) NOT NULL,
    ultima_recarga DATE
);

CREATE TABLE IF NOT EXISTS historico_recargas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    silo_id INTEGER REFERENCES silos(id),
    data_recarga DATE NOT NULL,
    quantidade DECIMAL(8,2) NOT NULL,
    nivel_anterior DECIMAL(8,2) NOT NULL,
    nivel_posterior DECIMAL(8,2) NOT NULL
);

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