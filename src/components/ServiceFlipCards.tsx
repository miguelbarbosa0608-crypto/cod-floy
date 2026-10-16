// Cards de serviços que viram em 3D. Textos em src/data/servicos.ts; estilos no bloco "Flip cards" de src/styles.css.
// Desktop: passar o mouse vira o card. Toque/teclado: o <button> que cobre o card alterna frente e verso.
import { useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  Check,
  Globe2,
  LayoutTemplate,
  Megaphone,
  RotateCw,
  Settings2,
  Target,
  TrendingUp,
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

function FlipCard({ s }: { s: (typeof servicos)[number] }) {
  const [virado, setVirado] = useState(false);
  const IconC = icones[s.icone];
  const wa = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(`Olá! Quero saber mais sobre ${s.titulo}.`)}`;

  return (
    <div className="flip-card" data-flipped={virado} onMouseLeave={() => setVirado(false)}>
      <div className="flip-inner">
        <div className="flip-face flip-front">
          <div className="flex items-start justify-between">
            <div className="icon-tile grid h-13 w-13 place-items-center">
              <IconC size={25} strokeWidth={1.8} />
            </div>
            <span className="cf-mark" aria-hidden="true">
              CF
            </span>
          </div>
          <h3 className="mt-7 text-xl font-bold text-[#F7F9FC]">{s.titulo}</h3>
          <p className="mt-3 text-sm leading-7 text-[#C9D0DA]">{s.frente}</p>
          <p
            className="mt-auto flex items-center gap-2 pt-6 text-xs text-[#C9D0DA]"
            aria-hidden="true"
          >
            <RotateCw size={14} className="text-[#0A8CFF]" />
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
        </div>
      </div>
      {/* Botão que cobre o card inteiro: vira no toque, no clique e com Enter/Espaço. */}
      <button
        type="button"
        className="flip-hit"
        aria-pressed={virado}
        aria-label={`${s.titulo}: ver detalhes do serviço`}
        onClick={() => setVirado((v) => !v)}
      />
      {/* Fica fora do botão (link não pode ficar dentro de botão) e só aparece com o verso visível. */}
      <span className="flip-cta">
        <OrbitButton
          variant="secondary"
          href={wa}
          external
          icon={<ArrowUpRight size={14} />}
          className="h-9 px-4 text-xs font-bold"
        >
          Falar sobre este serviço
        </OrbitButton>
      </span>
    </div>
  );
}

export default function ServiceFlipCards() {
  return (
    <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {servicos.map((s) => (
        <FlipCard key={s.titulo} s={s} />
      ))}
    </div>
  );
}
