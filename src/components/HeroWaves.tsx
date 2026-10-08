// @ts-nocheck -- tipos do three/webgpu e three/tsl ainda são incompletos
// Fundo animado 3D do topo (Hero): malha de ondas azul + partículas subindo.
// Para mudar cores, velocidade ou quantidade de partículas, edite as constantes
// em "CONFIGURAÇÃO EDITÁVEL" logo abaixo. É só decoração (não clicável).
import { useEffect, useRef } from "react";

// ===== CONFIGURAÇÃO EDITÁVEL =====
// Cores em hexadecimal (linhas e partículas)
const COR_LINHAS = "#5CB8FF";      // azul claro das linhas
const COR_PARTICULAS = "#9ADBFF";  // azul mais claro das partículas
const OPACIDADE_LINHAS = 0.06;
// Velocidade (maior = mais rápido) e altura das ondas
const VELOCIDADE_ONDA = 0.25;
const ALTURA_ONDA = 4;
// Quantidade de partículas (menos = mais leve)
const PARTICULAS_DESKTOP = 25000;
const PARTICULAS_MOBILE = 8000;

export default function HeroWaves() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Respeita quem prefere menos animação: mostra só o gradiente de fundo
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three/webgpu");
        const tsl = await import("three/tsl");
        const { LineSegments2 } = await import("three/addons/lines/webgpu/LineSegments2.js");
        const { LineSegmentsGeometry } = await import("three/addons/lines/LineSegmentsGeometry.js");

        const isMobile = window.innerWidth < 768;
        const size = { x: 15, y: 15 };
        const segs = isMobile ? { x: 70, y: 100 } : { x: 100, y: 150 };

        // ---------- Linhas da malha ----------
        const instStart: number[] = [];
        const instEnd: number[] = [];
        let amount = 0;
        for (let i = 0; i <= segs.y; i++) {
          const y = (i / segs.y - 0.5) * size.y;
          for (let j = 0; j < segs.x; j++) {
            const x1 = ((j + 0) / segs.x - 0.5) * size.x;
            const x2 = ((j + 1) / segs.x - 0.5) * size.x;
            if (Math.hypot(x1, y) < size.x * 0.5 && Math.hypot(x2, y) < size.x * 0.5) {
              instStart.push(x1, 0, -y);
              instEnd.push(x2, 0, -y);
              amount += 1;
            }
          }
        }

        const g = new LineSegmentsGeometry();
        (g as any).instanceCount = amount;

        const instStartData = new Float32Array(instStart);
        const instEndData = new Float32Array(instEnd);

        const attributeStart = new THREE.StorageInstancedBufferAttribute(instStartData, 3);
        const storageStart = tsl.storage(attributeStart, "vec3", amount).setPBO(true);
        g.setAttribute("instanceStart", attributeStart as any);

        const attributeEnd = new THREE.StorageInstancedBufferAttribute(instEndData, 3);
        const storageEnd = tsl.storage(attributeEnd, "vec3", amount).setPBO(true);
        g.setAttribute("instanceEnd", attributeEnd as any);

        const instanceStartInit = tsl.instancedArray(instStartData.slice(), "vec3");
        const instanceEndInit = tsl.instancedArray(instEndData.slice(), "vec3");

        const density = 0.125;
        const t = tsl.time.mul(VELOCIDADE_ONDA).toVar();
        const noiseF = tsl.Fn(([p]: any) => {
          return tsl.mx_noise_float(tsl.vec3(p.xz.mul(density), t)).mul(ALTURA_ONDA);
        });

        const computeF = tsl.Fn(() => {
          const posStart = instanceStartInit.element(tsl.instanceIndex).toVar();
          const posEnd = instanceEndInit.element(tsl.instanceIndex).toVar();
          const nStart = noiseF(posStart).toVar();
          const nEnd = noiseF(posEnd).toVar();
          posStart.y.addAssign(nStart);
          posEnd.y.addAssign(nEnd);
          storageStart.element(tsl.instanceIndex).assign(posStart);
          storageEnd.element(tsl.instanceIndex).assign(posEnd);
        })();
        const computeNode = tsl.compute(computeF, amount).setName("compute waves");

        const lineMaterial = new THREE.Line2NodeMaterial({
          lineColorNode: tsl.color(COR_LINHAS),
          linewidth: 0.075,
          worldUnits: true,
          alphaToCoverage: true,
          transparent: true,
          opacity: OPACIDADE_LINHAS,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        } as any);

        const lines = new LineSegments2(g, lineMaterial as any);

        // ---------- Partículas ----------
        const pointsAmount = isMobile ? PARTICULAS_MOBILE : PARTICULAS_DESKTOP;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const rRatio = (size.x * 0.5) / Math.sqrt(pointsAmount);
        const maxShift = 2;
        const maxSpeed = 0.25;

        const phasesArr = new Float32Array(pointsAmount);
        const pointsArr = new Float32Array(pointsAmount * 3);
        for (let i = 0; i < pointsAmount; i++) {
          const phase = Math.random();
          phasesArr[i] = phase;
          const a = goldenAngle * i;
          const r = Math.sqrt(i) * rRatio;
          pointsArr[i * 3 + 0] = Math.cos(a) * r;
          pointsArr[i * 3 + 1] = phase * maxShift; // altura inicial (substitui o onInit do original, que tinha erro)
          pointsArr[i * 3 + 2] = Math.sin(a) * r;
        }
        const gPoints = tsl.instancedArray(pointsArr, "vec3");
        const gPhases = tsl.instancedArray(phasesArr, "float");

        const computeNodePoints = tsl
          .Fn(() => {
            const phase = gPhases.element(tsl.instanceIndex);
            const point = gPoints.element(tsl.instanceIndex);
            const currPhase = phase.toVar();
            const dt = tsl.deltaTime.mul(maxSpeed).toVar();
            currPhase.addAssign(dt);
            const currPoint = point.toVar();
            const noiseVal = noiseF(currPoint).toVar();
            tsl.If(currPhase.greaterThan(1.0), () => {
              currPhase.assign(tsl.fract(currPhase));
              currPoint.y.assign(noiseVal.add(currPhase.mul(maxShift)));
            });
            phase.assign(currPhase);
            currPoint.y.addAssign(dt.mul(maxShift));
            currPoint.y.assign(tsl.max(currPoint.y, noiseVal));
            point.assign(currPoint);
          })()
          .compute(pointsAmount)
          .setName("compute points");

        const pointsMaterial = new THREE.PointsNodeMaterial({
          positionNode: gPoints.element(tsl.instanceIndex),
          sizeNode: tsl.Fn(() => {
            const phaseVal = gPhases.element(tsl.instanceIndex).toVar();
            const phaseF = tsl.smoothstep(0, 0.1, phaseVal).sub(tsl.smoothstep(0.5, 1, phaseVal));
            return phaseF.mul(0.15);
          })(),
          colorNode: tsl.color(COR_PARTICULAS),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacityNode: tsl.Fn(() => {
            const uv = tsl.uv().sub(0.5);
            const dist = tsl.length(uv);
            const f = tsl.smoothstep(0, 0.5, dist).oneMinus().toVar();
            const phaseVal = gPhases.element(tsl.instanceIndex).toVar();
            const phaseF = tsl.smoothstep(0, 0.1, phaseVal).sub(tsl.smoothstep(0.9, 1, phaseVal));
            f.mulAssign(phaseF);
            return f;
          })(),
        } as any);

        const sprite = new THREE.Sprite(pointsMaterial as any);
        (sprite as any).count = pointsAmount;
        lines.add(sprite);

        // ---------- Cena, câmera e renderer (fundo transparente) ----------
        const scene = new THREE.Scene();
        scene.add(lines);

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        const renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true, forceWebGL: true } as any);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        await renderer.init();
        if (disposed) {
          renderer.dispose();
          return;
        }

        const canvas = renderer.domElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        container.appendChild(canvas);

        const resize = () => {
          const w = container.clientWidth || 1;
          const h = container.clientHeight || 1;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        };
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        // Só anima quando o hero está visível e a aba está ativa (economiza bateria)
        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
        io.observe(container);

        const start = performance.now();
        renderer.setAnimationLoop(() => {
          if (!visible || document.hidden) return;
          const time = (performance.now() - start) / 1000;
          // Câmera com movimento lento e suave (sem controle do usuário)
          const ang = Math.PI / 4 + Math.sin(time * 0.05) * 0.3;
          camera.position.set(Math.sin(ang) * 9.7, 1.8, Math.cos(ang) * 9.7);
          camera.lookAt(0, 0.6, 0);
          renderer.compute(computeNode);
          renderer.compute(computeNodePoints);
          renderer.render(scene, camera);
        });

        cleanup = () => {
          renderer.setAnimationLoop(null);
          resizeObserver.disconnect();
          io.disconnect();
          renderer.dispose();
          if (canvas.parentNode === container) container.removeChild(canvas);
        };
        if (disposed) cleanup();
      } catch (err) {
        // Se o navegador não suportar, o gradiente de fundo continua e o site funciona normalmente
        console.warn("HeroWaves desativado:", err);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(10,140,255,0.12) 0%, rgba(7,11,18,0) 65%)",
      }}
    />
  );
}

