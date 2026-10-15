// Rastro luminoso "constelação" que segue o mouse. Só aparece em computador (mouse)
// e é desligado com "reduzir movimento". Ajuste os parâmetros abaixo.
import { useEffect, useRef } from 'react';

const COR = '92, 184, 255';        // cor principal das partículas (#5CB8FF, em RGB)
const COR_BRILHO = '154, 219, 255'; // cor do brilho central (#9ADBFF, em RGB)
const TAMANHO = 4;                  // raio das partículas em px
const INTENSIDADE = 0.55;           // opacidade máxima (0 a 1)
const FLUXO = 0.6;                  // partículas por px movido (mais = rastro mais denso)
const DURACAO = 1.2;                // tempo de vida do rastro em segundos
const MAX_PARTICULAS = 100;         // limite de partículas na tela
const ATRITO = 0.96;                // desaceleração por quadro
const ALCANCE_LINHA = TAMANHO * 5;  // distância máxima para ligar partículas

// easing cubic-bezier(0.4, 0, 0.2, 1) aproximado
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
type P = { x: number; y: number; vx: number; vy: number; idade: number };

export default function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const ps: P[] = []; let raf = 0; let last = 0; let mx = -999, my = -999, sobra = 0, glow = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const ro = new ResizeObserver(resize); ro.observe(document.documentElement); resize();

    const frame = (t: number) => {
      const dt = Math.min((t - (last || t)) / 1000, 0.05); last = t;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const k = Math.pow(ATRITO, dt * 60);
      for (let i = ps.length - 1; i >= 0; i--) { const p = ps[i]; p.idade += dt; if (p.idade >= DURACAO) { ps.splice(i, 1); continue; } p.vx *= k; p.vy *= k; p.x += p.vx * dt * 60; p.y += p.vy * dt * 60; }
      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i], b = ps[j]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (d > ALCANCE_LINHA) continue;
        const v = (1 - ease(Math.max(a.idade, b.idade) / DURACAO)) * (1 - d / ALCANCE_LINHA) * INTENSIDADE * 0.4;
        ctx.strokeStyle = `rgba(${COR}, ${v})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (const p of ps) {
        const vida = 1 - ease(p.idade / DURACAO); const r = TAMANHO * (0.4 + 0.6 * vida);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(${COR_BRILHO}, ${vida * INTENSIDADE})`); g.addColorStop(1, `rgba(${COR}, 0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
      }
      glow = Math.max(0, glow - dt / DURACAO);
      if (glow > 0) { const g = ctx.createRadialGradient(mx, my, 0, mx, my, 16); g.addColorStop(0, `rgba(${COR_BRILHO}, ${glow * INTENSIDADE * 0.5})`); g.addColorStop(1, `rgba(${COR}, 0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.fill(); }
      raf = ps.length || glow > 0 ? requestAnimationFrame(frame) : 0; if (!raf) last = 0;
    };
    const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const dist = mx < -900 ? 0 : Math.hypot(e.clientX - mx, e.clientY - my);
      sobra += dist * FLUXO; const n = Math.floor(sobra); sobra -= n;
      for (let i = 0; i < n && i < 6; i++) {
        const f = (i + 1) / n; ps.push({ x: mx + (e.clientX - mx) * f, y: my + (e.clientY - my) * f, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, idade: 0 });
      }
      while (ps.length > MAX_PARTICULAS) ps.shift();
      mx = e.clientX; my = e.clientY; glow = 1; start();
    };
    const onVis = () => { if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; last = 0; } else start(); };
    addEventListener('pointermove', onMove, { passive: true }); document.addEventListener('visibilitychange', onVis);
    return () => { removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis); ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55] h-full w-full" />;
}
