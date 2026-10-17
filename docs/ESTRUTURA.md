# Estrutura do Projeto

```text
.
├── .env                      Opcional: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (local, fora do Git)
├── .env.example              Modelo do .env com os nomes das variáveis
├── AGENTS.md                 Regras técnicas do projeto
├── GUIA-DE-EDICAO.md         Passo a passo "quero mudar X, edite Y"
├── README.md                 Visão geral, instalação e publicação
├── package.json              Dependências e comandos (dev, build, test)
├── package-lock.json         Versões travadas das dependências (npm)
├── vite.config.ts            Configuração do Vite (com o plugin da Netlify)
├── netlify.toml              Build e publicação na Netlify
├── public/
│   ├── favicon.ico           Ícone da aba (16/32/48px)
│   ├── favicon.png           Ícone 192×192
│   ├── apple-touch-icon.png  Ícone para a tela inicial do iPhone
│   ├── __forms.html          Formulário oculto para a Netlify detectar o formulário "contato"
│   ├── og-image.png          Imagem de compartilhamento (1200x630)
│   └── logo-code-flow.png    Logo usada nos dados estruturados (JSON-LD)
├── supabase/                 Configuração e migrações do banco (tabela contact_leads)
└── src/
    ├── routes/
    │   ├── index.tsx         A página: seções, menu, header, contato, rodapé
    │   ├── __root.tsx        HTML base, idioma, fonte, título, favicon e cursor
    │   ├── robots[.]txt.ts   /robots.txt gerado a partir de SITE_URL
    │   └── sitemap[.]xml.ts  /sitemap.xml gerado a partir de SITE_URL
    ├── styles.css            Cores, cards, botões/bordas orbitais, carrosséis, animações
    ├── assets/
    │   ├── code-flow-logo*.png  Logo (compacta, completa e original)
    │   ├── equipe/           Fotos da equipe
    │   └── geo/              Mapa do globo (Natural Earth 110m: land.json e brasil.json)
    ├── data/
    │   ├── config.ts         Instagram e número do WhatsApp
    │   ├── site.ts           SEO: domínio (SITE_URL), título, descrição, imagem e JSON-LD
    │   ├── ferramentas.ts    Faixa de plataformas e ferramentas
    │   ├── exemplosSites.ts  Celulares de exemplo (anel 3D de Site Personalizado)
    │   ├── porQue.ts         Seção "Por que a Code Flow"
    │   ├── servicos.ts       Cards de serviços (frente e verso)
    │   ├── depoimentos.ts    Depoimentos, velocidades e nota ilustrativa
    │   ├── equipe.ts         Integrantes da equipe
    │   ├── sobre.ts          Site Personalizado e Quem Somos
    │   ├── faq.ts            Perguntas e respostas
    │   ├── metodologia.ts    Conteúdo antigo guardado (não usado)
    │   └── diferenciais.ts   Conteúdo antigo guardado (não usado)
    ├── components/
    │   ├── HeroWaves.tsx     Fundo animado 3D do topo
    │   ├── OrbitButton.tsx   Botão com borda orbital
    │   ├── OrbitBorder.tsx   Borda orbital para cards (disponível, sem uso no momento)
    │   ├── Marquee.tsx       Faixa de rolagem infinita (ferramentas e depoimentos)
    │   ├── AvatarIlustrado.tsx  Avatar em SVG gerado pelo nome
    │   ├── ServiceFlipCards.tsx Cards de serviços que viram
    │   ├── TeamCarousel.tsx  Carrossel da equipe
    │   ├── CursorTrail.tsx   Rastro do mouse
    │   ├── PhoneRing.tsx     Anel 3D de celulares (Site Personalizado)
    │   ├── CodeFlowGlobe.tsx Globo 3D (Quem Somos)
    │   ├── PorQue.tsx        Seção "Por que a Code Flow"
    │   ├── SitePersonalizado.tsx / QuemSomos.tsx / Reveal.tsx
    │   └── ui/               Componentes prontos (shadcn)
    ├── lib/
    │   ├── netlifyForms.ts         Envio do formulário para o Netlify Forms (principal)
    │   └── contact.functions.ts    Gravação opcional no Supabase (só com as variáveis)
    ├── integrations/supabase/  Cliente do banco usado pelo formulário (client.server.ts) e tipos
    ├── test/                 Testes automáticos
    └── routeTree.gen.ts      Lista de rotas (gerado, não editar)
```

## Ordem das seções da página

Topo (hero) → Ferramentas → Site Personalizado → Quem Somos → Serviços (`#servicos`) → Por que a Code Flow (`#por-que`) → Resultados (`#resultados`) → Nossa Equipe (`#equipe`) → Contato (`#contato`) → FAQ (`#faq`) → Rodapé.
