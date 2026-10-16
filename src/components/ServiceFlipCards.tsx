// Cards de serviços que viram em 3D. Textos em src/data/servicos.ts; estilos no bloco "Flip cards" de src/styles.css.
import { useState, type ComponentType, type KeyboardEvent } from "react";
import {
  Check,
  Globe2,
  LayoutTemplate,
  Megaphone,
  RotateCw,
  Settings2,
  Target,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { servicos, type IconeServico } from "@/data/servicos";
import { WHATSAPP_NUMERO } from "@/data/config";
import OrbitButton from "@/components/OrbitButton";

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;
const icones: Record<IconeServico, Icon> = {
  Target,
  Megaphone,
  LayoutTemplate,
  Globe2,
  Settings2,
  TrendingUp,
};

export default function ServiceFlipCards() {
  const [virado, setVirado] = useState<number | null>(null);
  const toggle = (i: number) => setVirado((v) => (v === i ? null : i));
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {servicos.map((s, i) => {
        const IconC = icones[s.icone];
        const on = virado === i;
        const wa = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Olá! Quero saber mais sobre ${s.titulo}.`)}`;
        const onKey = (e: KeyboardEvent) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(i);
          }
        };
        return (
          <div
            key={s.titulo}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${s.titulo}: virar card`}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) return;
              toggle(i);
            }}
            onKeyDown={onKey}
            onMouseLeave={() => on && setVirado(null)}
            className="flip-card"
          >
            <div className="flip-inner">
              <div className="flip-face flip-front">
                <div className="flex items-start justify-between">
                  <div className="icon-tile grid h-13 w-13 place-items-center">
                    <IconC size={25} strokeWidth={1.8} />
                  </div>
                  <span className="cf-mark">CF</span>
                </div>
                <h3 className="mt-7 text-xl font-bold text-foreground">{s.titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{s.frente}</p>
                <p className="mt-auto flex items-center gap-2 pt-6 text-xs text-muted-foreground">
                  <RotateCw size={14} className="text-primary" />
                  <span className="hint-hover">Passe o mouse</span>
                  <span className="hint-touch">Toque para virar</span>
                </p>
              </div>
              <div className="flip-face flip-back blue-grid">
                <h3 className="text-lg font-bold">{s.titulo}</h3>
                <p className="mt-2 text-sm leading-6 opacity-95">{s.verso}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {s.itens.map((it) => (
                    <li key={it} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <OrbitButton
                    variant="secondary"
                    href={wa}
                    external
                    tabIndex={on ? 0 : -1}
                    className="h-10 text-xs font-bold"
                    faceClassName="px-4"
                    icon={<ArrowUpRight size={14} />}
                  >
                    Falar sobre este serviço
                  </OrbitButton>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
