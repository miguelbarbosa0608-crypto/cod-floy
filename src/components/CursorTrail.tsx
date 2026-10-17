// Rastro luminoso "constelação" que segue o mouse (estilo Multi-Effect Cursor).
// Montado uma vez em src/routes/__root.tsx. O cursor normal do sistema continua visível;
// o efeito é desenhado num <canvas> por cima da página, sem bloquear cliques.
// Desligado em telas de toque (pointer: coarse), com "reduzir movimento" ativado e sobre
// elementos com o atributo data-sem-rastro (ex.: o globo de Quem Somos).
import { useEffect, useRef } from "react";

// ===== Parâmetros (ajuste aqui) =====
const COR = "92, 184, 255"; // cor principal das partículas e linhas (#5CB8FF, em RGB)
const COR_BRILHO = "154, 219, 255"; // cor do brilho (#9ADBFF, em RGB)
const TAMANHO = 4; // raio das partículas em px
const INTENSIDADE = 0.55; // opacidade máxima do efeito (0 a 1); moderado ≈ 0.5
const FLUXO = 0.25; // partículas criadas por px de movimento do mouse (mais = rastro mais denso)
const MAX_POR_MOVIMENTO = 5; // limite de partículas criadas por evento de movimento
const DURACAO = 1.2; // tempo de vida de cada partícula, em segundos
const MAX_PARTICULAS = 100; // limite de partículas na tela ao mesmo tempo
const ATRITO = 0.96; // desaceleração por quadro (0.96 = perde 4% da velocidade a cada quadro)
const ESPALHAMENTO = 0.8; // velocidade inicial aleatória das partículas, em px por quadro
const ALCANCE_LINHA = TAMANHO * 5; // distância máxima (px) para ligar duas partículas com uma linha
const OPACIDADE_LINHA = 0.4; // opacidade das linhas em relação à INTENSIDADE
const RAIO_BRILHO = 16; // raio do brilho na posição do cursor, em px
const DPR_MAXIMO = 2; // limite de resolução em telas de alta densidade (economiza processamento)

// Easing cubic-bezier(0.4, 0, 0.2, 1): resolve x(t) por Newton e devolve y(t).
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const coord = (t: number, a: number, b: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  const deriv = (t: number, a: number, b: number) =>
    3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t ** 2;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = deriv(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= (coord(t, x1, x2) - x) / d;
    }
    return coord(Math.min(1, Math.max(0, t)), y1, y2);
  };
}
const ease = cubicBezier(0.4, 0, 0.2, 1);

type Particula = { x: number; y: number; vx: number; vy: number; idade: number };

export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const toque = matchMedia("(pointer: coarse)");
    const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ps: Particula[] = [];
    let raf = 0;
    let ultimo = 0;
    let mx = 0;
    let my = 0;
    let temPosicao = false;
    let sobra = 0;
    let brilho = 0;
    let largura = 0;
    let altura = 0;

    const ativo = () => !toque.matches && !reduzir.matches;

    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(redimensionar);
    ro.observe(canvas);
    redimensionar();

    const parar = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ultimo = 0;
    };

    const quadro = (agora: number) => {
      // delta time em segundos (limitado para não "pular" após travadas)
      const dt = Math.min((agora - (ultimo || agora)) / 1000, 0.05);
      ultimo = agora;
      ctx.clearRect(0, 0, largura, altura);
      const atrito = Math.pow(ATRITO, dt * 60);

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]!;
        p.idade += dt;
        if (p.idade >= DURACAO) {
          ps.splice(i, 1);
          continue;
        }
        p.vx *= atrito;
        p.vy *= atrito;
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
      }

      // Linhas da constelação entre partículas próximas
      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i]!;
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > ALCANCE_LINHA) continue;
          const vida = 1 - ease(Math.max(a.idade, b.idade) / DURACAO);
          const alfa = vida * (1 - d / ALCANCE_LINHA) * INTENSIDADE * OPACIDADE_LINHA;
          ctx.strokeStyle = `rgba(${COR}, ${alfa})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Partículas: diminuem e somem ao longo da vida
      for (const p of ps) {
        const vida = 1 - ease(p.idade / DURACAO);
        const r = TAMANHO * (0.35 + 0.65 * vida);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(${COR_BRILHO}, ${vida * INTENSIDADE})`);
        g.addColorStop(1, `rgba(${COR}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brilho na posição do cursor, que some quando o mouse para
      brilho = Math.max(0, brilho - dt / DURACAO);
      if (brilho > 0) {
        const alfa = ease(brilho) * INTENSIDADE * 0.5;
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, RAIO_BRILHO);
        g.addColorStop(0, `rgba(${COR_BRILHO}, ${alfa})`);
        g.addColorStop(1, `rgba(${COR}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mx, my, RAIO_BRILHO, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pausa o loop quando não há nada para desenhar
      if (ps.length || brilho > 0) raf = requestAnimationFrame(quadro);
      else parar();
    };

    const iniciar = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(quadro);
    };

    const aoMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !ativo()) return;
      // Sem rastro sobre elementos marcados com data-sem-rastro (ex.: o globo de Quem Somos)
      if (e.target instanceof Element && e.target.closest("[data-sem-rastro]")) {
        temPosicao = false; // ao sair, o rastro recomeça do ponto atual (sem linha cruzando)
        brilho = 0;
        return;
      }
      const x = e.clientX;
      const y = e.clientY;
      if (temPosicao) {
        sobra += Math.hypot(x - mx, y - my) * FLUXO;
        const n = Math.min(Math.floor(sobra), MAX_POR_MOVIMENTO);
        sobra = Math.min(sobra - Math.floor(sobra), 1);
        for (let i = 0; i < n; i++) {
          const f = (i + 1) / n; // distribui as partículas ao longo do trajeto
          ps.push({
            x: mx + (x - mx) * f,
            y: my + (y - my) * f,
            vx: (Math.random() - 0.5) * ESPALHAMENTO,
            vy: (Math.random() - 0.5) * ESPALHAMENTO,
            idade: 0,
          });
        }
        if (ps.length > MAX_PARTICULAS) ps.splice(0, ps.length - MAX_PARTICULAS);
      }
      mx = x;
      my = y;
      temPosicao = true;
      brilho = 1;
      iniciar();
    };

    const aoSairDaJanela = () => {
      temPosicao = false;
    };

    const aoMudarVisibilidade = () => {
      if (document.hidden) parar();
      else if (ps.length || brilho > 0) iniciar();
    };

    // Se o usuário ativar "reduzir movimento" ou trocar para toque, limpa o efeito na hora
    const aoMudarPreferencia = () => {
      if (ativo()) return;
      ps.length = 0;
      brilho = 0;
      parar();
      ctx.clearRect(0, 0, largura, altura);
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    document.documentElement.addEventListener("pointerleave", aoSairDaJanela);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    toque.addEventListener("change", aoMudarPreferencia);
    reduzir.addEventListener("change", aoMudarPreferencia);

    return () => {
      window.removeEventListener("pointermove", aoMover);
      document.documentElement.removeEventListener("pointerleave", aoSairDaJanela);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
      toque.removeEventListener("change", aoMudarPreferencia);
      reduzir.removeEventListener("change", aoMudarPreferencia);
      ro.disconnect();
      parar();
    };
  }, []);

  // z-[55]: acima do cabeçalho (z-50) e do botão do WhatsApp (z-40), abaixo dos modais (z-[60]).
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] h-full w-full"
    />
  );
}
