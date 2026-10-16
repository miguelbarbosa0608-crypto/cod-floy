// Equipe exibida no carrossel "Nossa Equipe" (a ordem abaixo é a ordem do carrossel).
// Para trocar a foto: substitua o arquivo em src/assets/equipe/ mantendo o mesmo nome
// (JPG, de preferência com até ~900px de largura).
// Sem foto (foto: undefined), o card mostra automaticamente um placeholder com as iniciais.
// objectPosition ajusta o enquadramento do rosto ("50% 35%" = centro horizontal, 35% do topo).
import miguel from "@/assets/equipe/miguel.jpg";
import vitor from "@/assets/equipe/vitor.jpg";
import rodrigo from "@/assets/equipe/rodrigo.jpg";
import ramalho from "@/assets/equipe/ramalho.jpg";
import matheus from "@/assets/equipe/matheus.jpg";
import leonardo from "@/assets/equipe/leonardo.jpg";

export type Membro = {
  nome: string;
  funcaoCurta: string;
  funcaoCompleta: string;
  descricao: string;
  foto?: string | undefined;
  objectPosition: string;
};

const colaborativo =
  "Atua de forma colaborativa na execução das atividades, apoia as áreas do projeto e participa das entregas conforme a necessidade da equipe.";

export const equipe: Membro[] = [
  {
    nome: "Miguel Barbosa Andrade",
    funcaoCurta: "Líder Técnico",
    funcaoCompleta: "Líder Técnico / Especialista de Execução",
    descricao:
      "Responsável pela arquitetura técnica, pela padronização da execução e pela definição das soluções. Resolve gargalos operacionais e técnicos e também atua na gestão de anúncios online.",
    foto: miguel,
    objectPosition: "50% 35%",
  },
  {
    nome: "Vitor Rodrigues",
    funcaoCurta: "Gerente de Projetos",
    funcaoCompleta: "Gerente de Projetos / Scrum Master",
    descricao:
      "Cuida do cronograma, organiza as tarefas no quadro Kanban, acompanha cada etapa do projeto e mantém a comunicação direta com o cliente.",
    foto: vitor,
    objectPosition: "50% 40%",
  },
  {
    nome: "Rodrigo Miranda",
    funcaoCurta: "Integrante da Equipe",
    funcaoCompleta: "Integrante da Equipe",
    descricao: colaborativo,
    foto: rodrigo,
    objectPosition: "70% 30%",
  },
  {
    nome: "Gabriel Ramalho",
    funcaoCurta: "Documentação e Compliance",
    funcaoCompleta: "Analista de Documentação e Compliance",
    descricao:
      "Responsável pelo dossiê técnico, pela documentação do projeto, pelos manuais de operação, pelo registro das etapas, pelas evidências das entregas e pela organização dos documentos.",
    foto: ramalho,
    objectPosition: "50% 25%",
  },
  {
    nome: "Matheus Carminha",
    funcaoCurta: "Integrante da Equipe",
    funcaoCompleta: "Integrante da Equipe",
    descricao: colaborativo,
    foto: matheus,
    objectPosition: "50% 20%",
  },
  {
    nome: "Leonardo",
    funcaoCurta: "QA e Normas",
    funcaoCompleta: "Analista de Qualidade (QA) e Normas",
    descricao:
      "Verifica se as entregas atendem às normas técnicas, padrões de segurança, requisitos e especificações definidos para o projeto.",
    foto: leonardo,
    objectPosition: "50% 25%",
  },
];

export const FRASE_EQUIPE =
  "Cada integrante responde pelo padrão de qualidade da sua área, e todos colaboram na execução.";

export const iniciais = (nome: string) =>
  nome
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
