// Seção "Por que escolher a Code Flow" (id="por-que"): título fixo à esquerda e blocos à direita.
// Só adicione afirmações que sejam verdadeiras, por exemplo frequência de relatórios, só se a
// Code Flow realmente entregar. Não use números de resultado.
// "icone" precisa ser um dos nomes do mapa em src/components/PorQue.tsx (ícones do lucide-react).
export type IconePorQue =
  "Puzzle" | "Target" | "LayoutTemplate" | "Workflow" | "ListChecks" | "MessagesSquare";

export const porQueCabecalho = {
  rotulo: "Por que a Code Flow",
  titulo: "Por que empresas escolhem a",
  tituloDestaque: "Code Flow",
  frase: "Um processo claro, do diagnóstico à entrega.",
  botao: "Falar com Especialista",
};

export const motivos: { icone: IconePorQue; titulo: string; texto: string }[] = [
  {
    icone: "Puzzle",
    titulo: "Solução integrada",
    texto:
      "Marketing, tecnologia e automação trabalham juntos. Em vez de contratar vários fornecedores para peças soltas, você tem uma equipe que estrutura uma solução completa, do anúncio ao atendimento.",
  },
  {
    icone: "Target",
    titulo: "Tráfego pago com acompanhamento",
    texto:
      "Planejamos e gerenciamos campanhas de anúncios online para atrair pessoas interessadas no que você oferece. Definimos público e criativos, acompanhamos as métricas e ajustamos a estratégia ao longo do tempo.",
  },
  {
    icone: "LayoutTemplate",
    titulo: "Sites e landing pages sob medida",
    texto:
      "Criamos páginas personalizadas, rápidas e responsivas, alinhadas à identidade da sua marca e pensadas para transformar visitantes em contatos.",
  },
  {
    icone: "Workflow",
    titulo: "Automação de CRM",
    texto:
      "Organizamos a captação de leads, as mensagens e o acompanhamento comercial em um só lugar, para que nenhum contato fique sem resposta e sua equipe saiba quem atender primeiro.",
  },
  {
    icone: "ListChecks",
    titulo: "Processo em 6 etapas",
    texto:
      "Diagnóstico, planejamento, execução, teste e QA, documentação e entrega. Você acompanha cada etapa, com escopo, responsáveis e prazos combinados antes de começarmos.",
  },
  {
    icone: "MessagesSquare",
    titulo: "Comunicação clara e documentação",
    texto:
      "Explicamos antes de executar, mantemos você informado e entregamos tudo documentado, para que você entenda o que foi feito e saiba como usar.",
  },
];
