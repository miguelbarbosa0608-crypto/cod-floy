import { createFileRoute } from '@tanstack/react-router';
import { useState, type FormEvent, type ComponentType } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, ArrowUpRight, Check, CheckCheck, ChevronRight, FileText, Globe2, Instagram, LayoutTemplate, Map, Menu, MessageCircle, MousePointer2, Quote, Rocket, Search, Send, Settings2, ShieldCheck, Target, TrendingUp, X, Zap, Megaphone, Puzzle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitContact } from '@/lib/contact.functions';
import { Smile, Sparkles, Scale, Store, Briefcase, Plus } from 'lucide-react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import logoUrl from '@/assets/logo.png';
import HeroWaves from '@/components/HeroWaves';
import { depoimentos, MOSTRAR_NOTA_ILUSTRATIVA, NOTA_ILUSTRATIVA, FRASE_CREDIBILIDADE, VELOCIDADE_CARROSSEL_SEGUNDOS, type IconeSegmento } from '@/data/depoimentos';
import { faq } from '@/data/faq';
import { INSTAGRAM_URL } from '@/data/config';

// WhatsApp contact link provided by the agency.
const whatsappUrl = 'https://www.contate.me/556292543903';

type Icon = ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
const navigation = [
  ['Serviços', '#servicos'], ['Metodologia', '#metodologia'], ['Resultados', '#resultados'],
  ['Diferenciais', '#diferenciais'], ['Contato', '#contato'], ['FAQ', '#faq'],
];
const services: { icon: Icon; title: string; description: string }[] = [
  { icon: Target, title: 'Tráfego Pago', description: 'Gestão de campanhas e anúncios para atrair clientes qualificados e gerar oportunidades com previsibilidade.' },
  { icon: Megaphone, title: 'Social Media', description: 'Estratégia, conteúdo e presença digital para fortalecer a sua marca e conectar com o público certo.' },
  { icon: LayoutTemplate, title: 'Landing Pages', description: 'Páginas estratégicas, rápidas e persuasivas para captação, apresentação e conversão.' },
  { icon: Globe2, title: 'Sites Institucionais', description: 'Sites modernos, rápidos e alinhados ao posicionamento da sua empresa.' },
  { icon: Settings2, title: 'Automação de CRM', description: 'Automatização de relacionamento, acompanhamento e organização comercial para nutrir leads e escalar sem aumentar a equipe.' },
  { icon: TrendingUp, title: 'Mentoria Empresarial', description: 'Orientação prática para organizar, estruturar e desenvolver a estratégia comercial do seu negócio.' },
];
const steps: { icon: Icon; title: string; description: string }[] = [
  { icon: Search, title: 'Diagnóstico', description: 'Entendemos a fundo a necessidade, o mercado e as oportunidades do seu negócio.' },
  { icon: Map, title: 'Planejamento', description: 'Definimos escopo, tarefas, responsáveis e prazos com metas claras.' },
  { icon: Zap, title: 'Execução', description: 'Desenvolvemos a solução contratada com precisão e foco em resultado.' },
  { icon: ShieldCheck, title: 'Teste + QA', description: 'Revisamos funcionamento, qualidade e requisitos antes de qualquer entrega.' },
  { icon: FileText, title: 'Documentação', description: 'Registramos a solução e orientamos você sobre como utilizá-la.' },
  { icon: Rocket, title: 'Entrega', description: 'Apresentamos a solução, coletamos feedback e seguimos como parceiros.' },
];
// Depoimentos ficam em src/data/depoimentos.ts.
const segmentIcons: Record<IconeSegmento, Icon> = { Smile, Sparkles, Scale, Store, Briefcase };
const differences: { icon: Icon; title: string; description: string }[] = [
  { icon: Puzzle, title: 'Solução Integrada', description: 'Marketing, tecnologia e automação trabalhando juntos.' },
  { icon: MousePointer2, title: 'Personalização Real', description: 'Cada solução parte da necessidade real do seu negócio.' },
  { icon: CheckCheck, title: 'Processo Organizado', description: 'Diagnóstico, planejamento, execução, teste, documentação e entrega.' },
  { icon: MessageCircle, title: 'Comunicação Clara', description: 'Linguagem didática, objetiva e acompanhamento de todas as etapas.' },
  { icon: TrendingUp, title: 'Foco em Processo', description: 'Não entregamos apenas uma peça: estruturamos uma solução funcional.' },
  { icon: Users, title: 'Parceria Contínua', description: 'Tratamos a relação com o cliente como uma construção de longo prazo.' },
];

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'CodeFlow | Tecnologia, Marketing e Automação' },
    { name: 'description', content: 'Soluções digitais integradas em tecnologia, marketing e automação para fortalecer a presença digital e as vendas do seu negócio.' },
    { property: 'og:title', content: 'CodeFlow | Tecnologia, Marketing e Automação' },
    { property: 'og:description', content: 'Soluções digitais integradas para transformar estratégia em resultados reais.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Home,
});

function Logo({ footer = false }: { footer?: boolean }) {
  return <a href="#inicio" aria-label="Cod Floy, voltar ao início" className="inline-flex shrink-0 items-center">
    <img src={logoUrl} alt="Cod Floy — Soluções digitais que geram resultados" width={1240} height={694} className={`h-10 w-auto sm:h-11 ${footer ? 'sm:h-14' : ''}`} />
  </a>;
}
function SectionHeading({ eyebrow, children, subtitle }: { eyebrow: string; children: React.ReactNode; subtitle?: string }) {
  return <div className="mx-auto mb-11 max-w-2xl text-center sm:mb-16">
    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
    <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">{children}</h2>
    {subtitle && <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>}
  </div>;
}
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const submit = useServerFn(submitContact);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    setSending(true); setStatus('idle');
    try {
      await submit({ data: {
        name: String(values.get('name') ?? ''), whatsapp: String(values.get('whatsapp') ?? ''),
        email: String(values.get('email') ?? ''), company: String(values.get('company') ?? ''),
        website: String(values.get('website') ?? ''),
      } });
      form.reset(); setStatus('success');
    } catch { setStatus('error'); }
    finally { setSending(false); }
  };
  return <div className="site-shell min-h-screen">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[76px] lg:px-10">
        <Logo />
        <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navigation.map(([label, href]) => <a key={href} href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}
          <Button asChild className="btn-primary primary-glow ml-1 h-10 rounded-lg px-5 font-bold"><a href="#contato">Falar com Especialista</a></Button>
        </nav>
        <Button variant="ghost" size="icon" className="btn-secondary lg:hidden" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</Button>
      </div>
      {menuOpen && <nav aria-label="Menu móvel" className="flex max-h-[calc(100dvh-64px)] flex-col gap-1 overflow-y-auto border-t border-border bg-background px-5 py-5 lg:hidden">
        {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border/60 py-4 text-lg font-semibold text-foreground">{label}<ChevronRight size={18} className="text-primary" /></a>)}
        <Button asChild className="btn-primary primary-glow mt-5 h-12 rounded-lg font-bold"><a href="#contato" onClick={() => setMenuOpen(false)}>Falar com Especialista <ArrowRight /></a></Button>
      </nav>}
    </header>

    <main>
      <section id="inicio" className="hero-scene relative flex min-h-[730px] flex-col justify-center overflow-hidden pt-28 sm:min-h-[760px] lg:min-h-[770px] lg:pt-24">
        <HeroWaves />
        <div className="hero-readability pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-14 text-center sm:px-8 lg:pb-20">
          <div className="flow-in mb-7 inline-flex max-w-full items-center rounded-full border border-primary/35 bg-primary/5 px-4 py-2 text-center text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">Tecnologia, Marketing e Automação</div>
          <h1 className="flow-in flow-delay mx-auto max-w-4xl text-[clamp(2.15rem,4.7vw,4.9rem)] font-bold leading-[1.13] text-foreground">Soluções Digitais que Geram<br className="hidden sm:block" /> <span className="text-primary">Resultados Reais.</span></h1>
          <p className="flow-in flow-delay-more mx-auto mt-7 max-w-2xl text-base leading-[1.8] text-muted-foreground sm:text-lg">Somos uma empresa de tecnologia, marketing e automação que une desenvolvimento, estratégia e processos inteligentes para fortalecer a presença digital e as vendas do seu negócio.</p>
          <div className="flow-in flow-delay-more mx-auto mt-10 flex max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
            <Button asChild size="lg" className="btn-primary primary-glow h-14 rounded-xl px-7 text-sm font-bold sm:text-base"><a href="#contato">Quero Transformar Meu Negócio <ArrowRight /></a></Button>
            <Button asChild variant="outline" size="lg" className="btn-secondary h-14 rounded-xl border-border bg-transparent px-8 text-sm font-semibold text-muted-foreground hover:bg-card hover:text-foreground sm:text-base"><a href="#servicos">Conheça Nossos Serviços</a></Button>
          </div>
        </div>
      </section>
      <div className="section-rule" />
      <section aria-label="Nossa atuação" className="mx-auto grid max-w-5xl grid-cols-3 gap-2 px-4 py-10 text-center sm:gap-10 sm:py-14">
        {[['6', 'Serviços integrados'], ['6', 'Etapas de processo'], ['100%', 'Soluções personalizadas']].map(([number, label]) => <div key={label}><div className="text-2xl font-bold text-primary sm:text-4xl">{number}</div><p className="mx-auto mt-2 max-w-36 text-[11px] leading-snug text-muted-foreground sm:text-sm">{label}</p></div>)}
      </section>
      <div className="section-rule" />

      <section id="servicos" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Nossos Serviços" subtitle="Cada serviço é pensado para unir tecnologia, estratégia e performance no seu negócio.">Soluções que Geram <span className="text-primary">Resultados</span></SectionHeading>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map(({ icon: IconComponent, title, description }, i) => <article key={title} className={`feature-card p-7 sm:p-8`}><div className="icon-tile mb-7 grid h-13 w-13 place-items-center"><IconComponent size={25} strokeWidth={1.8} /></div><h3 className="mb-3 text-xl font-bold">{title}</h3><p className="text-sm leading-7 text-muted-foreground">{description}</p></article>)}
        </div>
      </section>
      <div className="section-rule" />

      <section id="metodologia" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Nossa Metodologia" subtitle="Um processo estruturado em 6 etapas, da necessidade do cliente até a entrega da solução.">Metodologia <span className="text-primary">CodeFlow</span></SectionHeading>
        <div className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-9 lg:gap-y-14">
          {steps.map(({ icon: IconComponent, title, description }, i) => <article key={title} className="relative flex flex-col items-center text-center"><div className="icon-tile relative mb-6 grid h-19 w-19 place-items-center border border-border"><IconComponent size={31} strokeWidth={1.7} /><span className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{String(i + 1).padStart(2, '0')}</span></div><h3 className="mb-2 text-lg font-bold">{title}</h3><p className="max-w-xs text-sm leading-7 text-muted-foreground">{description}</p></article>)}
        </div>
      </section>
      <div className="section-rule" />

      <section id="resultados" className="overflow-hidden mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Resultados">O Que Nossos Clientes <span className="text-primary">Dizem</span></SectionHeading>
        {/* Carrossel automático: a lista é duplicada para o loop não ter emenda. */}
        <div className="testimonial-marquee" style={{ ['--marquee-duration' as string]: `${VELOCIDADE_CARROSSEL_SEGUNDOS}s` }}>
          <div className="testimonial-track">
            {[...depoimentos, ...depoimentos].map((item, i) => { const SegIcon = segmentIcons[item.icone]; const initials = item.nome.replace(/^Dra?\.?\s+/, '').split(' ').map((p) => p[0]).slice(0, 2).join(''); return <article key={i} aria-hidden={i >= depoimentos.length} className="feature-card flex w-[300px] shrink-0 flex-col p-6 sm:w-[320px]"><div className="text-xs tracking-widest text-primary" aria-label="Cinco estrelas">★★★★★</div><p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-muted-foreground">“{item.texto}”</p><div className="mt-4 flex items-center gap-3 border-t border-border pt-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{initials}</div><div className="min-w-0"><p className="text-sm font-semibold text-foreground">{item.nome}</p><p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"><SegIcon size={12} className="shrink-0 text-primary" />{item.segmento} · {item.cidade}</p></div></div></article>; })}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-silver sm:text-lg">{FRASE_CREDIBILIDADE.split('Code Flow').map((part, i, arr) => <span key={i}>{part}{i < arr.length - 1 && <span className="font-semibold text-primary">Code Flow</span>}</span>)}</p>
        {MOSTRAR_NOTA_ILUSTRATIVA && <p className="mt-3 text-center text-xs text-muted-foreground">{NOTA_ILUSTRATIVA}</p>}
      </section>
      <div className="section-rule" />

      <section id="diferenciais" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Por que a CodeFlow?" subtitle="Somos diferentes de agências comuns. Nosso compromisso é estruturar uma solução que funcione para o seu resultado.">Não Entregamos Peças.<br /><span className="text-primary">Entregamos Soluções.</span></SectionHeading>
        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">{differences.map(({ icon: IconComponent, title, description }) => <article key={title} className="feature-card flex items-start gap-5 p-6"><div className="icon-tile grid h-12 w-12 shrink-0 place-items-center"><IconComponent size={23} strokeWidth={1.8} /></div><div className="min-w-0"><h3 className="mb-2 text-base font-bold sm:text-lg">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{description}</p></div></article>)}</div>
      </section>
      <div className="section-rule" />

      <section id="contato" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Vamos Conversar" subtitle="Preencha o formulário e receba um diagnóstico gratuito da sua presença digital.">Pronto para Transformar seu <span className="text-primary">Negócio?</span></SectionHeading>
        <div className="feature-card mx-auto max-w-2xl p-6 sm:p-10">
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
            {[['name', 'Nome', 'Seu nome completo', 'text'], ['whatsapp', 'WhatsApp', '(00) 00000-0000', 'tel'], ['email', 'E-mail', 'seu@email.com', 'email'], ['company', 'Empresa', 'Nome da sua empresa', 'text']].map(([name, label, placeholder, type]) => <label key={name} className="block text-sm font-semibold text-foreground">{label}<input className="form-field mt-2 block h-12 w-full px-4 text-sm font-normal placeholder:text-muted-foreground/55" name={name} type={type} placeholder={placeholder} required minLength={name === 'whatsapp' ? 10 : 2} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'company' ? 'organization' : 'tel'} /></label>)}
            <input name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px]" aria-hidden="true" />
            <div className="mt-2 space-y-4 sm:col-span-2">
              <Button type="submit" disabled={sending} className="btn-primary primary-glow h-13 w-full rounded-xl text-sm font-bold sm:text-base">{sending ? 'Enviando...' : 'Solicitar Diagnóstico Gratuito'} <Send size={17} /></Button>
              <Button asChild variant="outline" className="btn-whatsapp h-13 w-full rounded-xl border-whatsapp bg-transparent text-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> Falar no WhatsApp Agora <ArrowUpRight size={16} /></a></Button>
              {status === 'success' && <p role="status" className="flex items-center gap-2 text-sm text-whatsapp"><Check size={18} /> Solicitação enviada! Entraremos em contato em breve.</p>}
              {status === 'error' && <p role="alert" className="text-sm text-primary">Não foi possível enviar sua solicitação. Tente novamente.</p>}
              <p className="text-center text-xs leading-5 text-muted-foreground">Ao enviar, você concorda com nossa <button type="button" onClick={() => setPrivacyOpen(true)} className="cursor-pointer text-primary hover:underline">Política de Privacidade</button>.</p>
            </div>
          </form>
        </div>
      </section>
      <div className="section-rule" />

      <section id="faq" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <SectionHeading eyebrow="Dúvidas Frequentes" subtitle="Respostas diretas para as dúvidas mais comuns antes de começar.">Perguntas <span className="text-primary">Frequentes</span></SectionHeading>
        <AccordionPrimitive.Root type="single" collapsible className="mx-auto flex max-w-3xl flex-col gap-3">
          {faq.map((item, i) => <AccordionPrimitive.Item key={item.pergunta} value={`faq-${i}`} className="feature-card faq-item overflow-hidden">
            <AccordionPrimitive.Header><AccordionPrimitive.Trigger className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-foreground sm:px-6"><span>{item.pergunta}</span><Plus size={20} className="faq-icon shrink-0 text-primary" /></AccordionPrimitive.Trigger></AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="faq-content overflow-hidden"><p className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6">{item.resposta}</p></AccordionPrimitive.Content>
          </AccordionPrimitive.Item>)}
        </AccordionPrimitive.Root>
      </section>
    </main>

    <footer className="border-t border-border px-5 py-14 text-center sm:px-8"><div className="mx-auto max-w-7xl"><Logo footer /><nav aria-label="Links do rodapé" className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm text-muted-foreground">{navigation.filter(([label]) => label !== 'Diferenciais').map(([label, href]) => <a key={href} href={href} className="hover:text-primary">{label}</a>)}<button type="button" onClick={() => setPrivacyOpen(true)} className="cursor-pointer hover:text-primary">Privacidade</button></nav><div className="mt-8 flex justify-center"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Abrir o Instagram da Code Flow" className="btn-secondary btn-instagram inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-silver"><Instagram size={18} /> Siga a Code Flow no Instagram</a></div><p className="mt-8 text-xs text-muted-foreground">© 2026 CodeFlow. Todos os direitos reservados.</p></div></footer>

    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Falar pelo WhatsApp" title="Falar pelo WhatsApp" className="btn-whatsapp-float fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-7 sm:right-7"><MessageCircle size={27} strokeWidth={2.2} /></a>
    {privacyOpen && <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPrivacyOpen(false); }} className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 px-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="privacy-title" className="feature-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-7 shadow-xl"><div className="flex items-start justify-between gap-4"><h2 id="privacy-title" className="text-2xl font-bold">Política de Privacidade</h2><Button variant="ghost" size="icon" aria-label="Fechar política" onClick={() => setPrivacyOpen(false)}><X /></Button></div><p className="mt-5 text-sm leading-7 text-muted-foreground">Os dados informados no formulário — nome, WhatsApp, e-mail e empresa — são utilizados para responder à sua solicitação de diagnóstico e entrar em contato sobre os serviços da CodeFlow. Não exibimos esses dados publicamente. Você pode solicitar informações, correção ou exclusão dos seus dados pelo canal de contato da agência.</p><Button onClick={() => setPrivacyOpen(false)} className="mt-7">Entendi</Button></div></div>}
  </div>;
}
