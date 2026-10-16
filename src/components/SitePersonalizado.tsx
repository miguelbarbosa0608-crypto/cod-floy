// Seção "Site Personalizado". Textos: src/data/sobre.ts. Celulares de exemplo: src/data/exemplosSites.ts (PhoneRing).
import { ArrowRight, Check } from "lucide-react";
import OrbitButton from "@/components/OrbitButton";
import { sitePersonalizado as d } from "@/data/sobre";
import { WHATSAPP_NUMERO } from "@/data/config";
import Reveal from "@/components/Reveal";
import PhoneRing from "@/components/PhoneRing";

const waLink = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(d.mensagemWhatsapp)}`;

export default function SitePersonalizado() {
  return (
    <section
      id="site-personalizado"
      className="anchor-section mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <Reveal>
        <div className="mx-auto mb-11 max-w-2xl text-center sm:mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            {d.rotulo}
          </p>
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {d.tituloInicio} <span className="text-primary">{d.tituloDestaque}</span>.
          </h2>
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhoneRing />
          <div className="min-w-0">
            <p className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
              {d.subtitulo}
            </p>
            {d.paragrafos.map((p) => (
              <p key={p} className="mt-4 text-base leading-7 text-silver">
                {p}
              </p>
            ))}
            <ul className="mt-6 space-y-3">
              {d.lista.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-silver sm:text-base">
                  <Check size={20} className="mt-0.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <OrbitButton
              href={waLink}
              external
              icon={<ArrowRight size={16} />}
              className="primary-glow mt-8 h-14 w-full px-7 text-sm font-bold sm:w-auto sm:text-base"
            >
              {d.botao}
            </OrbitButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
