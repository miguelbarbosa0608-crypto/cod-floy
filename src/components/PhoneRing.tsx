// Anel 3D de celulares com exemplos de layout (seção "Site Personalizado"),
// inspirado no "Round Carousel": cada celular fica em rotateY(i * ângulo) translateZ(raio)
// e o anel gira sozinho. Arraste para girar (com inércia); passar o mouse pausa.
// Com "reduzir movimento", o anel fica parado com o primeiro celular de frente e
// aparecem botões ‹ › para trocar. Dados dos celulares em src/data/exemplosSites.ts;
// estilos no bloco "Anel de celulares" de src/styles.css.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { ETIQUETA_EXEMPLO, exemplosSites, type ExemploSite } from "@/data/exemplosSites";

// ===== Parâmetros (ajuste aqui) =====
const VELOCIDADE = 6; // graus por segundo do giro automático
const RAIO = 230; // distância (px) de cada celular até o centro do anel
const INCLINACAO = -7; // inclinação do anel em graus (negativo = vê o anel um pouco de cima)
const SENSIBILIDADE = 0.3; // graus girados por px arrastado
const ATRITO = 0.94; // quanto da inércia sobra a cada quadro depois de soltar (0 a 1)
const BRILHO_MINIMO = 0.45; // brilho dos celulares mais ao fundo (1 = sem escurecer)

const PASSO = 360 / exemplosSites.length;

function MiniSite({ site }: { site: ExemploSite }) {
  const t = site.tema;
  return (
    <div className="phone-frame phone-ring-frame">
      <div className="phone-ring-screen" style={{ background: t.fundo, color: t.texto }}>
        <div
          className="flex items-center justify-between rounded-lg px-2 py-1.5"
          style={{ background: t.superficie }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-3.5 w-3.5 shrink-0 rounded" style={{ background: t.destaque }} />
            <span className="truncate text-[9px] font-bold">{site.marca}</span>
          </div>
          <Menu size={12} style={{ color: t.textoSuave }} />
        </div>
        <span
          className="mt-4 self-start rounded-full border px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider"
          style={{ borderColor: t.destaque, color: t.destaque }}
        >
          {site.selo}
        </span>
        <p className="mt-2.5 text-[17px] font-bold leading-tight">{site.titulo}</p>
        <div className="mt-2.5 space-y-1.5">
          <div
            className="h-1.5 w-full rounded"
            style={{ background: t.textoSuave, opacity: 0.45 }}
          />
          <div
            className="h-1.5 w-3/4 rounded"
            style={{ background: t.textoSuave, opacity: 0.45 }}
          />
        </div>
        <span
          className="mt-3.5 self-start rounded-md px-3 py-1.5 text-[9px] font-bold"
          style={{ background: t.destaque, color: t.textoBotao }}
        >
          {site.botao}
        </span>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {site.cards.map((c) => (
            <div
              key={c}
              className="grid h-14 place-items-center rounded-lg px-1 text-center"
              style={{ background: t.superficie, boxShadow: `inset 0 0 0 1px ${t.textoSuave}33` }}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: t.destaque, opacity: 0.85 }}
              />
              <span className="text-[7px] font-semibold leading-tight">{c}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex justify-center gap-1.5 pt-4">
          {t.paleta.map((cor, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full"
              style={{ background: cor, boxShadow: `0 0 0 1px ${t.textoSuave}55` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PhoneRing() {
  const caixaRef = useRef<HTMLDivElement>(null);
  const anelRef = useRef<HTMLDivElement>(null);
  const itensRef = useRef<(HTMLDivElement | null)[]>([]);
  const anguloRef = useRef(0);
  const desenharRef = useRef<() => void>(() => {});
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    const caixa = caixaRef.current;
    const anel = anelRef.current;
    if (!caixa || !anel) return;

    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let movimentoReduzido = mq.matches;
    setReduzido(movimentoReduzido);

    let raf = 0;
    let ultimo = 0;
    let inercia = 0; // graus por segundo vindos do arraste
    let mouseEmCima = false;
    let visivel = true;
    const arraste = { ativo: false, id: -1, x: 0, t: 0 };

    // Aplica o giro no anel e escurece os celulares conforme a profundidade.
    const desenhar = () => {
      const a = anguloRef.current;
      anel.style.transform = `rotateX(${INCLINACAO}deg) rotateY(${-a}deg)`;
      itensRef.current.forEach((el, i) => {
        if (!el) return;
        const rel = ((i * PASSO - a) * Math.PI) / 180;
        const frente = Math.max(0, Math.cos(rel));
        el.style.filter = `brightness(${BRILHO_MINIMO + (1 - BRILHO_MINIMO) * frente})`;
      });
    };
    desenharRef.current = desenhar;

    const quadro = (agora: number) => {
      const dt = Math.min((agora - (ultimo || agora)) / 1000, 0.05);
      ultimo = agora;
      const automatico = movimentoReduzido || mouseEmCima || arraste.ativo ? 0 : VELOCIDADE;
      if (!arraste.ativo) {
        anguloRef.current += (automatico + inercia) * dt;
        inercia *= Math.pow(ATRITO, dt * 60);
        if (Math.abs(inercia) < 0.5) inercia = 0;
      }
      desenhar();
      raf = requestAnimationFrame(quadro);
    };
    const iniciar = () => {
      if (!raf && visivel && !document.hidden) {
        ultimo = 0;
        raf = requestAnimationFrame(quadro);
      }
    };
    const parar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const aoPressionar = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0) return;
      arraste.ativo = true;
      arraste.id = e.pointerId;
      arraste.x = e.clientX;
      arraste.t = performance.now();
      inercia = 0;
      caixa.setPointerCapture(e.pointerId);
      caixa.classList.add("is-dragging");
      iniciar();
    };
    const aoMover = (e: PointerEvent) => {
      if (!arraste.ativo || e.pointerId !== arraste.id) return;
      const agora = performance.now();
      const dx = e.clientX - arraste.x;
      const dt = Math.max((agora - arraste.t) / 1000, 0.001);
      anguloRef.current -= dx * SENSIBILIDADE;
      inercia = movimentoReduzido ? 0 : (-dx * SENSIBILIDADE) / dt;
      arraste.x = e.clientX;
      arraste.t = agora;
      if (!raf) desenhar();
    };
    const aoSoltar = (e: PointerEvent) => {
      if (e.pointerId !== arraste.id) return;
      arraste.ativo = false;
      if (performance.now() - arraste.t > 80) inercia = 0; // parou antes de soltar
      caixa.classList.remove("is-dragging");
      if (caixa.hasPointerCapture(e.pointerId)) caixa.releasePointerCapture(e.pointerId);
    };
    const aoEntrar = (e: PointerEvent) => {
      if (e.pointerType === "mouse") mouseEmCima = true;
    };
    const aoSair = (e: PointerEvent) => {
      if (e.pointerType === "mouse") mouseEmCima = false;
    };
    const aoMudarPreferencia = () => {
      movimentoReduzido = mq.matches;
      setReduzido(movimentoReduzido);
      if (movimentoReduzido) {
        inercia = 0;
        anguloRef.current = Math.round(anguloRef.current / PASSO) * PASSO;
        desenhar();
      }
    };
    const aoMudarAba = () => (document.hidden ? parar() : iniciar());

    // Só anima quando o anel está na tela
    const io = new IntersectionObserver(([entrada]) => {
      visivel = !!entrada?.isIntersecting;
      if (visivel) iniciar();
      else parar();
    });
    io.observe(caixa);

    caixa.addEventListener("pointerdown", aoPressionar);
    caixa.addEventListener("pointermove", aoMover);
    caixa.addEventListener("pointerup", aoSoltar);
    caixa.addEventListener("pointercancel", aoSoltar);
    caixa.addEventListener("pointerenter", aoEntrar);
    caixa.addEventListener("pointerleave", aoSair);
    mq.addEventListener("change", aoMudarPreferencia);
    document.addEventListener("visibilitychange", aoMudarAba);
    desenhar();
    iniciar();

    return () => {
      parar();
      io.disconnect();
      caixa.removeEventListener("pointerdown", aoPressionar);
      caixa.removeEventListener("pointermove", aoMover);
      caixa.removeEventListener("pointerup", aoSoltar);
      caixa.removeEventListener("pointercancel", aoSoltar);
      caixa.removeEventListener("pointerenter", aoEntrar);
      caixa.removeEventListener("pointerleave", aoSair);
      mq.removeEventListener("change", aoMudarPreferencia);
      document.removeEventListener("visibilitychange", aoMudarAba);
    };
  }, []);

  // Botões ‹ › (aparecem só com "reduzir movimento"): troca o celular da frente.
  const trocar = (dir: 1 | -1) => {
    anguloRef.current = Math.round(anguloRef.current / PASSO) * PASSO + dir * PASSO;
    desenharRef.current();
  };

  return (
    <div className="relative">
      <div
        ref={caixaRef}
        className="phone-ring"
        role="group"
        aria-roledescription="carrossel"
        aria-label="Exemplos de layout de sites em celulares"
      >
        <div className="phone-ring-scale">
          <div ref={anelRef} className="phone-ring-stage">
            {exemplosSites.map((site, i) => (
              <div
                key={site.marca}
                ref={(el) => {
                  itensRef.current[i] = el;
                }}
                className="phone-ring-item"
                style={
                  { "--i": i, "--passo": `${PASSO}deg`, "--raio": `${RAIO}px` } as CSSProperties
                }
                role="img"
                aria-label={`${ETIQUETA_EXEMPLO}: site fictício para ${site.nicho}, "${site.marca}"`}
              >
                <div aria-hidden="true">
                  <MiniSite site={site} />
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    {ETIQUETA_EXEMPLO}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {reduzido && (
        <div className="mt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => trocar(-1)}
            aria-label="Exemplo anterior"
            className="phone-ring-btn"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => trocar(1)}
            aria-label="Próximo exemplo"
            className="phone-ring-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
