// Depoimentos da seção "Resultados" (dois carrosséis em sentidos opostos).
// Para editar: troque texto, nome, cargo, segmento e cidade de cada item.
// Os 8 primeiros itens vão na linha de cima (rola para a esquerda) e os 8 últimos na de baixo
// (rola para a direita).
// Avatar: cada pessoa recebe uma ilustração gerada a partir do nome (AvatarIlustrado).
// Para usar foto real, adicione foto: "/caminho/da/foto.jpg" no item, com autorização do cliente.
// Não use porcentagens, valores ou números de resultado que não possam ser comprovados.

// Frase de destaque abaixo dos carrosséis. "Code Flow" aparece em azul automaticamente.
export const FRASE_CREDIBILIDADE =
  "Processo claro, comunicação transparente e entrega documentada: é assim que a Code Flow ajuda empresas a dar o próximo passo no digital.";

// Nota discreta abaixo da frase. Troque para false quando os depoimentos forem reais.
export const MOSTRAR_NOTA_ILUSTRATIVA = true;
export const NOTA_ILUSTRATIVA =
  "Exemplos ilustrativos de depoimentos. Em breve, relatos reais de clientes.";

// Tempo (em segundos) de uma volta completa de cada linha. No celular fica 40% mais lento.
export const VELOCIDADE_LINHA_1_SEGUNDOS = 55;
export const VELOCIDADE_LINHA_2_SEGUNDOS = 70;

export type Depoimento = {
  texto: string;
  nome: string;
  cargo: string;
  segmento: string;
  cidade: string;
  /** true enquanto o depoimento for um exemplo ilustrativo. */
  ilustrativo: boolean;
  /** Foto real (opcional, com autorização); sem foto, o avatar é ilustrado. */
  foto?: string | undefined;
};

export const depoimentos: Depoimento[] = [
  // ===== Linha 1 =====
  {
    texto:
      "O atendimento inicial pelo WhatsApp ficou organizado. Agora acompanhamos cada contato do primeiro 'oi' até o agendamento.",
    nome: "Dr. Rafael M.",
    cargo: "Dentista",
    segmento: "Odontologia",
    cidade: "Campinas, SP",
    ilustrativo: true,
  },
  {
    texto:
      "Eles entenderam a rotina da clínica antes de propor qualquer coisa. O site e as campanhas ficaram alinhados ao que realmente oferecemos.",
    nome: "Camila A.",
    cargo: "Proprietária",
    segmento: "Clínica de Estética",
    cidade: "Goiânia, GO",
    ilustrativo: true,
  },
  {
    texto:
      "Precisávamos de um site sóbrio e de um fluxo para organizar os contatos. A comunicação foi clara em todas as etapas.",
    nome: "Dr. Henrique D.",
    cargo: "Advogado",
    segmento: "Advocacia",
    cidade: "Belo Horizonte, MG",
    ilustrativo: true,
  },
  {
    texto:
      "A landing page ficou rápida e objetiva. Os pedidos de orçamento chegam mais completos e fáceis de responder.",
    nome: "Marcos T.",
    cargo: "Proprietário",
    segmento: "Comércio Local",
    cidade: "Curitiba, PR",
    ilustrativo: true,
  },
  {
    texto:
      "A mentoria ajudou a organizar o processo comercial. Saí das reuniões com um plano claro e próximos passos definidos.",
    nome: "Juliana R.",
    cargo: "Consultora",
    segmento: "Consultoria",
    cidade: "São Paulo, SP",
    ilustrativo: true,
  },
  {
    texto:
      "Gostei da documentação. Recebi tudo explicado, sei como cada automação funciona e consigo ajustar sem depender de ninguém.",
    nome: "Dra. Patrícia L.",
    cargo: "Dentista",
    segmento: "Odontologia",
    cidade: "Brasília, DF",
    ilustrativo: true,
  },
  {
    texto:
      "O diagnóstico inicial mostrou pontos que a gente nem enxergava na nossa presença digital. Foi um começo bem consistente.",
    nome: "Fernanda S.",
    cargo: "Esteticista",
    segmento: "Clínica de Estética",
    cidade: "Florianópolis, SC",
    ilustrativo: true,
  },
  {
    texto:
      "Entrega dentro do combinado, com teste e revisão antes de publicar. Dá segurança trabalhar com um processo assim.",
    nome: "Dr. Eduardo C.",
    cargo: "Advogado",
    segmento: "Advocacia",
    cidade: "Recife, PE",
    ilustrativo: true,
  },
  // ===== Linha 2 =====
  {
    texto: "A equipe explicou cada etapa antes de executar e isso deu muita segurança.",
    nome: "Luciana P.",
    cargo: "Diretora",
    segmento: "Educação",
    cidade: "Londrina, PR",
    ilustrativo: true,
  },
  {
    texto: "O site ficou rápido e do jeito que a clínica queria, com a nossa identidade.",
    nome: "Dra. Beatriz N.",
    cargo: "Fisioterapeuta",
    segmento: "Saúde",
    cidade: "Ribeirão Preto, SP",
    ilustrativo: true,
  },
  {
    texto: "O acompanhamento semanal ajudou a organizar o atendimento dos contatos.",
    nome: "Roberto F.",
    cargo: "Proprietário",
    segmento: "Serviços",
    cidade: "Salvador, BA",
    ilustrativo: true,
  },
  {
    texto:
      "As campanhas passaram a falar com o público certo, e os contatos chegam com dúvidas mais claras sobre os procedimentos.",
    nome: "Aline V.",
    cargo: "Sócia",
    segmento: "Clínica de Estética",
    cidade: "Fortaleza, CE",
    ilustrativo: true,
  },
  {
    texto:
      "Organizamos o funil comercial em um só lugar, e a equipe parou de perder conversas no WhatsApp.",
    nome: "Gustavo L.",
    cargo: "Gerente comercial",
    segmento: "Comércio Local",
    cidade: "Porto Alegre, RS",
    ilustrativo: true,
  },
  {
    texto:
      "Recebemos um plano simples, com próximos passos que a equipe conseguiu seguir sem complicação.",
    nome: "Renata O.",
    cargo: "Sócia-diretora",
    segmento: "Consultoria",
    cidade: "Vitória, ES",
    ilustrativo: true,
  },
  {
    texto:
      "O site do escritório ficou sóbrio e fácil de navegar, do jeito que nossos clientes esperam.",
    nome: "Dr. Paulo S.",
    cargo: "Advogado",
    segmento: "Advocacia",
    cidade: "Natal, RN",
    ilustrativo: true,
  },
  {
    texto:
      "Tiraram nossas dúvidas com paciência e deixaram documentado tudo o que foi configurado.",
    nome: "Dr. Thiago R.",
    cargo: "Dentista",
    segmento: "Odontologia",
    cidade: "Uberlândia, MG",
    ilustrativo: true,
  },
];

export const depoimentosLinha1 = depoimentos.slice(0, 8);
export const depoimentosLinha2 = depoimentos.slice(8);
