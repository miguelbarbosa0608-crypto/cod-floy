// Seção "Por que escolher a Code Flow" (layout de duas colunas): no computador, o título da
// esquerda fica fixo (sticky) enquanto os blocos da direita rolam. No celular vira uma coluna.
// Textos em src/data/porQue.ts; estilos no bloco "Por que a Code Flow" de src/styles.css.
import type { ComponentType } from "react";
import {
  ArrowRight,
  LayoutTemplate,
  ListChecks,
  MessagesSquare,
  Puzzle,
  Target,
  Workflow,
} from "lucide-react";
import OrbitButton from "@/components/OrbitButton";
import Reveal from "@/components/Reveal";
import { motivos, porQueCabecalho as c, type IconePorQue } from "@/data/porQue";

const icones: Record<IconePorQue, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Puzzle,
  Target,
  LayoutTemplate,
  Workflow,
  ListChecks,
  MessagesSquare,
};

export default function PorQue() {
  return (
    <section id="por-que" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="porque-titulo">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            {c.rotulo}
          </p>
          <h2 className="text-4xl font-semibold leading-[1.1] text-[#F7F9FC] sm:text-5xl lg:text-[3.5rem]">
            {c.titulo} <span className="text-primary">{c.tituloDestaque}</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#C9D0DA] sm:text-lg">{c.frase}</p>
          <OrbitButton
            href="#contato"
            icon={<ArrowRight size={16} />}
            className="primary-glow mt-8 h-13 px-7 text-sm font-bold sm:text-base"
          >
            {c.botao}
          </OrbitButton>
        </div>
        <div>
          {motivos.map(({ icone, titulo, texto }) => {
            const Icone = icones[icone];
            return (
              <Reveal key={titulo} className="porque-bloco">
                <article>
                  <div className="porque-icone">
                    <Icone size={24} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-5 text-[1.375rem] font-semibold leading-snug text-[#F7F9FC] sm:text-[1.75rem]">
                    {titulo}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[#C9D0DA]">{texto}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
