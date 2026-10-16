// Carrossel da seção "Nossa Equipe". Dados em src/data/equipe.ts; estilos no bloco "Equipe" de src/styles.css.
// Cada card é um <button>: hover (desktop) ou clique/toque/Enter/Espaço mostra o verso com a descrição.
// Navegação: arrastar (dedo ou mouse), setas laterais, setas do teclado e barra de progresso.
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { equipe, iniciais } from "@/data/equipe";

export default function TeamCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [virado, setVirado] = useState<number | null>(null);
  const [barra, setBarra] = useState({ largura: 100, posicao: 0 });
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);
  const drag = useRef({ ativo: false, x: 0, scroll: 0, moveu: false });

  const atualizar = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const largura = (el.clientWidth / el.scrollWidth) * 100;
    setBarra({ largura, posicao: max > 0 ? (el.scrollLeft / max) * (100 - largura) : 0 });
    setPodeVoltar(el.scrollLeft > 4);
    setPodeAvancar(el.scrollLeft < max - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    atualizar();
    const ro = new ResizeObserver(atualizar);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rola um card por vez (largura do card + espaço entre eles).
  const mover = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>(".team-card");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  // Arrastar com o mouse (no toque, a rolagem nativa já cuida disso).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { ativo: true, x: e.clientX, scroll: trackRef.current.scrollLeft, moveu: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.ativo || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moveu && Math.abs(dx) > 5) {
      d.moveu = true;
      el.classList.add("is-dragging");
    }
    if (d.moveu) el.scrollLeft = d.scroll - dx;
  };
  const onPointerUp = () => {
    drag.current.ativo = false;
    trackRef.current?.classList.remove("is-dragging");
  };

  // Setas do teclado: vai para o card anterior/seguinte e o coloca à vista.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const cards = [...(trackRef.current?.querySelectorAll<HTMLElement>(".team-card") ?? [])];
    const atual = cards.indexOf(document.activeElement as HTMLElement);
    if (atual === -1) return;
    e.preventDefault();
    const alvo = cards[atual + (e.key === "ArrowRight" ? 1 : -1)];
    if (alvo) {
      alvo.focus({ preventScroll: true });
      alvo.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  };

  return (
    <div className="relative">
      <div className="team-viewport" data-fade-left={podeVoltar} data-fade-right={podeAvancar}>
        <div
          ref={trackRef}
          className="team-track"
          onScroll={atualizar}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onKeyDown={onKeyDown}
          role="group"
          aria-label="Integrantes da equipe Code Flow"
        >
          {equipe.map((m, i) => {
            const on = virado === i;
            return (
              <button
                key={m.nome}
                type="button"
                className="team-card"
                data-flipped={on}
                aria-pressed={on}
                aria-label={`${m.nome}, ${m.funcaoCompleta}. Ver responsabilidades`}
                onClick={() => {
                  if (drag.current.moveu) {
                    drag.current.moveu = false;
                    return;
                  }
                  setVirado(on ? null : i);
                }}
                onMouseLeave={() => on && setVirado(null)}
              >
                <span className="team-inner">
                  <span className="team-face team-front">
                    {m.foto ? (
                      <img
                        src={m.foto}
                        alt={`Foto de ${m.nome}, ${m.funcaoCompleta}`}
                        loading="lazy"
                        draggable={false}
                        className="team-photo"
                        style={{ objectPosition: m.objectPosition }}
                      />
                    ) : (
                      <span className="team-placeholder">
                        <span className="team-initials">{iniciais(m.nome)}</span>
                        <span className="cf-mark">CF</span>
                      </span>
                    )}
                    <span className="team-shade" />
                    <span className="team-caption">
                      <span className="block text-2xl font-semibold text-[#F7F9FC]">{m.nome}</span>
                      <span className="mt-1 block text-sm text-[#C9D0DA]">
                        Code Flow · {m.funcaoCurta}
                      </span>
                    </span>
                    <span className="cf-mark team-cf" aria-hidden="true">
                      CF
                    </span>
                  </span>
                  <span className="team-face team-back">
                    <span className="block text-2xl font-semibold">{m.nome}</span>
                    <span className="mt-1 block text-sm font-semibold opacity-90">
                      {m.funcaoCompleta}
                    </span>
                    <span className="mt-auto block text-base leading-7">{m.descricao}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {podeVoltar && (
        <button
          type="button"
          aria-label="Ver integrantes anteriores"
          onClick={() => mover(-1)}
          className="team-arrow left-0 sm:-left-2"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {podeAvancar && (
        <button
          type="button"
          aria-label="Ver próximos integrantes"
          onClick={() => mover(1)}
          className="team-arrow right-0 sm:-right-2"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div className="team-progress" aria-hidden="true">
        <span
          style={{
            width: `${barra.largura}%`,
            transform: `translateX(${(barra.posicao / barra.largura) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
}
