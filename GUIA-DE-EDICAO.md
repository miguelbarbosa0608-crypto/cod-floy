# Guia de Edição — "Quero mudar X, edite Y"

Dica: no VS Code, use **Ctrl+P** para abrir um arquivo pelo nome e **Ctrl+F** para achar um texto. Com `npm run dev` rodando, o site atualiza sozinho ao salvar.

## Tabela rápida

| Quero mudar...                         | Edite o arquivo                                  | O que procurar                                 |
| -------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Link do WhatsApp (contato e flutuante) | `src/routes/index.tsx`                           | `const whatsappUrl`                            |
| Número do WhatsApp (mensagens prontas) | `src/data/config.ts`                             | `WHATSAPP_NUMERO`                              |
| Link do Instagram                      | `src/data/config.ts`                             | `INSTAGRAM_URL`                                |
| Itens do menu                          | `src/routes/index.tsx`                           | `const navigation`                             |
| Título principal do topo               | `src/routes/index.tsx`                           | `Soluções Digitais que Geram`                  |
| Faixa de ferramentas                   | `src/data/ferramentas.ts`                        | lista `ferramentas`                            |
| Serviços (frente e verso dos cards)    | `src/data/servicos.ts`                           | lista `servicos`                               |
| Etapas da metodologia                  | `src/routes/index.tsx`                           | `const steps`                                  |
| Depoimentos                            | `src/data/depoimentos.ts`                        | lista `depoimentos`                            |
| Integrantes da equipe                  | `src/data/equipe.ts`                             | lista `equipe`                                 |
| Perguntas do FAQ                       | `src/data/faq.ts`                                | lista `faq`                                    |
| Site Personalizado / Quem Somos        | `src/data/sobre.ts`                              | `sitePersonalizado` / `quemSomos`              |
| Texto da Política de Privacidade       | `src/routes/index.tsx`                           | `Política de Privacidade`                      |
| Ano/rodapé                             | `src/routes/index.tsx`                           | `© 2026 Code Flow`                             |
| Título na aba e no Google              | `src/routes/__root.tsx` e `src/routes/index.tsx` | `head:`                                        |
| Cores principais                       | `src/styles.css`                                 | bloco `:root` (`--primary`, `--background`...) |
| Fonte                                  | `src/styles.css` e `src/routes/__root.tsx`       | `Open Sans`                                    |
| Fundo animado do topo                  | `src/components/HeroWaves.tsx`                   | "CONFIGURAÇÃO EDITÁVEL"                        |
| Campos/validação do formulário         | `src/lib/contact.functions.ts`                   | `contactSchema`                                |

Não edite `src/routeTree.gen.ts` nem `src/integrations/` (gerados automaticamente). Ao editar listas, mantenha vírgulas e aspas; se o site quebrar, desfaça com **Ctrl+Z**.

## Como trocar a logo

As versões da logo ficam em `src/assets/`:

| Arquivo                       | Onde aparece         | Observação                              |
| ----------------------------- | -------------------- | --------------------------------------- |
| `code-flow-logo-compacta.png` | Topo e rodapé        | fundo transparente, recorte justo       |
| `code-flow-logo-completa.png` | Card de Quem Somos   | fundo transparente, com respiro         |
| `code-flow-logo.png`          | (original, guardada) | imagem completa com o fundo azul-escuro |

Para trocar, substitua o arquivo **mantendo o mesmo nome**, de preferência PNG com fundo transparente e pelo menos 600px de largura (nítido em telas retina). Se a proporção mudar muito, ajuste `width`/`height` da imagem na função `Logo` (`src/routes/index.tsx`) e em `src/components/QuemSomos.tsx`.

**Ícone da aba (favicon):** substitua os arquivos de `public/`: `favicon.ico` (16/32/48px), `favicon.png` (192×192) e `apple-touch-icon.png` (180×180). Hoje eles mostram o símbolo CF sobre um quadrado escuro arredondado.

## Como editar a faixa de ferramentas

Abra `src/data/ferramentas.ts`:

- **Itens:** lista `ferramentas`. Adicione, remova ou reordene nomes (são só textos, sem logos de terceiros). Mantenha só o que a Code Flow realmente usa e não inclua empresas como parceiras ou clientes sem autorização.
- **Título:** `TITULO_FERRAMENTAS`.
- **Velocidade:** `VELOCIDADE_FERRAMENTAS_SEGUNDOS` (tempo de uma volta; maior = mais lento). No celular fica 40% mais lenta.
- **Tamanho e cor dos nomes:** `src/styles.css`, classe `.tool-name`.

## Como editar os depoimentos

Abra `src/data/depoimentos.ts`:

- Cada item tem `texto`, `nome`, `cargo`, `segmento`, `cidade` e `ilustrativo`. Os **8 primeiros** aparecem na linha de cima (rola para a esquerda) e os **8 últimos** na de baixo (rola para a direita).
- Textos curtos (2 a 4 linhas). Não use porcentagens, valores ou números de resultado que não possam ser comprovados.
- **Velocidade:** `VELOCIDADE_LINHA_1_SEGUNDOS` e `VELOCIDADE_LINHA_2_SEGUNDOS`.
- **Frase abaixo dos carrosséis:** `FRASE_CREDIBILIDADE` ("Code Flow" fica azul automaticamente).
- **Nota "Exemplos ilustrativos...":** quando os depoimentos forem reais, troque `MOSTRAR_NOTA_ILUSTRATIVA` para `false` e `ilustrativo` para `false` nos itens.
- **Visual dos cards:** `src/styles.css`, classe `.testimonial-card`.

### Trocar o avatar ilustrado por uma foto real

Os avatares são desenhados automaticamente a partir do nome (componente `src/components/AvatarIlustrado.tsx`): o mesmo nome sempre gera o mesmo rosto. Para usar uma foto real, **somente com autorização do cliente**:

1. Salve a foto (quadrada, ~200×200px) em `public/depoimentos/` — ex.: `public/depoimentos/camila.jpg`.
2. No item do depoimento, adicione `foto: "/depoimentos/camila.jpg",`.

A foto aparece redonda no lugar da ilustração.

## Como editar os serviços

Abra `src/data/servicos.ts`. Cada serviço tem `titulo`, `icone`, `frente` (frase curta da frente do card), `verso` (descrição do verso) e `itens` (lista com check). O `icone` precisa ser um dos nomes do mapa em `src/components/ServiceFlipCards.tsx` (`Target`, `Megaphone`, `LayoutTemplate`, `Globe2`, `Settings2`, `TrendingUp`); para usar outro ícone do https://lucide.dev, adicione-o nesse mapa e no tipo `IconeServico`. O botão do verso abre o WhatsApp com "Olá! Quero saber mais sobre [serviço].". Estilos: bloco "Flip cards" de `src/styles.css`.

## Como trocar a foto de um integrante da equipe

1. Substitua o arquivo em `src/assets/equipe/` **mantendo o nome** (`miguel.jpg`, `vitor.jpg`, `rodrigo.jpg`, `ramalho.jpg`, `matheus.jpg`, `leonardo.jpg`). Use JPG vertical com até ~900px de largura.
2. Se o rosto ficar cortado, ajuste `objectPosition` do integrante em `src/data/equipe.ts` (`"50% 30%"` = centro na horizontal, 30% a partir do topo; diminua o segundo número para subir o enquadramento).
3. Sem foto (`foto: undefined`), o card mostra um placeholder com as iniciais.

Textos (nome, função e descrição) ficam no mesmo arquivo. Estilos: bloco "Equipe" de `src/styles.css`.

## Como ajustar o cursor (rastro "constelação")

Arquivo `src/components/CursorTrail.tsx`, constantes no topo:

- `COR` / `COR_BRILHO`: cores (em RGB).
- `INTENSIDADE`: opacidade geral (0 a 1).
- `FLUXO`: densidade do rastro.
- `DURACAO`: quanto tempo o rastro leva para sumir (segundos).
- `MAX_PARTICULAS`, `TAMANHO`, `ALCANCE_LINHA`: quantidade, tamanho e distância das linhas.

O efeito fica desligado em celulares/tablets (toque) e para quem ativou "reduzir movimento" no sistema.

## Como ajustar os botões e bordas orbitais

Todos os botões principais usam `OrbitButton` (`src/components/OrbitButton.tsx`), e o card da logo em Quem Somos usa `OrbitBorder` (`src/components/OrbitBorder.tsx`). Os dois compartilham o bloco **"Botões e bordas orbitais"** de `src/styles.css`. No topo desse bloco (`.orbit-surface`):

- `--orbit-thickness`: espessura da borda.
- `--orbit-speed`: tempo de uma volta do arco.
- `--orbit-arc-rest` / `--orbit-arc-hover`: tamanho do arco em repouso e no hover.
- `--orbit-glow-blur`, `--orbit-glow-opacity`, `--orbit-glow-width`: brilho.
- `--orbit-sharp-opacity`: intensidade do arco nítido.

Cores por tipo de botão: `.orbit-primary`, `.orbit-secondary` e `.orbit-whatsapp` (face, texto, borda e as duas cores do arco). Escala no hover/clique: `.orbit-btn`. No `OrbitBorder`, raio, espessura, cores e velocidade também podem ser passados direto no componente (`radius`, `thickness`, `color`, `tipColor`, `speed`).

Para usar o botão em outro lugar:

```tsx
<OrbitButton
  href="#contato"
  icon={<ArrowRight size={16} />}
  className="h-12 px-6 text-sm font-bold"
>
  Texto do botão
</OrbitButton>
```

## Como editar as seções Site Personalizado e Quem Somos

Em `src/data/sobre.ts`: objeto `sitePersonalizado` (título, parágrafos, lista, botão e mensagem do WhatsApp) e objeto `quemSomos` (trechos entre `**asteriscos**` ficam em negrito branco; os 3 cards ficam em `cards`).
