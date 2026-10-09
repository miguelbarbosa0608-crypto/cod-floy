// Depoimentos do carrossel da seção "Resultados".
// Para editar: troque texto, nome, segmento, cidade e ícone de cada item.
// "icone" aceita: 'Smile', 'Sparkles', 'Scale', 'Store', 'Briefcase' (ícones do lucide-react).
// Velocidade do carrossel: VELOCIDADE_CARROSSEL_SEGUNDOS (tempo de uma volta completa).

// Mude para false quando substituir por depoimentos reais e remova o campo ilustrativo dos itens.
export const MOSTRAR_NOTA_ILUSTRATIVA = true;
export const NOTA_ILUSTRATIVA = 'Exemplos ilustrativos de depoimentos. Em breve, relatos reais de clientes.';

// Frase de destaque abaixo do carrossel. "Code Flow" aparece em azul automaticamente.
export const FRASE_CREDIBILIDADE = 'Processo claro, comunicação transparente e entrega documentada: é assim que a Code Flow ajuda empresas a dar o próximo passo no digital.';

// Tempo (em segundos) de uma volta completa. No celular fica 40% mais lento.
export const VELOCIDADE_CARROSSEL_SEGUNDOS = 50;

export type IconeSegmento = 'Smile' | 'Sparkles' | 'Scale' | 'Store' | 'Briefcase';
export type Depoimento = {
  texto: string;
  nome: string;
  segmento: string;
  cidade: string;
  icone: IconeSegmento;
  ilustrativo?: boolean;
};

export const depoimentos: Depoimento[] = [
  { texto: "O atendimento inicial pelo WhatsApp ficou organizado. Agora acompanhamos cada contato do primeiro 'oi' até o agendamento.", nome: 'Dr. Rafael M.', segmento: 'Odontologia', cidade: 'Campinas, SP', icone: 'Smile', ilustrativo: true },
  { texto: 'Eles entenderam a rotina da clínica antes de propor qualquer coisa. O site e as campanhas ficaram alinhados ao que realmente oferecemos.', nome: 'Camila A.', segmento: 'Clínica de Estética', cidade: 'Goiânia, GO', icone: 'Sparkles', ilustrativo: true },
  { texto: 'Precisávamos de um site sóbrio e de um fluxo para organizar os contatos. A comunicação foi clara em todas as etapas.', nome: 'Dr. Henrique D.', segmento: 'Advocacia', cidade: 'Belo Horizonte, MG', icone: 'Scale', ilustrativo: true },
  { texto: 'A landing page ficou rápida e objetiva. Os pedidos de orçamento chegam mais completos e fáceis de responder.', nome: 'Marcos T.', segmento: 'Comércio Local', cidade: 'Curitiba, PR', icone: 'Store', ilustrativo: true },
  { texto: 'A mentoria ajudou a organizar o processo comercial. Saí das reuniões com um plano claro e próximos passos definidos.', nome: 'Juliana R.', segmento: 'Consultoria', cidade: 'São Paulo, SP', icone: 'Briefcase', ilustrativo: true },
  { texto: 'Gostei da documentação. Recebi tudo explicado, sei como cada automação funciona e consigo ajustar sem depender de ninguém.', nome: 'Dra. Patrícia L.', segmento: 'Odontologia', cidade: 'Brasília, DF', icone: 'Smile', ilustrativo: true },
  { texto: 'O diagnóstico inicial mostrou pontos que a gente nem enxergava na nossa presença digital. Foi um começo bem consistente.', nome: 'Fernanda S.', segmento: 'Clínica de Estética', cidade: 'Florianópolis, SC', icone: 'Sparkles', ilustrativo: true },
  { texto: 'Entrega dentro do combinado, com teste e revisão antes de publicar. Dá segurança trabalhar com um processo assim.', nome: 'Dr. Eduardo C.', segmento: 'Advocacia', cidade: 'Recife, PE', icone: 'Scale', ilustrativo: true },
];
