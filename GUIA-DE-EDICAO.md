# Guia de Edição — "Quero mudar X, edite Y"

Dica: no VS Code, use **Ctrl+P** para abrir um arquivo pelo nome e **Ctrl+F** para achar um texto. Depois de salvar, o site em `npm run dev` atualiza sozinho.

| Quero mudar... | Edite o arquivo | O que procurar |
|---|---|---|
| Link do WhatsApp | `src/routes/index.tsx` | `const whatsappUrl = '...'` |
| Link do Instagram | `src/routes/index.tsx` | `const INSTAGRAM_URL = ''` — coloque o link entre as aspas |
| Itens do menu | `src/routes/index.tsx` | `const navigation` |
| Um serviço (título, texto, ícone) | `src/routes/index.tsx` | `const services` |
| Etapas da metodologia | `src/routes/index.tsx` | `const steps` |
| Depoimentos | `src/routes/index.tsx` | `const testimonials` (troque `text`, `metric`, `name`, `company`) |
| Diferenciais | `src/routes/index.tsx` | `const differences` |
| Números (6 serviços, 100%...) | `src/routes/index.tsx` | `Serviços integrados` |
| Título principal do topo | `src/routes/index.tsx` | `Soluções Digitais que Geram` |
| Textos de qualquer seção | `src/routes/index.tsx` | Ctrl+F com um trecho do texto |
| Texto da Política de Privacidade | `src/routes/index.tsx` | `Política de Privacidade` |
| Ano/rodapé | `src/routes/index.tsx` | `© 2026 CodeFlow` |
| Título na aba do Google | `src/routes/index.tsx` | `head:` |
| Cor azul principal | `src/styles.css` | `--primary` |
| Cor de fundo | `src/styles.css` | `--background` |
| Cor dos cartões | `src/styles.css` | `--card` |
| Cor de destaque (ciano) | `src/styles.css` | `--accent` |
| Cor dos textos secundários | `src/styles.css` | `--muted-foreground` |
| Cor do botão WhatsApp | `src/styles.css` | `--whatsapp` |
| Fonte | `src/styles.css` (`--font-sans`) e `src/routes/__root.tsx` (link do Google Fonts) | `Open Sans` |
| Arredondamento das bordas | `src/styles.css` | `--radius-` |
| Logo | `src/routes/index.tsx` | `function Logo` (veja README) |
| Ícone da aba (favicon) | `public/favicon.svg` | substitua o arquivo |
| Campos/validação do formulário | `src/lib/contact.functions.ts` e `src/routes/index.tsx` (`<form`) | `contactSchema` |
| Para onde vão os contatos | `src/lib/contact.functions.ts` | `handler` |

## Exemplo: adicionar um serviço

Em `const services`, copie uma linha e altere:

```ts
{ icon: Rocket, title: 'Novo Serviço', description: 'Descrição curta do serviço.' },
```

Se usar um ícone novo, adicione o nome dele no `import { ... } from 'lucide-react'` no topo.

## Cuidados

- Não edite `src/routeTree.gen.ts` nem arquivos em `src/integrations/` — são gerados automaticamente.
- Mantenha vírgulas e aspas ao editar listas. Se o site quebrar, desfaça com **Ctrl+Z**.
