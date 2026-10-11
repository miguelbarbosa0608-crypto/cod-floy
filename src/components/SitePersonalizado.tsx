// Seção "Site Personalizado". Textos: src/data/sobre.ts. Cores: tokens em src/styles.css (classes .phone-*).
import { ArrowRight, Check, Menu, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sitePersonalizado as d } from '@/data/sobre';
import { WHATSAPP_NUMERO } from '@/data/config';
import Reveal from '@/components/Reveal';

const waLink = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(d.mensagemWhatsapp)}`;

function PhoneMockup() {
  return (
    <div className="phone-float relative mx-auto w-[260px] max-w-full">
      <div className="phone-glow" aria-hidden="true" />
      <div className="phone-frame relative" role="img" aria-label="Exemplo de site personalizado no celular">
        <div className="phone-screen">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5"><span className="h-4 w-4 rounded-md bg-primary" /><span className="text-[10px] font-bold text-foreground">SuaMarca</span></div>
            <Menu size={14} className="text-silver" />
          </div>
          <span className="mt-5 inline-block rounded-full border border-primary/40 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">Novo site</span>
          <p className="mt-3 text-lg font-bold leading-tight text-foreground">Sua marca.<br /><span className="text-primary">Seu jeito.</span></p>
          <div className="mt-3 space-y-1.5"><div className="h-1.5 w-full rounded bg-muted-foreground/30" /><div className="h-1.5 w-3/4 rounded bg-muted-foreground/30" /></div>
          <div className="mt-4 h-7 w-24 rounded-md bg-primary" />
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[Zap, Rocket, ShieldCheck].map((I, i) => <div key={i} className="grid h-12 place-items-center rounded-lg border border-border bg-card"><I size={14} className="text-primary" /></div>)}
          </div>
          <div className="phone-palette mt-6 flex justify-center gap-2" aria-label="Paleta personalizada">
            {['bg-primary', 'bg-accent', 'bg-foreground', 'bg-silver'].map((c) => <span key={c} className={`h-4 w-4 rounded-full ${c}`} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SitePersonalizado() {
  return (
    <section id="site-personalizado" className="anchor-section mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <Reveal>
        <div className="mx-auto mb-11 max-w-2xl text-center sm:mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">{d.rotulo}</p>
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">{d.tituloInicio} <span className="text-primary">{d.tituloDestaque}</span>.</h2>
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhoneMockup />
          <div className="min-w-0">
            <p className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">{d.subtitulo}</p>
            {d.paragrafos.map((p) => <p key={p} className="mt-4 text-base leading-7 text-silver">{p}</p>)}
            <ul className="mt-6 space-y-3">{d.lista.map((item) => <li key={item} className="flex gap-3 text-sm text-silver sm:text-base"><Check size={20} className="mt-0.5 shrink-0 text-primary" />{item}</li>)}</ul>
            <Button asChild size="lg" className="btn-primary primary-glow mt-8 h-14 w-full rounded-xl px-7 text-sm font-bold sm:w-auto sm:text-base"><a href={waLink} target="_blank" rel="noopener noreferrer">{d.botao} <ArrowRight /></a></Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
