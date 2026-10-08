// Depoimentos da seção "Resultados".
// Para editar: troque texto, destaque, nome, cargo e segmento de cada item.
// "icone" aceita: 'Smile', 'Sparkles' ou 'Scale' (ícones do lucide-react).
// Quando tiver depoimentos reais, troque os itens, mude "ilustrativo" para false
// e coloque MOSTRAR_NOTA_ILUSTRATIVA = false para esconder a nota abaixo dos cards.

export const MOSTRAR_NOTA_ILUSTRATIVA = true;
export const NOTA_ILUSTRATIVA = 'Depoimentos ilustrativos. Em breve, histórias reais de clientes por aqui.';

export type Depoimento = {
  texto: string;
  destaque: string;
  nome: string;
  cargo: string;
  segmento: string;
  icone: 'Smile' | 'Sparkles' | 'Scale';
  ilustrativo: boolean;
};

export const depoimentos: Depoimento[] = [
  {
    texto: 'Antes, cada paciente que chamava no WhatsApp ficava esperando resposta. Com a landing page e a automação que a Code Flow estruturou, o primeiro atendimento ficou organizado e a equipe passou a acompanhar cada contato com clareza.',
    destaque: 'Atendimento mais organizado',
    nome: 'Dr. Rafael Menezes', cargo: 'Cirurgião-dentista', segmento: 'Clínica Odontológica',
    icone: 'Smile', ilustrativo: true,
  },
  {
    texto: 'Eles começaram entendendo a rotina da clínica, e não oferecendo um pacote pronto. O site novo e a gestão de tráfego deixaram nossa presença digital mais profissional e alinhada ao que realmente oferecemos.',
    destaque: 'Presença digital profissional',
    nome: 'Camila Andrade', cargo: 'Diretora', segmento: 'Clínica de Estética',
    icone: 'Sparkles', ilustrativo: true,
  },
  {
    texto: 'Precisávamos de um site sóbrio e de um fluxo para organizar os contatos recebidos. A comunicação foi clara em todas as etapas, e a documentação e a entrega foram muito bem explicadas.',
    destaque: 'Processo claro e bem documentado',
    nome: 'Dr. Henrique Duarte', cargo: 'Sócio', segmento: 'Escritório de Advocacia',
    icone: 'Scale', ilustrativo: true,
  },
];
