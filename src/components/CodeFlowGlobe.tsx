// Globo 3D interativo da seção "Quem Somos" (inspirado no "Globe" do Originkit).
// Oceano translúcido, continentes em pontos instanciados (gerados do mapa Natural Earth 110m,
// domínio público, em src/assets/geo/), Brasil em destaque e marcador pulsante em Goiânia.
// Gira sozinho; arraste para girar (com inércia); passar o mouse pausa.
// Three.js, d3-geo e o mapa só são carregados quando o card chega perto da tela.
// Sem WebGL (ou se algo falhar), mostra a logo estática. Estilos no bloco "Globo" de src/styles.css.
import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection } from "geojson";
import logoUrl from "@/assets/code-flow-logo-compacta.png";
import logoCompletaUrl from "@/assets/code-flow-logo-completa.png";
import terrasUrl from "@/assets/geo/land.json?url";
import brasilUrl from "@/assets/geo/brasil.json?url";

// ===== Parâmetros (ajuste aqui) =====
const COR_OCEANO = "#0a1830"; // esfera do oceano
const OPACIDADE_OCEANO = 0.92;
const COR_PONTOS = "#5cb8ff"; // continentes
const COR_BRASIL = "#9adbff"; // Brasil em destaque
const OPACIDADE_PONTOS = 0.85;
const COR_GRADE = "#13213a"; // linhas de latitude/longitude
const COR_CONTORNO = "#5cb8ff"; // contorno do globo
const COR_MARCADOR = "#00d9ff"; // ponto de Goiânia
const LOCAL = { nome: "Goiânia · GO", lat: -16.6869, lng: -49.2648 };
const PONTOS_DESKTOP = 16000; // amostras na esfera (só as que caem em terra viram pontos)
const PONTOS_MOBILE = 7000;
const VELOCIDADE = 0.12; // giro automático em radianos por segundo
const SENSIBILIDADE = 0.006; // radianos girados por px arrastado
const ATRITO = 0.93; // inércia restante a cada quadro após soltar (0 a 1)
const OCUPACAO = 0.86; // quanto do card o globo ocupa (diâmetro / menor lado)

type Estado = "carregando" | "pronto" | "falhou";

export default function CodeFlowGlobe() {
  const caixaRef = useRef<HTMLDivElement>(null);
  const rotuloRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("carregando");

  useEffect(() => {
    const caixa = caixaRef.current;
    if (!caixa) return;
    let cancelado = false;
    let desmontar: (() => void) | null = null;

    // Sem WebGL: fica a logo estática.
    const teste = document.createElement("canvas");
    if (!(teste.getContext("webgl2") || teste.getContext("webgl"))) {
      setEstado("falhou");
      return;
    }

    const perto = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting) return;
        perto.disconnect();
        montar(caixa, rotuloRef.current, () => cancelado)
          .then((fn) => {
            if (cancelado) fn();
            else {
              desmontar = fn;
              setEstado("pronto");
            }
          })
          .catch((erro) => {
            console.warn("Globo indisponível, usando a logo estática.", erro);
            if (!cancelado) setEstado("falhou");
          });
      },
      { rootMargin: "400px" },
    );
    perto.observe(caixa);

    return () => {
      cancelado = true;
      perto.disconnect();
      desmontar?.();
    };
  }, []);

  if (estado === "falhou")
    return (
      <div className="grid h-full w-full place-items-center p-6 sm:p-10">
        <img
          src={logoCompletaUrl}
          alt="Logo Code Flow"
          width={761}
          height={463}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    );

  return (
    <div
      ref={caixaRef}
      className="globe-box"
      data-estado={estado}
      role="img"
      aria-label="Globo 3D com o Brasil em destaque e a localização da Code Flow em Goiânia, GO"
    >
      <img src={logoUrl} alt="" aria-hidden="true" className="globe-logo" draggable={false} />
      <div ref={rotuloRef} className="globe-label" aria-hidden="true">
        <span className="globe-label-dot" />
        {LOCAL.nome}
      </div>
    </div>
  );
}

// Monta a cena e devolve a função que desfaz tudo.
async function montar(
  caixa: HTMLDivElement,
  rotulo: HTMLDivElement | null,
  foiCancelado: () => boolean,
): Promise<() => void> {
  const [THREE, d3, terras, brasil] = await Promise.all([
    import("three"),
    import("d3-geo"),
    fetch(terrasUrl).then((r) => r.json() as Promise<FeatureCollection>),
    fetch(brasilUrl).then((r) => r.json() as Promise<Feature>),
  ]);
  const nada = () => {};
  if (foiCancelado()) return nada;

  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(pointer: coarse)").matches || caixa.clientWidth < 640;

  // ----- Pontos de terra (amostragem uniforme da esfera, "espiral de Fibonacci") -----
  const caixasTerra = terras.features.map((f) => ({ f, b: d3.geoBounds(f) }));
  const caixaBrasil = d3.geoBounds(brasil);
  const dentro = (b: [[number, number], [number, number]], lng: number, lat: number) => {
    const [[o, s], [l, n]] = b;
    if (lat < s || lat > n) return false;
    return o <= l ? lng >= o && lng <= l : lng >= o || lng <= l; // caixa que cruza 180°
  };
  const total = mobile ? PONTOS_MOBILE : PONTOS_DESKTOP;
  const ouro = Math.PI * (3 - Math.sqrt(5));
  const pontos: { lat: number; lng: number; br: boolean }[] = [];
  for (let i = 0; i < total; i++) {
    const y = 1 - (2 * (i + 0.5)) / total;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lng = (((((i * ouro * 180) / Math.PI) % 360) + 540) % 360) - 180;
    const p: [number, number] = [lng, lat];
    if (!caixasTerra.some(({ f, b }) => dentro(b, lng, lat) && d3.geoContains(f, p))) continue;
    const br = dentro(caixaBrasil, lng, lat) && d3.geoContains(brasil, p);
    pontos.push({ lat, lng, br });
  }

  // lat/lng em graus -> ponto na esfera (lng 0 voltado para +z)
  const vetor = (lat: number, lng: number, r = 1) => {
    const f = (lat * Math.PI) / 180;
    const l = (lng * Math.PI) / 180;
    return new THREE.Vector3(
      r * Math.cos(f) * Math.sin(l),
      r * Math.sin(f),
      r * Math.cos(f) * Math.cos(l),
    );
  };

  // ----- Cena -----
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "globe-canvas";
  caixa.prepend(renderer.domElement);

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
  const inclinacao = new THREE.Group(); // gira em X (latitude)
  const giro = new THREE.Group(); // gira em Y (eixo da Terra)
  inclinacao.add(giro);
  cena.add(inclinacao);
  // Começa com o Brasil de frente
  inclinacao.rotation.x = (LOCAL.lat * Math.PI) / 180;
  giro.rotation.y = (-LOCAL.lng * Math.PI) / 180;

  const descartaveis: { dispose: () => void }[] = [];
  const guardar = <T extends { dispose: () => void }>(x: T) => (descartaveis.push(x), x);

  // Oceano
  const oceano = new THREE.Mesh(
    guardar(new THREE.SphereGeometry(1, 64, 48)),
    guardar(
      new THREE.MeshBasicMaterial({
        color: COR_OCEANO,
        transparent: true,
        opacity: OPACIDADE_OCEANO,
        depthWrite: true,
      }),
    ),
  );
  oceano.renderOrder = 0;
  giro.add(oceano);

  // Grade de latitude/longitude
  const linhas: number[] = [];
  const segmento = (a: InstanceType<typeof THREE.Vector3>, b: InstanceType<typeof THREE.Vector3>) =>
    linhas.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lat = -60; lat <= 60; lat += 30)
    for (let lng = -180; lng < 180; lng += 4)
      segmento(vetor(lat, lng, 1.0015), vetor(lat, lng + 4, 1.0015));
  for (let lng = -180; lng < 180; lng += 30)
    for (let lat = -88; lat < 88; lat += 4)
      segmento(vetor(lat, lng, 1.0015), vetor(lat + 4, lng, 1.0015));
  const geoGrade = guardar(new THREE.BufferGeometry());
  geoGrade.setAttribute("position", new THREE.Float32BufferAttribute(linhas, 3));
  giro.add(
    new THREE.LineSegments(geoGrade, guardar(new THREE.LineBasicMaterial({ color: COR_GRADE }))),
  );

  // Continentes em pontos instanciados
  const geoPonto = guardar(new THREE.CircleGeometry(mobile ? 0.0085 : 0.0068, 6));
  const matPonto = guardar(
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: OPACIDADE_PONTOS }),
  );
  const malha = new THREE.InstancedMesh(geoPonto, matPonto, pontos.length);
  malha.renderOrder = 1;
  const auxiliar = new THREE.Object3D();
  const corTerra = new THREE.Color(COR_PONTOS);
  const corBrasil = new THREE.Color(COR_BRASIL);
  pontos.forEach((p, i) => {
    const pos = vetor(p.lat, p.lng, 1.002);
    auxiliar.position.copy(pos);
    auxiliar.lookAt(pos.clone().multiplyScalar(2)); // virado para fora da esfera
    auxiliar.updateMatrix();
    malha.setMatrixAt(i, auxiliar.matrix);
    malha.setColorAt(i, p.br ? corBrasil : corTerra);
  });
  malha.instanceMatrix.needsUpdate = true;
  if (malha.instanceColor) malha.instanceColor.needsUpdate = true;
  giro.add(malha);

  // Marcador de Goiânia: ponto + anel pulsante
  const posLocal = vetor(LOCAL.lat, LOCAL.lng, 1.004);
  const marcador = new THREE.Group();
  marcador.position.copy(posLocal);
  marcador.lookAt(posLocal.clone().multiplyScalar(2));
  const ponto = new THREE.Mesh(
    guardar(new THREE.CircleGeometry(0.02, 24)),
    guardar(new THREE.MeshBasicMaterial({ color: COR_MARCADOR })),
  );
  const matAnel = guardar(
    new THREE.MeshBasicMaterial({ color: COR_MARCADOR, transparent: true, opacity: 0.8 }),
  );
  const anel = new THREE.Mesh(guardar(new THREE.RingGeometry(0.026, 0.032, 40)), matAnel);
  ponto.renderOrder = anel.renderOrder = 2;
  marcador.add(ponto, anel);
  giro.add(marcador);

  // Contorno: círculo na silhueta da esfera (não gira com o globo)
  const matContorno = guardar(
    new THREE.LineBasicMaterial({ color: COR_CONTORNO, transparent: true, opacity: 0.55 }),
  );
  const contorno = new THREE.LineLoop(guardar(new THREE.BufferGeometry()), matContorno);
  cena.add(contorno);

  // ----- Tamanho / câmera -----
  let largura = 1;
  let altura = 1;
  const ajustar = () => {
    largura = Math.max(caixa.clientWidth, 1);
    altura = Math.max(caixa.clientHeight, 1);
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    // distância para o globo ocupar OCUPACAO do menor lado
    const t = OCUPACAO * Math.tan(((camera.fov / 2) * Math.PI) / 180) * Math.min(1, camera.aspect);
    const d = Math.sqrt(1 + 1 / (t * t));
    camera.position.set(0, 0, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    const z = 1 / d;
    const r = Math.sqrt(1 - z * z);
    const circulo: number[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      circulo.push(Math.cos(a) * r, Math.sin(a) * r, z);
    }
    contorno.geometry.setAttribute("position", new THREE.Float32BufferAttribute(circulo, 3));
    caixa.style.setProperty("--globe-d", `${OCUPACAO * Math.min(largura, altura)}px`);
  };
  const ro = new ResizeObserver(ajustar);
  ro.observe(caixa);
  ajustar();

  // ----- Interação -----
  let inercia = 0;
  let mouseEmCima = false;
  const arraste = { ativo: false, id: -1, x: 0, y: 0, t: 0 };
  const aoPressionar = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    arraste.ativo = true;
    arraste.id = e.pointerId;
    arraste.x = e.clientX;
    arraste.y = e.clientY;
    arraste.t = performance.now();
    inercia = 0;
    caixa.setPointerCapture(e.pointerId);
    caixa.classList.add("is-dragging");
  };
  const aoMover = (e: PointerEvent) => {
    if (!arraste.ativo || e.pointerId !== arraste.id) return;
    const agora = performance.now();
    const dx = e.clientX - arraste.x;
    const dy = e.clientY - arraste.y;
    giro.rotation.y += dx * SENSIBILIDADE;
    inclinacao.rotation.x = Math.max(
      -1.1,
      Math.min(1.1, inclinacao.rotation.x + dy * SENSIBILIDADE),
    );
    inercia = reduzir.matches
      ? 0
      : (dx * SENSIBILIDADE) / Math.max((agora - arraste.t) / 1000, 0.001);
    arraste.x = e.clientX;
    arraste.y = e.clientY;
    arraste.t = agora;
  };
  const aoSoltar = (e: PointerEvent) => {
    if (e.pointerId !== arraste.id) return;
    arraste.ativo = false;
    if (performance.now() - arraste.t > 80) inercia = 0;
    caixa.classList.remove("is-dragging");
    if (caixa.hasPointerCapture(e.pointerId)) caixa.releasePointerCapture(e.pointerId);
  };
  const aoEntrar = (e: PointerEvent) => {
    if (e.pointerType === "mouse") mouseEmCima = true;
  };
  const aoSair = (e: PointerEvent) => {
    if (e.pointerType === "mouse") mouseEmCima = false;
  };
  caixa.addEventListener("pointerdown", aoPressionar);
  caixa.addEventListener("pointermove", aoMover);
  caixa.addEventListener("pointerup", aoSoltar);
  caixa.addEventListener("pointercancel", aoSoltar);
  caixa.addEventListener("pointerenter", aoEntrar);
  caixa.addEventListener("pointerleave", aoSair);

  // ----- Loop -----
  const mundo = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const paraCamera = new THREE.Vector3();
  let raf = 0;
  let ultimo = 0;
  let tempo = 0;
  let visivel = true;
  const quadro = (agora: number) => {
    const dt = Math.min((agora - (ultimo || agora)) / 1000, 0.05);
    ultimo = agora;
    tempo += dt;
    if (!arraste.ativo) {
      const auto = reduzir.matches || mouseEmCima ? 0 : VELOCIDADE;
      giro.rotation.y += (auto + inercia) * dt;
      inercia *= Math.pow(ATRITO, dt * 60);
      if (Math.abs(inercia) < 0.002) inercia = 0;
    }
    // anel pulsante (parado com movimento reduzido)
    const fase = reduzir.matches ? 0.35 : (tempo % 2) / 2;
    anel.scale.setScalar(1 + fase * 1.8);
    matAnel.opacity = 0.8 * (1 - fase);

    renderer.render(cena, camera);

    // rótulo aparece quando Goiânia está virada para a câmera
    if (rotulo) {
      marcador.getWorldPosition(mundo);
      normal.copy(mundo).normalize();
      paraCamera.copy(camera.position).sub(mundo).normalize();
      const frente = normal.dot(paraCamera);
      const tela = mundo.clone().project(camera);
      const x = ((tela.x + 1) / 2) * largura;
      const y = ((1 - tela.y) / 2) * altura;
      // fica à direita do ponto; se não couber no card, passa para a esquerda
      const larguraRotulo = rotulo.offsetWidth;
      const rx = x + 12 + larguraRotulo > largura - 6 ? x - 12 - larguraRotulo : x + 12;
      rotulo.style.transform = `translate(${rx}px, ${y - 11}px)`;
      rotulo.style.opacity = frente > 0.3 ? "1" : "0";
    }
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
  const naTela = new IntersectionObserver(([e]) => {
    visivel = !!e?.isIntersecting;
    if (visivel) iniciar();
    else parar();
  });
  naTela.observe(caixa);
  const aoMudarAba = () => (document.hidden ? parar() : iniciar());
  document.addEventListener("visibilitychange", aoMudarAba);
  iniciar();

  return () => {
    parar();
    naTela.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", aoMudarAba);
    caixa.removeEventListener("pointerdown", aoPressionar);
    caixa.removeEventListener("pointermove", aoMover);
    caixa.removeEventListener("pointerup", aoSoltar);
    caixa.removeEventListener("pointercancel", aoSoltar);
    caixa.removeEventListener("pointerenter", aoEntrar);
    caixa.removeEventListener("pointerleave", aoSair);
    malha.dispose();
    descartaveis.forEach((d) => d.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
