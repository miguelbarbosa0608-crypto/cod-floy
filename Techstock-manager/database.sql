
PRAGMA foreign_keys = ON;

-- 1. CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE
);

-- 2. FORNECEDORES
CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razao_social VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150)
);

-- 3. PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    classificacao VARCHAR(20) NOT NULL
        CHECK (classificacao IN ('Hardware', 'Software', 'Periférico')),
    especificacao TEXT,
    modalidade_licenciamento VARCHAR(50),
    valor_unitario DECIMAL(10,2) NOT NULL CHECK (valor_unitario > 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
    localizacao VARCHAR(150),
    categoria_id INTEGER NOT NULL,
    fornecedor_id INTEGER NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE RESTRICT
);

-- 4. MOVIMENTACOES
CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('Entrada', 'Saida')),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- CATEGORIAS INICIAIS
INSERT OR IGNORE INTO categorias (nome) VALUES
('Armazenamento'),
('Processamento'),
('Suítes de Escritório'),
('Sistemas Operacionais');

-- FORNECEDORES INICIAIS
INSERT OR IGNORE INTO fornecedores
(razao_social, cnpj, telefone, email) VALUES
('Tech Distribuidora Ltda', '11.222.333/0001-44', '(11) 3333-4444', 'contato@tech.com'),
('Info Corporativa Ltda', '22.333.444/0001-55', '(11) 4444-5555', 'vendas@info.com'),
('Digital Solutions Ltda', '33.444.555/0001-66', '(11) 5555-6666', 'suporte@digital.com');

-- PRODUTOS INICIAIS
INSERT OR IGNORE INTO produtos
(sku, nome, fabricante, classificacao, especificacao,
 modalidade_licenciamento, valor_unitario, estoque,
 estoque_minimo, localizacao, categoria_id, fornecedor_id)
VALUES
('HW001', 'SSD NVMe 1TB', 'Kingston', 'Hardware', 'SSD de 1TB', NULL, 450, 15, 5, 'Prateleira A1', 1, 1),
('HW002', 'Memória RAM 16GB', 'Kingston', 'Hardware', 'DDR4 16GB', NULL, 280, 20, 5, 'Prateleira A2', 2, 1),
('HW003', 'Processador Core i5', 'Intel', 'Hardware', 'Intel Core i5', NULL, 1200, 8, 3, 'Prateleira B1', 2, 2),
('SW001', 'Microsoft 365 Business', 'Microsoft', 'Software', 'Suíte corporativa', 'Assinatura Anual', 599, 10, 3, 'Cofre Digital', 3, 3),
('SW002', 'Windows 11 Pro', 'Microsoft', 'Software', 'Sistema operacional', 'OEM', 850, 6, 2, 'Cofre Digital', 4, 3),
('SW003', 'Office Licença Perpétua', 'Microsoft', 'Software', 'Pacote de escritório', 'Perpétua/ESD', 950, 4, 2, 'Cofre Digital', 3, 2);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor ON produtos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes(produto_id);