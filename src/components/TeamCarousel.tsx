// Carrossel da equipe. Dados em src/data/equipe.ts; estilos no bloco "Equipe" de src/styles.css.
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { equipe, iniciais } from "@/data/equipe";

export default function TeamCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const [prog, setProg] = useState(0);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(true);
  const drag = useRef({ ativo: false, x: 0, scroll: 0, moveu: false });

  const atualizar = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProg(max > 0 ? el.scrollLeft / max : 1);
    setPodeVoltar(el.scrollLeft > 4);
    setPodeAvancar(el.scrollLeft < max - 4);
  };
  useEffect(() => {
    atualizar();
    window.addEventListener("resize", atualizar);
    return () => window.removeEventListener("resize", atualizar);
  }, []);

  const mover = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 380), behavior: "smooth" });
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    drag.current = { ativo: true, x: e.clientX, scroll: ref.current.scrollLeft, moveu: false };
    ref.current.classList.add("is-dragging");
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.ativo || !ref.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moveu = true;
    ref.current.scrollLeft = d.scroll - dx;
  };
  const up = () => {
    drag.current.ativo = false;
    ref.current?.classList.remove("is-dragging");
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={atualizar}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="team-track"
      >
        {equipe.map((m, i) => {
          const on = aberto === i;
          return (
            <button
              key={m.nome}
              type="button"
              aria-pressed={on}
              aria-label={`${m.nome}, ${m.funcaoCompleta}. Ver responsabilidades`}
              onClick={() => {
                if (drag.current.moveu) {
                  drag.current.moveu = false;
                  return;
                }
                setAberto(on ? null : i);
              }}
              onMouseLeave={() => on && setAberto(null)}
              className="team-card"
            >
              <div className="team-front">
                {m.foto ? (
                  <img
                    src={m.foto}
                    alt={`Foto de ${m.nome}, ${m.funcaoCompleta}`}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: m.objectPosition }}
                  />
                ) : (
                  <div className="team-placeholder">
                    <span className="team-placeholder-cf" aria-hidden="true">
                      CF
                    </span>
                    <span className="team-initials">{iniciais(m.nome)}</span>
                  </div>
                )}
                <div className="team-shade" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  <p className="text-2xl font-semibold text-foreground">{m.nome}</p>
                  <p className="mt-1 text-sm text-silver">Code Flow · {m.funcaoCurta}</p>
                </div>
                <span className="cf-mark absolute bottom-6 right-6 opacity-30">CF</span>
              </div>
              <div className="team-back blue-grid text-left">
                <p className="text-2xl font-semibold">{m.nome}</p>
                <p className="mt-1 text-sm font-semibold opacity-90">{m.funcaoCompleta}</p>
                <p className="mt-auto text-base leading-7">{m.descricao}</p>
              </div>
            </button>
          );
        })}
      </div>
      {podeVoltar && (
        <button
          type="button"
          aria-label="Ver membros anteriores"
          onClick={() => mover(-1)}
          className="team-arrow left-2"
        >
          <ChevronLeft />
        </button>
      )}
      {podeAvancar && (
        <button
          type="button"
          aria-label="Ver próximos membros"
          onClick={() => mover(1)}
          className="team-arrow right-2"
        >
          <ChevronRight />
        </button>
      )}
      <div
        className="mx-auto mt-6 h-1 max-w-md overflow-hidden rounded-full bg-[var(--track)]"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${Math.max(12, prog * 100)}%` }}
        />
      </div>
    </div>
  );
}
