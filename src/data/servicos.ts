// Serviços exibidos nos cards que viram (seção "Nossos Serviços").
// Para editar: troque os textos abaixo. "icone" deve ser um dos nomes do mapa em ServiceFlipCards.tsx.
export type IconeServico =
  "Target" | "Megaphone" | "LayoutTemplate" | "Globe2" | "Settings2" | "TrendingUp";
export type Servico = {
  titulo: string;
  icone: IconeServico;
  frente: string;
  verso: string;
  itens: string[];
};

export const servicos: Servico[] = [
  {
    titulo: "Tráfego Pago",
    icone: "Target",
    frente: "Anúncios que atraem clientes qualificados.",
    verso:
      "Planejamento e gestão de campanhas de anúncios online para gerar oportunidades de contato e venda.",
    itens: [
      "Campanhas em Meta Ads (Instagram e Facebook) e Google Ads",
      "Definição de público e criativos",
      "Acompanhamento de métricas e otimização contínua",
      "Investimento em anúncios pago direto às plataformas",
    ],
  },
  {
    titulo: "Social Media",
    icone: "Megaphone",
    frente: "Presença digital que fortalece a sua marca.",
    verso:
      "Estratégia, conteúdo e posicionamento para a sua marca se comunicar com o público certo nas redes sociais.",
    itens: [
      "Planejamento de conteúdo",
      "Identidade visual nas redes",
      "Estratégia para o Instagram",
      "Alinhamento com o posicionamento da empresa",
    ],
  },
  {
    titulo: "Landing Pages",
    icone: "LayoutTemplate",
    frente: "Páginas feitas para converter.",
    verso:
      "Páginas estratégicas, rápidas e persuasivas, pensadas para captar contatos e apresentar a sua oferta.",
    itens: [
      "Design alinhado à sua marca",
      "Copy e estrutura focadas em conversão",
      "Layout responsivo",
      "Teste e revisão antes da entrega",
    ],
  },
  {
    titulo: "Sites Institucionais",
    icone: "Globe2",
    frente: "O cartão de visitas digital da sua empresa.",
    verso:
      "Sites modernos, rápidos e alinhados ao posicionamento da sua empresa, com foco em presença e credibilidade.",
    itens: [
      "Layout personalizado",
      "Versão para celular e computador",
      "Estrutura de seções clara",
      "Entrega com documentação",
    ],
  },
  {
    titulo: "Automação de CRM",
    icone: "Settings2",
    frente: "Relacionamento organizado, sem perder contatos.",
    verso:
      "Automatização do relacionamento, do acompanhamento e da organização comercial, para nutrir leads e escalar sem aumentar a equipe.",
    itens: [
      "Captação e organização de leads",
      "Mensagens e fluxos automáticos",
      "Funil comercial em um só lugar",
      "Configurado conforme o seu processo",
    ],
  },
  {
    titulo: "Mentoria Empresarial",
    icone: "TrendingUp",
    frente: "Direção prática para o seu negócio.",
    verso:
      "Orientação prática para organizar, estruturar e desenvolver a estratégia comercial do seu negócio.",
    itens: [
      "Diagnóstico do momento da empresa",
      "Plano com próximos passos claros",
      "Organização do processo comercial",
      "Acompanhamento das etapas",
    ],
  },
];
