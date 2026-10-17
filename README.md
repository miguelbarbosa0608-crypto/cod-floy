# Code Flow — Landing Page

Site de apresentação (uma única página) da **Code Flow**, empresa de tecnologia, marketing e automação. Todo o conteúdo está em português.

> Guia "quero mudar X, edite Y": veja **GUIA-DE-EDICAO.md**. Árvore de arquivos: veja **docs/ESTRUTURA.md**.

## Tecnologias

- **React 19** + **TypeScript**
- **TanStack Start / TanStack Router**: estrutura do site, rotas e funções de servidor
- **Vite**: servidor de desenvolvimento e build
- **Tailwind CSS v4**: estilos (configurados em `src/styles.css`; não existe `tailwind.config.js`)
- **Supabase**: banco de dados que guarda os contatos do formulário
- **lucide-react**: ícones · **three**: fundo animado do topo

## Como instalar e rodar

1. Instale o **Node.js** 20 ou superior: https://nodejs.org
2. Copie o arquivo `.env.example` para `.env` e preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (peça a quem administra o projeto). Sem elas, o site abre normalmente, mas o formulário não salva os contatos.
3. No terminal, dentro da pasta do projeto:

```sh
npm install          # instala as dependências (só na primeira vez)
npm run dev          # site em http://localhost:8080 (ou o endereço mostrado)
npm run dev -- --host  # também mostra um endereço de rede para abrir no celular (mesma rede Wi-Fi)
npm run build        # gera a versão final para publicação
npm test             # roda os testes
```

O projeto usa **npm** (arquivo `package-lock.json`). O `.env` não vai para o Git; o modelo com os nomes das variáveis está em `.env.example`.

## Seções da página (de cima para baixo)

| Seção                       | Onde editar                                                    |
| --------------------------- | -------------------------------------------------------------- |
| Topo (hero) e fundo animado | `src/routes/index.tsx` e `src/components/HeroWaves.tsx`        |
| Faixa de ferramentas        | `src/data/ferramentas.ts`                                      |
| Site Personalizado          | `src/data/sobre.ts` e celulares em `src/data/exemplosSites.ts` |
| Quem Somos (globo 3D)       | `src/data/sobre.ts` e `src/components/CodeFlowGlobe.tsx`       |
| Serviços (cards que viram)  | `src/data/servicos.ts`                                         |
| Por que a Code Flow         | `src/data/porQue.ts`                                           |
| Resultados (depoimentos)    | `src/data/depoimentos.ts`                                      |
| Nossa Equipe (carrossel)    | `src/data/equipe.ts` e fotos em `src/assets/equipe/`           |
| Contato (formulário)        | `src/routes/index.tsx` e `src/lib/contact.functions.ts`        |
| FAQ                         | `src/data/faq.ts`                                              |

Efeitos visuais reutilizáveis: `OrbitButton` (botões com borda orbital), `OrbitBorder` (a mesma borda em cards), `Marquee` (faixas que rolam sozinhas), `CursorTrail` (rastro do mouse), `AvatarIlustrado` (avatares dos depoimentos), `PhoneRing` (anel 3D de celulares) e `CodeFlowGlobe` (globo 3D com Three.js, carregado só quando chega perto da tela), todos em `src/components/`. O header translúcido fica em `src/routes/index.tsx` com estilos em `.site-header` (`src/styles.css`). Como ajustar cada um está no **GUIA-DE-EDICAO.md**.

## Formulário de contato

A validação e o envio ficam em `src/lib/contact.functions.ts`. Os contatos são salvos na tabela `contact_leads` do Supabase (não é pública), pelo servidor, com o cliente de `src/integrations/supabase/client.server.ts`. Variáveis de ambiente usadas (só no servidor, o build não precisa delas): `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. O site não tem login e não acessa o Supabase pelo navegador. Para enviar também por e-mail, planilha ou CRM, adicione a chamada dentro do `handler`, logo após o `insert`.

## Como publicar (Netlify)

O site está configurado para a **Netlify** com o plugin oficial `@netlify/vite-plugin-tanstack-start` (em `vite.config.ts`) e o arquivo `netlify.toml`. O build gera as páginas em `dist/client` e uma função de servidor para o SSR e o formulário de contato.

1. Na Netlify: **Add new project > Import an existing project > GitHub** e escolha o repositório.
2. **Branch to deploy:** a branch que será publicada (ex.: `claude-code` ou `main`).
3. **Build command:** `npm run build` · **Publish directory:** `dist/client` (já vêm do `netlify.toml`). Deixe "Functions directory" em branco.
4. **Environment variables:** cadastre só `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (marque esta como secreta). São usadas pela função de servidor do formulário; o build não precisa delas.
5. Depois de ter o endereço final, troque `SITE_URL` em `src/data/site.ts` (usado nas meta tags, no `robots.txt` e no `sitemap.xml`) e publique de novo.

Para testar o build de produção no computador: `npm run build` e depois `npm run preview`.

## Git

O trabalho novo fica na branch `claude-code`; a `main` é a versão publicada. Para enviar suas alterações:

```sh
git add -A
git commit -m "Descreva a alteração"
git push origin claude-code
```
