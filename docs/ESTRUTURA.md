# Estrutura do Projeto

```text
.
├── .env                      Endereços do banco de dados (local, fora do Git)
├── .env.example              Modelo do .env com os nomes das variáveis
├── AGENTS.md                 Regras técnicas do projeto
├── GUIA-DE-EDICAO.md         Passo a passo "quero mudar X, edite Y"
├── README.md                 Visão geral, instalação e publicação
├── package.json              Dependências e comandos (dev, build, test)
├── package-lock.json         Versões travadas das dependências (npm)
├── vite.config.ts            Configuração do Vite
├── public/
│   ├── favicon.ico           Ícone da aba (16/32/48px)
│   ├── favicon.png           Ícone 192×192
│   ├── apple-touch-icon.png  Ícone para a tela inicial do iPhone
│   └── robots.txt            Instruções para buscadores
├── supabase/                 Configuração e migrações do banco (tabela contact_leads)
└── src/
    ├── routes/
    │   ├── index.tsx         A página: seções, menu, metodologia, contato, rodapé
    │   └── __root.tsx        HTML base, idioma, fonte, título, favicon e cursor
    ├── styles.css            Cores, cards, botões/bordas orbitais, carrosséis, animações
    ├── assets/
    │   ├── code-flow-logo*.png  Logo (compacta, completa e original)
    │   └── equipe/           Fotos da equipe
    ├── data/
    │   ├── config.ts         Instagram e número do WhatsApp
    │   ├── ferramentas.ts    Faixa de plataformas e ferramentas
    │   ├── servicos.ts       Cards de serviços (frente e verso)
    │   ├── depoimentos.ts    Depoimentos, velocidades e nota ilustrativa
    │   ├── equipe.ts         Integrantes da equipe
    │   ├── sobre.ts          Site Personalizado e Quem Somos
    │   ├── faq.ts            Perguntas e respostas
    │   └── diferenciais.ts   Conteúdo antigo guardado (não usado)
    ├── components/
    │   ├── HeroWaves.tsx     Fundo animado 3D do topo
    │   ├── OrbitButton.tsx   Botão com borda orbital
    │   ├── OrbitBorder.tsx   Borda orbital para cards (logo em Quem Somos)
    │   ├── Marquee.tsx       Faixa de rolagem infinita (ferramentas e depoimentos)
    │   ├── AvatarIlustrado.tsx  Avatar em SVG gerado pelo nome
    │   ├── ServiceFlipCards.tsx Cards de serviços que viram
    │   ├── TeamCarousel.tsx  Carrossel da equipe
    │   ├── CursorTrail.tsx   Rastro do mouse
    │   ├── SitePersonalizado.tsx / QuemSomos.tsx / Reveal.tsx
    │   └── ui/               Componentes prontos (shadcn)
    ├── lib/
    │   └── contact.functions.ts    Validação e gravação dos contatos
    ├── integrations/supabase/  Conexão com o banco (gerado, não editar)
    ├── test/                 Testes automáticos
    └── routeTree.gen.ts      Lista de rotas (gerado, não editar)
```

## Ordem das seções da página

Topo (hero) → Ferramentas → Site Personalizado → Quem Somos → Serviços (`#servicos`) → Metodologia (`#metodologia`) → Resultados (`#resultados`) → Nossa Equipe (`#equipe`) → Contato (`#contato`) → FAQ (`#faq`) → Rodapé.
