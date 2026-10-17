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
2. Copie o arquivo `.env.example` para `.env` e preencha os valores do Supabase (peça a quem administra o projeto). Sem o `.env`, o site abre, mas o formulário não salva os contatos.
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

| Seção                       | Onde editar                                             |
| --------------------------- | ------------------------------------------------------- |
| Topo (hero) e fundo animado | `src/routes/index.tsx` e `src/components/HeroWaves.tsx` |
| Faixa de ferramentas        | `src/data/ferramentas.ts`                               |
| Site Personalizado          | `src/data/sobre.ts` (`sitePersonalizado`)               |
| Quem Somos (card da logo)   | `src/data/sobre.ts` (`quemSomos`)                       |
| Serviços (cards que viram)  | `src/data/servicos.ts`                                  |
| Metodologia                 | `src/routes/index.tsx` (`const steps`)                  |
| Resultados (depoimentos)    | `src/data/depoimentos.ts`                               |
| Nossa Equipe (carrossel)    | `src/data/equipe.ts` e fotos em `src/assets/equipe/`    |
| Contato (formulário)        | `src/routes/index.tsx` e `src/lib/contact.functions.ts` |
| FAQ                         | `src/data/faq.ts`                                       |

Efeitos visuais reutilizáveis: `OrbitButton` (botões com borda orbital), `OrbitBorder` (a mesma borda em cards), `Marquee` (faixas que rolam sozinhas), `CursorTrail` (rastro do mouse) e `AvatarIlustrado` (avatares dos depoimentos), todos em `src/components/`. Como ajustar cada um está no **GUIA-DE-EDICAO.md**.

## Formulário de contato

A validação e o envio ficam em `src/lib/contact.functions.ts`. Os contatos são salvos na tabela `contact_leads` do Supabase (não é pública). Para enviar também por e-mail, planilha ou CRM, adicione a chamada dentro do `handler`, logo após o `insert`.

## Como publicar

Use uma hospedagem com suporte a Node/funções de servidor (o formulário roda no servidor). Comando de build: `npm run build`. Cadastre nas configurações da hospedagem as mesmas variáveis do `.env` (veja `.env.example`).

## Git

O trabalho novo fica na branch `claude-code`; a `main` é a versão publicada. Para enviar suas alterações:

```sh
git add -A
git commit -m "Descreva a alteração"
git push origin claude-code
```
