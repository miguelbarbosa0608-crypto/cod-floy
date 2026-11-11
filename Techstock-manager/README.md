# TechStock Manager

Sistema web de gerenciamento de estoque desenvolvido para a empresa TechStore Informática & Serviços Corporativos.

## 1. Objetivo

O sistema tem como objetivo controlar produtos, licenças de software, fornecedores, categorias e movimentações de estoque.

## 2. Tecnologias utilizadas

- Python
- Flask
- SQLite
- HTML5
- CSS3

## 3. Funcionalidades

- Dashboard com listagem de produtos.
- Cadastro de produtos e licenças.
- Associação dinâmica de categorias e fornecedores.
- Registro de entrada de estoque.
- Registro de saída de estoque.
- Bloqueio de saídas sem saldo suficiente.
- Alertas de estoque mínimo.
- Desativação de produtos.
- Proteção contra exclusões com vínculos existentes.

## 4. Estrutura do projeto

```text
TechStock-Manager/
├── app.py
├── database.sql
├── README.md
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── cadastro.html
│   └── movimentacao.html
└── static/
    └── style.css
```

## 5. Instalação

É necessário ter Python instalado.

Abra o terminal na pasta do projeto e execute:

```bash
pip install flask
```

## 6. Banco de dados

O banco utiliza SQLite.

O arquivo database.sql cria automaticamente as quatro tabelas:

- Categorias
- Fornecedores
- Produtos
- Movimentações

Também realiza a carga inicial de categorias, fornecedores e produtos para testes.

O banco techstock.db será criado automaticamente na primeira execução da aplicação.

## 7. Como executar

No terminal do VS Code, execute:

```bash
python app.py
```

Depois, abra o navegador e acesse:

```text
http://127.0.0.1:5000
```

## 8. Responsáveis

Projeto: TechStock Manager

Contratante: TechStore Informática & Serviços Corporativos

Demanda: #2026-INV04