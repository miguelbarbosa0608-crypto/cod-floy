// Dados de SEO e do domínio do site (usados nas meta tags, no robots.txt, no sitemap.xml e no JSON-LD).
// IMPORTANTE: troque SITE_URL pelo domínio final assim que ele existir, sem barra no fim.
// Ex.: "https://codeflow.com.br" ou o endereço da Netlify "https://nome-do-site.netlify.app".
import { INSTAGRAM_URL } from "@/data/config";

export const SITE_URL = "https://SEU-DOMINIO";

export const SITE_NOME = "Code Flow";
export const SITE_TITULO = "Code Flow | Tecnologia, Marketing e Automação";
export const SITE_DESCRICAO =
  "Soluções digitais integradas em tecnologia, marketing e automação para fortalecer a presença digital e as vendas do seu negócio.";
export const SITE_DESCRICAO_COMPARTILHAMENTO =
  "Soluções digitais integradas para transformar estratégia em resultados reais.";

// Imagem que aparece ao compartilhar o link (WhatsApp, Instagram, LinkedIn...): 1200x630px em public/
export const IMAGEM_COMPARTILHAMENTO = {
  caminho: "/og-image.png",
  largura: 1200,
  altura: 630,
  alt: "Code Flow — Tecnologia, Marketing e Automação",
};

export const urlAbsoluta = (caminho: string) => `${SITE_URL}${caminho}`;

// Dados estruturados (JSON-LD) da empresa para o Google
export const organizacaoJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NOME,
  url: `${SITE_URL}/`,
  logo: urlAbsoluta("/logo-code-flow.png"),
  description: SITE_DESCRICAO,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Goiânia",
    addressRegion: "GO",
    addressCountry: "BR",
  },
  sameAs: [INSTAGRAM_URL],
};
