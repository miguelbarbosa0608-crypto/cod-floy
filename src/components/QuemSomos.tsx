// Seção "Quem Somos". Textos e cards: src/data/sobre.ts.
// Para trocar a logo, substitua o arquivo src/assets/logo.png (mesmo nome).
import { ListChecks, Layers, MapPin } from "lucide-react";
import logoUrl from "@/assets/logo.png";
import { quemSomos as d } from "@/data/sobre";
import Reveal from "@/components/Reveal";

const icones = { etapas: ListChecks, integradas: Layers, local: MapPin };

// Converte **texto** em negrito branco.
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function QuemSomos() {
  return (
    <section
      id="quem-somos"
      className="anchor-section mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="logo-card grid aspect-[16/10] place-items-center p-6 sm:p-10">
            <img
              src={logoUrl}
              alt="Logo Code Flow"
              width={1240}
              height={694}
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
              {d.rotulo}
            </p>
            <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {d.tituloInicio} <span className="text-primary">{d.tituloDestaque}</span>
            </h2>
            {d.paragrafos.map((p) => (
              <p key={p} className="mt-5 text-base leading-7 text-silver">
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {d.cards.map(({ icone, titulo, legenda }) => {
            const I = icones[icone];
            return (
              <article key={titulo} className="feature-card flex items-center gap-4 p-6">
                <div className="icon-tile grid h-12 w-12 shrink-0 place-items-center">
                  <I size={23} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{legenda}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
