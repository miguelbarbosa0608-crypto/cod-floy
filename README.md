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

O formulário (seção Contato) envia cada contato para dois destinos ao mesmo tempo:

1. **Netlify Forms** (destino principal): o navegador envia os dados para `/__forms.html` (código em `src/lib/netlifyForms.ts`). O arquivo `public/__forms.html` existe só para a Netlify detectar o formulário `contato`. Os contatos aparecem em **Netlify > projeto > Forms > contato** (dá para exportar em CSV) e podem chegar por e-mail (veja abaixo). Não precisa de nenhuma variável de ambiente.
2. **Supabase** (opcional): a função de servidor `src/lib/contact.functions.ts` grava na tabela `contact_leads` **só se** `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` existirem. Sem elas, ela é pulada sem erro.

A mensagem "Solicitação enviada!" aparece se pelo menos um destino aceitar o envio. O campo escondido `website` é uma armadilha anti-robô (honeypot): se vier preenchido, nada é enviado.

**Receber cada contato por e-mail:** Netlify > projeto > **Forms > Submission notifications > Add notification > Email notification**, escolha o formulário `contato` e o seu e-mail. O e-mail chega com o assunto "Novo contato pelo site Code Flow" (definido em `src/lib/netlifyForms.ts`), e responder ao e-mail responde direto ao cliente (o campo `email` vira o Reply-to). Para WhatsApp, use o app de e-mail no celular com notificações, ou uma automação (Zapier/n8n) a partir do Netlify Forms.

## Como publicar (Netlify)

O site está configurado para a **Netlify** com o plugin oficial `@netlify/vite-plugin-tanstack-start` (em `vite.config.ts`) e o arquivo `netlify.toml`. O build gera as páginas em `dist/client` e uma função de servidor para o SSR (e para a gravação opcional no Supabase).

1. Na Netlify: **Add new project > Import an existing project > GitHub** e escolha o repositório.
2. **Branch to deploy:** a branch que será publicada (ex.: `claude-code` ou `main`).
3. **Build command:** `npm run build` · **Publish directory:** `dist/client` (já vêm do `netlify.toml`). Deixe "Functions directory" em branco.
4. **Formulário:** em **Forms**, clique em **Enable form detection** (vale a partir do próximo deploy; se o site já tinha sido publicado, faça um novo deploy). Depois configure o aviso por e-mail (veja "Formulário de contato").
5. **Environment variables:** não são necessárias. Só cadastre `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (secreta) se quiser gravar também num Supabase seu.
6. Depois de ter o endereço final, troque `SITE_URL` em `src/data/site.ts` (usado nas meta tags, no `robots.txt` e no `sitemap.xml`) e publique de novo.

Para testar o build de produção no computador: `npm run build` e depois `npm run preview`.

## Git

O trabalho novo fica na branch `claude-code`; a `main` é a versão publicada. Para enviar suas alterações:

```sh
git add -A
git commit -m "Descreva a alteração"
git push origin claude-code
```
