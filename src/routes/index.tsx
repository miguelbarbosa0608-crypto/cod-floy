import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Instagram,
  Menu,
  MessageCircle,
  Quote,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { enviarParaNetlifyForms } from "@/lib/netlifyForms";
import { Plus } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import logoUrl from "@/assets/code-flow-logo-compacta.png";
import HeroWaves from "@/components/HeroWaves";
import ServiceFlipCards from "@/components/ServiceFlipCards";
import TeamCarousel from "@/components/TeamCarousel";
import OrbitButton from "@/components/OrbitButton";
import PorQue from "@/components/PorQue";
import Marquee from "@/components/Marquee";
import {
  ferramentas,
  TITULO_FERRAMENTAS,
  VELOCIDADE_FERRAMENTAS_SEGUNDOS,
} from "@/data/ferramentas";
import { FRASE_EQUIPE } from "@/data/equipe";
import SitePersonalizado from "@/components/SitePersonalizado";
import QuemSomos from "@/components/QuemSomos";
import {
  depoimentosLinha1,
  depoimentosLinha2,
  FRASE_CREDIBILIDADE,
  MOSTRAR_NOTA_ILUSTRATIVA,
  NOTA_ILUSTRATIVA,
  VELOCIDADE_LINHA_1_SEGUNDOS,
  VELOCIDADE_LINHA_2_SEGUNDOS,
  type Depoimento,
} from "@/data/depoimentos";
import AvatarIlustrado from "@/components/AvatarIlustrado";
import { faq } from "@/data/faq";
import { INSTAGRAM_URL } from "@/data/config";
import {
  IMAGEM_COMPARTILHAMENTO,
  organizacaoJsonLd,
  SITE_DESCRICAO,
  SITE_DESCRICAO_COMPARTILHAMENTO,
  SITE_NOME,
  SITE_TITULO,
  urlAbsoluta,
} from "@/data/site";

// WhatsApp contact link provided by the agency.
const whatsappUrl = "https://www.contate.me/556292543903";

const navigation = [
  ["Sobre", "#quem-somos"],
  ["Serviços", "#servicos"],
  ["Por que a Code Flow", "#por-que"],
  ["Resultados", "#resultados"],
  ["Equipe", "#equipe"],
  ["Contato", "#contato"],
  ["FAQ", "#faq"],
];
// Depoimentos ficam em src/data/depoimentos.ts.
// Card de depoimento (estilos no bloco "Depoimentos" de src/styles.css).
function DepoimentoCard({ item }: { item: Depoimento }) {
  return (
    <article className="testimonial-card">
      <div className="flex items-center gap-3">
        <AvatarIlustrado nome={item.nome} foto={item.foto} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#F7F9FC]">{item.nome}</p>
          <p className="truncate text-xs text-[#C9D0DA]/80">
            {item.cargo} · {item.segmento} · {item.cidade}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#C9D0DA]">“{item.texto}”</p>
    </article>
  );
}

export const Route = createFileRoute("/")({
  // SEO da página (textos e domínio em src/data/site.ts)
  head: () => ({
    meta: [
      { title: SITE_TITULO },
      { name: "description", content: SITE_DESCRICAO },
      { property: "og:title", content: SITE_TITULO },
      { property: "og:description", content: SITE_DESCRICAO_COMPARTILHAMENTO },
      { property: "og:type", content: "website" },
      { property: "og:url", content: urlAbsoluta("/") },
      { property: "og:site_name", content: SITE_NOME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: urlAbsoluta(IMAGEM_COMPARTILHAMENTO.caminho) },
      { property: "og:image:width", content: String(IMAGEM_COMPARTILHAMENTO.largura) },
      { property: "og:image:height", content: String(IMAGEM_COMPARTILHAMENTO.altura) },
      { property: "og:image:alt", content: IMAGEM_COMPARTILHAMENTO.alt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITULO },
      { name: "twitter:description", content: SITE_DESCRICAO_COMPARTILHAMENTO },
      { name: "twitter:image", content: urlAbsoluta(IMAGEM_COMPARTILHAMENTO.caminho) },
    ],
    links: [{ rel: "canonical", href: urlAbsoluta("/") }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(organizacaoJsonLd) }],
  }),
  component: Home,
});

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#inicio"
      aria-label="Code Flow, voltar ao início"
      className="inline-flex shrink-0 items-center"
    >
      <img
        src={logoUrl}
        alt="Logo Code Flow"
        width={693}
        height={395}
        className={`h-10 w-auto sm:h-11 ${footer ? "sm:h-14" : ""}`}
      />
    </a>
  );
}
function SectionHeading({
  eyebrow,
  children,
  subtitle,
}: {
  eyebrow: string;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-11 max-w-2xl text-center sm:mb-16">
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {children}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Header mais opaco e um pouco mais baixo depois que a página rola (estilos em .site-header).
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const dados = {
      name: String(values.get("name") ?? "").trim(),
      whatsapp: String(values.get("whatsapp") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      company: String(values.get("company") ?? "").trim(),
      website: String(values.get("website") ?? ""),
    };
    // Robô (honeypot preenchido): finge sucesso sem enviar nada.
    if (dados.website) {
      form.reset();
      setStatus("success");
      return;
    }
    setSending(true);
    setStatus("idle");
    // Único destino: Netlify Forms (src/lib/netlifyForms.ts). Em erro, os dados ficam no formulário.
    const recebido = await enviarParaNetlifyForms(dados).catch(() => false);
    if (recebido) form.reset();
    setStatus(recebido ? "success" : "error");
    setSending(false);
  };
  return (
    <div className="site-shell min-h-screen">
      <header
        className="site-header fixed inset-x-0 top-0 z-50"
        data-scrolled={rolou}
        data-menu-open={menuOpen}
      >
        <div className="site-header-bar mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-4 whitespace-nowrap lg:flex xl:gap-7"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <OrbitButton href="#contato" className="primary-glow ml-1 h-10 px-5 text-sm font-bold">
              Falar com Especialista
            </OrbitButton>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="btn-secondary lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        {menuOpen && (
          <nav
            aria-label="Menu móvel"
            className="flex max-h-[calc(100dvh-64px)] flex-col gap-1 overflow-y-auto border-t border-[rgb(92_184_255/0.12)] px-5 py-5 lg:hidden"
          >
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-border/60 py-4 text-lg font-semibold text-foreground"
              >
                {label}
                <ChevronRight size={18} className="text-primary" />
              </a>
            ))}
            <OrbitButton
              href="#contato"
              onClick={() => setMenuOpen(false)}
              icon={<ArrowRight size={16} />}
              className="primary-glow mt-5 h-12 w-full text-sm font-bold"
            >
              Falar com Especialista
            </OrbitButton>
          </nav>
        )}
      </header>

      <main>
        <section
          id="inicio"
          className="hero-scene relative flex min-h-[730px] flex-col justify-center overflow-hidden pt-28 sm:min-h-[760px] lg:min-h-[770px] lg:pt-24"
        >
          <HeroWaves />
          <div
            className="hero-readability pointer-events-none absolute inset-0 z-[1]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-14 text-center sm:px-8 lg:pb-20">
            <div className="flow-in mb-7 inline-flex max-w-full items-center rounded-full border border-primary/35 bg-primary/5 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
              Tecnologia, Marketing e Automação
            </div>
            <h1 className="flow-in flow-delay mx-auto max-w-4xl text-[clamp(2.15rem,4.7vw,4.9rem)] font-bold leading-[1.13] text-foreground">
              Soluções Digitais que Geram
              <br className="hidden sm:block" />{" "}
              <span className="text-primary">Resultados Reais.</span>
            </h1>
            <p className="flow-in flow-delay-more mx-auto mt-7 max-w-2xl text-base leading-[1.8] text-muted-foreground sm:text-lg">
              Somos uma empresa de tecnologia, marketing e automação que une desenvolvimento,
              estratégia e processos inteligentes para fortalecer a presença digital e as vendas do
              seu negócio.
            </p>
            <div className="flow-in flow-delay-more mx-auto mt-10 flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
              <OrbitButton
                href="#contato"
                icon={<ArrowRight size={16} />}
                className="primary-glow h-14 px-7 text-sm font-bold sm:text-base"
              >
                Quero Transformar Meu Negócio
              </OrbitButton>
              <OrbitButton
                variant="secondary"
                href="#servicos"
                className="h-14 px-8 text-sm font-semibold sm:text-base"
              >
                Conheça Nossos Serviços
              </OrbitButton>
            </div>
          </div>
        </section>
        <div className="section-rule" />
        <section aria-labelledby="ferramentas-titulo" className="mx-auto max-w-7xl py-10 sm:py-14">
          <p
            id="ferramentas-titulo"
            className="mb-6 px-5 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground sm:mb-8"
          >
            {TITULO_FERRAMENTAS}
          </p>
          <Marquee
            duration={VELOCIDADE_FERRAMENTAS_SEGUNDOS}
            gap={56}
            aria-label={TITULO_FERRAMENTAS}
            groupClassName="items-center"
          >
            {ferramentas.map((nome) => (
              <span key={nome} className="tool-name">
                {nome}
              </span>
            ))}
          </Marquee>
        </section>
        <div className="section-rule" />
        <SitePersonalizado />
        <div className="section-rule" />
        <QuemSomos />
        <div className="section-rule" />

        <section id="servicos" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <SectionHeading
            eyebrow="Nossos Serviços"
            subtitle="Cada serviço é pensado para unir tecnologia, estratégia e performance no seu negócio."
          >
            Soluções que Geram <span className="text-primary">Resultados</span>
          </SectionHeading>
          <ServiceFlipCards />
        </section>
        <div className="section-rule" />

        <PorQue />
        <div className="section-rule" />

        <section
          id="resultados"
          className="overflow-hidden mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
        >
          <SectionHeading eyebrow="Resultados">
            O Que Nossos Clientes <span className="text-primary">Dizem</span>
          </SectionHeading>
          {/* Dois carrosséis em sentidos opostos (dados em src/data/depoimentos.ts). */}
          <div className="-mx-5 space-y-5 sm:-mx-8 lg:-mx-10">
            <Marquee
              duration={VELOCIDADE_LINHA_1_SEGUNDOS}
              gap={20}
              className="py-2"
              aria-label="Depoimentos, linha 1"
            >
              {depoimentosLinha1.map((item) => (
                <DepoimentoCard key={item.nome} item={item} />
              ))}
            </Marquee>
            <Marquee
              duration={VELOCIDADE_LINHA_2_SEGUNDOS}
              gap={20}
              reverse
              className="py-2"
              aria-label="Depoimentos, linha 2"
            >
              {depoimentosLinha2.map((item) => (
                <DepoimentoCard key={item.nome} item={item} />
              ))}
            </Marquee>
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-silver sm:text-lg">
            {FRASE_CREDIBILIDADE.split("Code Flow").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="font-semibold text-primary">Code Flow</span>
                )}
              </span>
            ))}
          </p>
          {MOSTRAR_NOTA_ILUSTRATIVA && (
            <p className="mt-4 text-center text-xs text-muted-foreground/70">{NOTA_ILUSTRATIVA}</p>
          )}
        </section>
        <div className="section-rule" />

        <section id="equipe" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <SectionHeading
            eyebrow="Nossa Equipe"
            subtitle="Pessoas com funções claras, trabalhando juntas para entregar soluções que funcionam."
          >
            Quem faz a <span className="text-primary">Code Flow acontecer</span>
          </SectionHeading>
          <TeamCarousel />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-7 text-muted-foreground sm:text-base">
            {FRASE_EQUIPE}
          </p>
        </section>
        <div className="section-rule" />

        <section id="contato" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <SectionHeading
            eyebrow="Vamos Conversar"
            subtitle="Preencha o formulário e receba um diagnóstico gratuito da sua presença digital."
          >
            Pronto para Transformar seu <span className="text-primary">Negócio?</span>
          </SectionHeading>
          <div className="feature-card mx-auto max-w-2xl p-6 sm:p-10">
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              {[
                ["name", "Nome", "Seu nome completo", "text"],
                ["whatsapp", "WhatsApp", "(00) 00000-0000", "tel"],
                ["email", "E-mail", "seu@email.com", "email"],
                ["company", "Empresa", "Nome da sua empresa", "text"],
              ].map(([name, label, placeholder, type]) => (
                <label key={name} className="block text-sm font-semibold text-foreground">
                  {label}
                  <input
                    className="form-field mt-2 block h-12 w-full px-4 text-sm font-normal placeholder:text-muted-foreground/55"
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    required
                    minLength={name === "whatsapp" ? 10 : 2}
                    pattern={name === "whatsapp" ? String.raw`\+?[\d\s\(\)\-]{10,20}` : undefined}
                    title={
                      name === "whatsapp"
                        ? "Informe o WhatsApp com DDD, ex.: (62) 99999-9999"
                        : undefined
                    }
                    autoComplete={
                      name === "name"
                        ? "name"
                        : name === "email"
                          ? "email"
                          : name === "company"
                            ? "organization"
                            : "tel"
                    }
                  />
                </label>
              ))}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px]"
                aria-hidden="true"
              />
              <div className="mt-2 space-y-4 sm:col-span-2">
                <OrbitButton
                  type="submit"
                  disabled={sending}
                  icon={<Send size={17} />}
                  className="primary-glow h-13 w-full text-sm font-bold sm:text-base"
                >
                  {sending ? "Enviando..." : "Solicitar Diagnóstico Gratuito"}
                </OrbitButton>
                <OrbitButton
                  variant="whatsapp"
                  href={whatsappUrl}
                  external
                  icon={<ArrowUpRight size={16} />}
                  faceClassName="bg-card"
                  className="h-13 w-full text-sm font-medium text-whatsapp"
                >
                  <MessageCircle size={19} /> Falar no WhatsApp Agora
                </OrbitButton>
                {status === "success" && (
                  <p role="status" className="flex items-center gap-2 text-sm text-whatsapp">
                    <Check size={18} /> Solicitação enviada! Entraremos em contato em breve.
                  </p>
                )}
                {status === "error" && (
                  <p role="alert" className="text-sm text-primary">
                    Não foi possível enviar sua solicitação. Tente novamente.
                  </p>
                )}
                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Ao enviar, você concorda com nossa{" "}
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="cursor-pointer text-primary hover:underline"
                  >
                    Política de Privacidade
                  </button>
                  .
                </p>
              </div>
            </form>
          </div>
        </section>
        <div className="section-rule" />

        <section id="faq" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <SectionHeading
            eyebrow="Dúvidas Frequentes"
            subtitle="Respostas diretas para as dúvidas mais comuns antes de começar."
          >
            Perguntas <span className="text-primary">Frequentes</span>
          </SectionHeading>
          <AccordionPrimitive.Root
            type="single"
            collapsible
            className="mx-auto flex max-w-3xl flex-col gap-3"
          >
            {faq.map((item, i) => (
              <AccordionPrimitive.Item
                key={item.pergunta}
                value={`faq-${i}`}
                className="feature-card faq-item overflow-hidden"
              >
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-foreground sm:px-6">
                    <span>{item.pergunta}</span>
                    <Plus size={20} className="faq-icon shrink-0 text-primary" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="faq-content overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6">
                    {item.resposta}
                  </p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-14 text-center sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Logo footer />
          <nav
            aria-label="Links do rodapé"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm text-muted-foreground"
          >
            {navigation.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-primary">
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="cursor-pointer hover:text-primary"
            >
              Privacidade
            </button>
          </nav>
          <div className="mt-8 flex justify-center">
            <OrbitButton
              variant="secondary"
              href={INSTAGRAM_URL}
              external
              aria-label="Abrir o Instagram da Code Flow"
              icon={<Instagram size={18} />}
              iconPosition="start"
              className="px-6 py-3 text-sm font-semibold text-silver"
            >
              Siga a Code Flow no Instagram
            </OrbitButton>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            © 2026 Code Flow. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <OrbitButton
        variant="whatsapp"
        round
        href={whatsappUrl}
        external
        aria-label="Falar pelo WhatsApp"
        title="Falar pelo WhatsApp"
        className="fixed bottom-5 right-5 z-40 h-14 w-14 shadow-lg sm:bottom-7 sm:right-7"
      >
        <MessageCircle size={27} strokeWidth={2.2} />
      </OrbitButton>
      {privacyOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPrivacyOpen(false);
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 px-5 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            className="feature-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-7 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="privacy-title" className="text-2xl font-bold">
                Política de Privacidade
              </h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar política"
                onClick={() => setPrivacyOpen(false)}
              >
                <X />
              </Button>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Os dados informados no formulário — nome, WhatsApp, e-mail e empresa — são utilizados
              para responder à sua solicitação de diagnóstico e entrar em contato sobre os serviços
              da Code Flow. Não exibimos esses dados publicamente. Você pode solicitar informações,
              correção ou exclusão dos seus dados pelo canal de contato da agência.
            </p>
            <Button onClick={() => setPrivacyOpen(false)} className="mt-7">
              Entendi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
