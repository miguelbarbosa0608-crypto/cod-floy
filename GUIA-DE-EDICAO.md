# Guia de Edição — "Quero mudar X, edite Y"

Dica: no VS Code, use **Ctrl+P** para abrir um arquivo pelo nome e **Ctrl+F** para achar um texto. Com `npm run dev` rodando, o site atualiza sozinho ao salvar.

## Tabela rápida

| Quero mudar...                            | Edite o arquivo                                                                                             | O que procurar                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Link do WhatsApp (contato e flutuante)    | `src/routes/index.tsx`                                                                                      | `const whatsappUrl`                            |
| Número do WhatsApp (mensagens prontas)    | `src/data/config.ts`                                                                                        | `WHATSAPP_NUMERO`                              |
| Link do Instagram                         | `src/data/config.ts`                                                                                        | `INSTAGRAM_URL`                                |
| Itens do menu                             | `src/routes/index.tsx`                                                                                      | `const navigation`                             |
| Título principal do topo                  | `src/routes/index.tsx`                                                                                      | `Soluções Digitais que Geram`                  |
| Faixa de ferramentas                      | `src/data/ferramentas.ts`                                                                                   | lista `ferramentas`                            |
| Serviços (frente e verso dos cards)       | `src/data/servicos.ts`                                                                                      | lista `servicos`                               |
| Blocos de "Por que a Code Flow"           | `src/data/porQue.ts`                                                                                        | lista `motivos`                                |
| Celulares de exemplo (Site Personalizado) | `src/data/exemplosSites.ts`                                                                                 | lista `exemplosSites`                          |
| Globo de Quem Somos (cores, local)        | `src/components/CodeFlowGlobe.tsx`                                                                          | "Parâmetros" no topo                           |
| Header translúcido                        | `src/styles.css`                                                                                            | `.site-header`                                 |
| Depoimentos                               | `src/data/depoimentos.ts`                                                                                   | lista `depoimentos`                            |
| Integrantes da equipe                     | `src/data/equipe.ts`                                                                                        | lista `equipe`                                 |
| Perguntas do FAQ                          | `src/data/faq.ts`                                                                                           | lista `faq`                                    |
| Site Personalizado / Quem Somos           | `src/data/sobre.ts`                                                                                         | `sitePersonalizado` / `quemSomos`              |
| Texto da Política de Privacidade          | `src/routes/index.tsx`                                                                                      | `Política de Privacidade`                      |
| Ano/rodapé                                | `src/routes/index.tsx`                                                                                      | `© 2026 Code Flow`                             |
| Título, descrição e domínio (SEO)         | `src/data/site.ts`                                                                                          | `SITE_URL`, `SITE_TITULO`, `SITE_DESCRICAO`    |
| Cores principais                          | `src/styles.css`                                                                                            | bloco `:root` (`--primary`, `--background`...) |
| Fonte                                     | `src/styles.css` e `src/routes/__root.tsx`                                                                  | `Open Sans`                                    |
| Fundo animado do topo                     | `src/components/HeroWaves.tsx`                                                                              | "CONFIGURAÇÃO EDITÁVEL"                        |
| Campos do formulário                      | `src/routes/index.tsx` (`<form`), `public/__forms.html` e `src/lib/netlifyForms.ts` (mesmos nomes nos três) | `name=`                                        |
| Para onde vão os contatos                 | Netlify > Forms > contato; e-mail em Forms > Submission notifications                                       | veja o README                                  |

Não edite `src/routeTree.gen.ts` (gerado automaticamente). Ao editar listas, mantenha vírgulas e aspas; se o site quebrar, desfaça com **Ctrl+Z**.

## Como trocar a logo

As versões da logo ficam em `src/assets/`:

| Arquivo                       | Onde aparece                                          | Observação                              |
| ----------------------------- | ----------------------------------------------------- | --------------------------------------- |
| `code-flow-logo-compacta.png` | Topo, rodapé e centro do globo                        | fundo transparente, recorte justo       |
| `code-flow-logo-completa.png` | Quem Somos, só quando o globo não carrega (sem WebGL) | fundo transparente, com respiro         |
| `code-flow-logo.png`          | (original, guardada)                                  | imagem completa com o fundo azul-escuro |

Para trocar, substitua o arquivo **mantendo o mesmo nome**, de preferência PNG com fundo transparente e pelo menos 600px de largura (nítido em telas retina). Se a proporção mudar muito, ajuste `width`/`height` da imagem na função `Logo` (`src/routes/index.tsx`) e em `src/components/CodeFlowGlobe.tsx`.

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

O efeito fica desligado em celulares/tablets (toque), para quem ativou "reduzir movimento" no sistema e sobre elementos com o atributo `data-sem-rastro` (hoje, o globo de Quem Somos).

## Como ajustar os botões e bordas orbitais

Todos os botões principais usam `OrbitButton` (`src/components/OrbitButton.tsx`). O `OrbitBorder` (`src/components/OrbitBorder.tsx`) aplica a mesma borda em cards; hoje não está em uso, mas continua disponível. Os dois compartilham o bloco **"Botões e bordas orbitais"** de `src/styles.css`. No topo desse bloco (`.orbit-surface`):

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

## Como editar os celulares de exemplo (Site Personalizado)

Os 4 celulares do anel 3D vêm de `src/data/exemplosSites.ts`. Cada item tem `marca` (sempre fictícia; não use marcas reais nem nomes de clientes), `selo`, `titulo`, `botao`, os 3 `cards` e um `tema` com as cores da mini-página (`fundo`, `superficie`, `texto`, `textoSuave`, `destaque`, `textoBotao` e as 4 cores da `paleta` do rodapé). Dá para adicionar ou remover celulares: o ângulo entre eles se ajusta sozinho. A etiqueta "Exemplo de layout" fica em `ETIQUETA_EXEMPLO`.

Comportamento do anel (constantes no topo de `src/components/PhoneRing.tsx`): `VELOCIDADE` (graus por segundo), `RAIO`, `INCLINACAO`, `SENSIBILIDADE` do arraste, `ATRITO` da inércia e `BRILHO_MINIMO` dos celulares ao fundo. Tamanho e altura da área: `.phone-ring` em `src/styles.css` (`--ring-height` e `--ring-scale`; no celular a escala é 0.773, ~170x340px).

## Como editar o globo (Quem Somos)

O globo fica solto sobre o fundo da página, sem moldura, num quadrado de ~520px no computador e ~320px no celular (tamanho em `src/components/QuemSomos.tsx`). Arquivo `src/components/CodeFlowGlobe.tsx`, bloco "Parâmetros" no topo:

- **Pontos dos continentes:** `COR_PONTOS`, `COR_BRASIL` (destaque), `OPACIDADE_PONTOS`, `TAMANHO_PONTO`, `VARIACAO_TAMANHO` (pontos grandes e pequenos, ±30%) e `VARIACAO_BRILHO` (textura).
- **Densidade:** `PONTOS_DESKTOP` e `PONTOS_MOBILE` (mais pontos = continentes mais nítidos, porém mais pesado).
- **Oceano:** `OCEANO_CENTRO` / `OCEANO_CENTRO_ALFA` e `OCEANO_BORDA` / `OCEANO_BORDA_ALFA` (gradiente do centro para a borda), `COR_LUZ_BORDA` e `INTENSIDADE_LUZ_BORDA` (luz no contorno da esfera).
- **Atmosfera:** `COR_ATMOSFERA` e `INTENSIDADE_ATMOSFERA`. O halo extra atrás do canvas fica em `.globe-box::before` (`src/styles.css`).
- **Grade e contornos:** `COR_GRADE` / `OPACIDADE_GRADE` (latitude/longitude) e `COR_CONTORNO` / `OPACIDADE_CONTORNO` (contorno dos continentes).
- **Ponto de localização:** `LOCAL` (`nome`, `lat`, `lng`) e `COR_MARCADOR`. Hoje é Goiânia · GO (-16.6869, -49.2648); o globo começa virado para esse ponto.
- **Arcos de conexão:** `DESTINOS_ARCOS` (lista de `lat`/`lng` para onde os arcos saem de Goiânia; são só decoração, sem rótulos), `COR_ARCOS` e `VELOCIDADE_ARCOS`.
- **Movimento:** `VELOCIDADE` (0,4 radiano por minuto, sentido leste), `INCLINACAO_EIXO` (15°), `SENSIBILIDADE` e `ATRITO` (arraste e inércia). Passar o mouse pausa e o giro retoma suavemente.
- **Estrelas:** `QUANTIDADE_ESTRELAS`, `COR_ESTRELAS` e `OPACIDADE_ESTRELAS`.
- **Tamanho do globo no quadrado:** `OCUPACAO` (o resto do espaço fica para o halo e os arcos).

A logo do centro (opacidade 0.22, 0.4 no hover) e o rótulo do local ficam no bloco "Globo 3D" de `src/styles.css` (`.globe-logo`, `.globe-label`). O mapa vem de `src/assets/geo/land.json` e `brasil.json` (Natural Earth 110m, domínio público). O Three.js e o mapa só carregam quando o globo chega perto da tela; sem WebGL, aparece a logo estática. O rastro do cursor fica desligado sobre o globo (atributo `data-sem-rastro`).

## Como editar "Por que a Code Flow"

Arquivo `src/data/porQue.ts`:

- **Título, frase e botão** da coluna esquerda: `porQueCabecalho`.
- **Blocos** da direita: lista `motivos` (`icone`, `titulo`, `texto`). O `icone` precisa ser um dos nomes do mapa em `src/components/PorQue.tsx` (Puzzle, Target, LayoutTemplate, Workflow, ListChecks, MessagesSquare); para outro ícone do https://lucide.dev, adicione-o nesse mapa e no tipo `IconePorQue`.
- Só inclua afirmações verdadeiras e sem números de resultado.

No computador, a coluna do título fica fixa enquanto os blocos rolam (`.porque-titulo`, `top: 120px` em `src/styles.css`); no celular vira uma coluna só. O conteúdo da antiga seção "Metodologia" está guardado em `src/data/metodologia.ts` (sem uso).

## Como ajustar o header

O header fixo é translúcido (fundo escuro com desfoque). Ajustes no bloco "Header fixo translúcido" de `src/styles.css` (`.site-header`):

- `--header-alpha`: opacidade no topo da página (0.55).
- `--header-alpha-scrolled`: opacidade depois de rolar (0.72).
- `--header-alpha-menu`: opacidade com o menu do celular aberto (0.85, para leitura).
- `--header-h` / `--header-h-scrolled`: altura antes e depois de rolar (no computador, 76px e 68px).

Sem suporte a desfoque no navegador, o fundo fica sólido (#070B12). Os links do menu ficam em `const navigation` (`src/routes/index.tsx`).

## Como editar as seções Site Personalizado e Quem Somos

Em `src/data/sobre.ts`: objeto `sitePersonalizado` (título, parágrafos, lista, botão e mensagem do WhatsApp) e objeto `quemSomos` (trechos entre `**asteriscos**` ficam em negrito branco; os 3 cards ficam em `cards`).

## SEO (Google e compartilhamento)

Tudo em `src/data/site.ts`:

- **`SITE_URL`**: domínio do site, sem barra no fim. Hoje está `https://SEU-DOMINIO`; troque pelo endereço final (ou pelo da Netlify, ex.: `https://nome-do-site.netlify.app`). Ele é usado no link canônico, no Open Graph, no `/robots.txt`, no `/sitemap.xml` e no JSON-LD.
- **`SITE_TITULO`** e **`SITE_DESCRICAO`**: título da aba/Google e descrição (ideal até ~155 caracteres). **`SITE_DESCRICAO_COMPARTILHAMENTO`**: texto ao compartilhar o link.
- **Imagem de compartilhamento**: `public/og-image.png` (1200x630px). Para trocar, substitua o arquivo mantendo nome e tamanho.
- **Dados estruturados (JSON-LD)**: objeto `organizacaoJsonLd` (nome, cidade, Instagram, logo em `public/logo-code-flow.png`).
- **Sitemap**: se o site ganhar novas páginas, adicione os caminhos em `PAGINAS` (`src/routes/sitemap[.]xml.ts`).

Depois de publicar, cadastre o site no Google Search Console e envie `https://SEU-DOMINIO/sitemap.xml`.
