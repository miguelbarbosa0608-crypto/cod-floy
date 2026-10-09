# CodeFlow — Landing Page

Site de apresentação (uma única página) da **CodeFlow**, empresa de tecnologia, marketing e automação. Todo o conteúdo está em português.

> Guia rápido de edição: veja **GUIA-DE-EDICAO.md**. Árvore completa de arquivos: veja **docs/ESTRUTURA.md**.

## Tecnologias usadas

- **React 19** + **TypeScript** — construção da página
- **TanStack Start / TanStack Router** — estrutura do site e rotas
- **Vite** — servidor de desenvolvimento e geração do site final
- **Tailwind CSS v4** — estilos (configurado em `src/styles.css`, não existe `tailwind.config.js`)
- **Lovable Cloud** — banco de dados que guarda os contatos enviados pelo formulário
- **lucide-react** — ícones

## Estrutura de pastas (resumo)

```text
public/            Arquivos públicos (favicon, robots.txt)
src/
  routes/
    index.tsx      A página inteira: textos, listas, seções, links
    __root.tsx     Estrutura HTML base, fonte e título padrão
  styles.css       Cores, fonte, bordas e efeitos visuais
  lib/
    contact.functions.ts  Validação e envio do formulário
  components/ui/   Componentes prontos (botões etc.)
  integrations/    Conexão com o banco de dados (gerado automaticamente)
supabase/          Configuração e histórico do banco de dados
docs/ESTRUTURA.md  Árvore completa e função de cada arquivo
```

## Como instalar e rodar no VS Code

1. Instale o **Node.js** (versão 20 ou superior): https://nodejs.org
2. Baixe o projeto (ZIP ou `git clone`) e abra a pasta no VS Code.
3. Abra o terminal do VS Code (menu **Terminal > Novo Terminal**) e rode:

```sh
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre o site em modo desenvolvimento (http://localhost:8080 ou o endereço mostrado)
npm run build    # gera a versão final para publicação
```

O arquivo `.env` contém os endereços públicos do banco de dados. Mantenha-o na pasta para o formulário funcionar.

## Como editar

Quase tudo está em **`src/routes/index.tsx`**. No topo do arquivo ficam as listas de conteúdo:

| O que mudar | Onde |
|---|---|
| Link do WhatsApp | constante `whatsappUrl` |
| Link do Instagram | `INSTAGRAM_URL` em `src/data/config.ts` |
| Menu | lista `navigation` |
| Serviços | lista `services` |
| Metodologia (etapas) | lista `steps` |
| Depoimentos | `src/data/depoimentos.ts` |
| Diferenciais | lista `differences` |
| Títulos e textos das seções | dentro da função `Home`, procure o texto com Ctrl+F |
| Título do Google / redes sociais | bloco `head` em `index.tsx` |

**Cores e fonte:** em `src/styles.css`, no bloco `:root`. Exemplo: `--primary` é o azul principal, `--background` é o fundo, `--whatsapp` é o verde. Você pode trocar o valor por um código hexadecimal, ex.: `--primary: #0A8CFF;`.

**Ícones:** cada item usa um ícone do lucide (ex.: `Target`, `Rocket`). Escolha outro em https://lucide.dev, adicione o nome na linha `import { ... } from 'lucide-react'` e troque no item.

## Como trocar a logo

Hoje a logo é escrita em texto (função `Logo` em `src/routes/index.tsx`).
Para usar uma imagem:

1. Coloque o arquivo em `src/assets/` (ex.: `src/assets/logo.png`).
2. Em `index.tsx`, adicione `import logo from '@/assets/logo.png';`
3. Dentro da função `Logo`, troque os `<span>` por `<img src={logo} alt="CodeFlow" className="h-8 w-auto" />`.

Para o ícone da aba do navegador, substitua `public/favicon.svg` (mesmo nome).

## Formulário de contato

A validação e o envio ficam em `src/lib/contact.functions.ts`. Os contatos são salvos na tabela `contact_leads` do Lovable Cloud (visível no painel do Lovable, não é público). Para enviar também por e-mail, planilha ou CRM, adicione a chamada dentro do `handler`, logo após o `insert`.

## Como publicar

- **Pelo Lovable (recomendado):** botão **Publish** no editor. Assim o formulário continua salvando no banco automaticamente.
- **Vercel / Netlify / outra hospedagem:** conecte o repositório do GitHub, comando de build `npm run build`. Este projeto usa recursos de servidor (o formulário), então escolha uma hospedagem com suporte a Node/funções de servidor e copie as variáveis do `.env` nas configurações da hospedagem.

## Enviar para o GitHub

```sh
git remote add novo https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push novo main
```

## Fundo animado do topo (Hero)

Arquivo: `src/components/HeroWaves.tsx`. No topo do arquivo, em "CONFIGURAÇÃO EDITÁVEL":
- `COR_LINHAS` / `COR_PARTICULAS` — cores (hexadecimal)
- `OPACIDADE_LINHAS` — intensidade das linhas
- `VELOCIDADE_ONDA` / `ALTURA_ONDA` — velocidade e altura das ondas
- `PARTICULAS_DESKTOP` / `PARTICULAS_MOBILE` — quantidade de partículas

## Depoimentos

Arquivo: `src/data/depoimentos.ts`. Edite texto, destaque, nome, cargo, segmento e ícone (`Smile`, `Sparkles` ou `Scale`). Para esconder a nota "Depoimentos ilustrativos", mude `MOSTRAR_NOTA_ILUSTRATIVA` para `false`.

## Depoimentos (carrossel), FAQ e botões

- **Depoimentos:** `src/data/depoimentos.ts`. Edite texto, nome, segmento, cidade e ícone. Velocidade: `VELOCIDADE_CARROSSEL_SEGUNDOS`. Para remover a nota ilustrativa: `MOSTRAR_NOTA_ILUSTRATIVA = false` e apague o campo `ilustrativo` dos itens.
- **FAQ:** `src/data/faq.ts` — lista de `pergunta` e `resposta`.
- **Efeitos dos botões:** final de `src/styles.css`, bloco "Efeitos dos botões" (classes `btn-primary`, `btn-secondary`, `btn-whatsapp`, `btn-whatsapp-float`). Efeito dos cards: `.feature-card`.
