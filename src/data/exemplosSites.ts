// Celulares de exemplo do anel 3D na seção "Site Personalizado" (componente PhoneRing).
// São EXEMPLOS DE LAYOUT com marcas fictícias: não são clientes reais. Não use marcas reais aqui.
// Cada tema define as cores da mini-página dentro do celular.
export const ETIQUETA_EXEMPLO = "Exemplo de layout";

export type TemaSite = {
  fundo: string; // fundo da tela
  superficie: string; // fundo dos mini cards e da barra superior
  texto: string; // títulos
  textoSuave: string; // barras de texto e rótulos
  destaque: string; // botão, selo e logo
  textoBotao: string; // texto do botão
  paleta: [string, string, string, string]; // 4 bolinhas do rodapé
};

export type ExemploSite = {
  nicho: string; // usado só no texto alternativo
  marca: string;
  selo: string;
  titulo: string;
  botao: string;
  cards: [string, string, string];
  tema: TemaSite;
};

export const exemplosSites: ExemploSite[] = [
  {
    nicho: "Advocacia",
    marca: "Silva & Associados",
    selo: "Advocacia",
    titulo: "Defesa com clareza",
    botao: "Agendar consulta",
    cards: ["Cível", "Trabalhista", "Família"],
    tema: {
      fundo: "#0d1b2e",
      superficie: "#14263f",
      texto: "#f3efe6",
      textoSuave: "#8d9bb3",
      destaque: "#c9a85c",
      textoBotao: "#0d1b2e",
      paleta: ["#0d1b2e", "#1f3a5f", "#c9a85c", "#f3efe6"],
    },
  },
  {
    nicho: "Odontologia",
    marca: "Clínica Sorriso",
    selo: "Odontologia",
    titulo: "Cuide do seu sorriso",
    botao: "Agendar avaliação",
    cards: ["Limpeza", "Implantes", "Ortodontia"],
    tema: {
      fundo: "#f2fbfb",
      superficie: "#ffffff",
      texto: "#0f3a40",
      textoSuave: "#7aa4a8",
      destaque: "#14b8b0",
      textoBotao: "#ffffff",
      paleta: ["#14b8b0", "#7fdcd6", "#0f3a40", "#ffffff"],
    },
  },
  {
    nicho: "Hamburgueria",
    marca: "Burger Lab",
    selo: "Hamburgueria",
    titulo: "O hambúrguer da casa",
    botao: "Ver cardápio",
    cards: ["Clássicos", "Artesanais", "Combos"],
    tema: {
      fundo: "#141010",
      superficie: "#221a17",
      texto: "#fff4ea",
      textoSuave: "#a08b7d",
      destaque: "#f26a1b",
      textoBotao: "#ffffff",
      paleta: ["#f26a1b", "#d7262b", "#ffb238", "#141010"],
    },
  },
  {
    nicho: "Negócios locais",
    marca: "Loja do Bairro",
    selo: "Comércio local",
    titulo: "Tudo perto de você",
    botao: "Falar no WhatsApp",
    cards: ["Produtos", "Serviços", "Entrega"],
    tema: {
      fundo: "#f6f5f1",
      superficie: "#ffffff",
      texto: "#23302a",
      textoSuave: "#94a097",
      destaque: "#2f9e5b",
      textoBotao: "#ffffff",
      paleta: ["#2f9e5b", "#a8d5b5", "#23302a", "#e7e3d8"],
    },
  },
];
