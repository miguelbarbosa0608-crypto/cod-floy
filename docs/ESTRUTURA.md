# Estrutura do Projeto

```text
.
├── .env                      Endereços públicos do banco de dados (Lovable Cloud)
├── .gitignore                Arquivos ignorados pelo Git
├── .prettierrc / .prettierignore  Regras de formatação automática do código
├── AGENTS.md                 Regras técnicas do projeto (para o Lovable)
├── GUIA-DE-EDICAO.md         Passo a passo "quero mudar X, edite Y"
├── README.md                 Visão geral, instalação e publicação
├── roadmap.md                Lista de tarefas do projeto
├── bun.lock                  Versões travadas das dependências
├── bunfig.toml               Configuração do gerenciador Bun
├── components.json           Configuração dos componentes de interface (shadcn)
├── eslint.config.js          Regras de verificação de código
├── package.json              Dependências e comandos (dev, build...)
├── tsconfig.json             Configuração do TypeScript
├── vite.config.ts            Configuração do Vite (servidor e build)
├── vitest.config.ts          Configuração dos testes
├── docs/
│   └── ESTRUTURA.md          Este arquivo
├── public/
│   ├── favicon.svg           Ícone da aba do navegador
│   └── robots.txt            Instruções para buscadores (Google)
├── supabase/
│   ├── config.toml           Configuração do banco (automático)
│   └── migrations/*.sql      Criação da tabela de contatos (contact_leads)
└── src/
    ├── routes/
    │   ├── index.tsx         A PÁGINA: links, listas de conteúdo, todas as seções
    │   ├── __root.tsx        HTML base, idioma pt-BR, fonte Open Sans, título padrão
    │   └── README.md         Nota técnica sobre rotas
    ├── styles.css            Cores, fonte, bordas, efeitos (cartões, brilho, animações)
    ├── lib/
    │   ├── contact.functions.ts  Validação e gravação dos contatos do formulário
    │   ├── utils.ts              Função auxiliar para juntar classes CSS
    │   ├── error-capture.ts      Captura de erros
    │   ├── error-page.ts         Página de erro
    │   └── lovable-error-reporting.ts  Envio de erros ao Lovable
    ├── components/ui/        Componentes prontos (button.tsx é usado na página; os demais ficam disponíveis)
    ├── hooks/use-mobile.tsx  Detecta tela de celular
    ├── integrations/supabase/  Conexão com o banco de dados (gerado, não editar)
    ├── test/                 Testes automáticos
    ├── router.tsx            Cria o roteador do site
    ├── routeTree.gen.ts      Lista de rotas (gerado, não editar)
    ├── server.ts             Entrada do servidor
    └── start.ts              Inicialização do app
```

## Seções da página (todas em `src/routes/index.tsx`)

| Seção | Identificador | Dados usados |
|---|---|---|
| Cabeçalho e menu | `<header>` | `navigation` |
| Topo (hero) | `#inicio` | textos diretos |
| Números | `Nossa atuação` | lista dentro da seção |
| Serviços | `#servicos` | `services` |
| Metodologia | `#metodologia` | `steps` |
| Depoimentos | `#resultados` | `testimonials` |
| Diferenciais | `#diferenciais` | `differences` |
| Contato/formulário | `#contato` | `submitContact`, `whatsappUrl` |
| Rodapé | `<footer>` | `navigation`, `INSTAGRAM_URL` |
| Botão flutuante WhatsApp | final do arquivo | `whatsappUrl` |
