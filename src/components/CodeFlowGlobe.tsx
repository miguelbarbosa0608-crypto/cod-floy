// Globo 3D interativo da seção "Quem Somos" (inspirado no "Globe" do Originkit).
// Solto sobre o fundo da página (sem moldura): oceano translúcido com volume, continentes em
// pontos instanciados (mapa Natural Earth 110m, domínio público, em src/assets/geo/), contorno dos
// continentes, grade em tubos finos, atmosfera azul, arcos de conexão saindo de Goiânia e estrelas.
// Gira sozinho para leste; arraste para girar (com inércia); passar o mouse pausa.
// Three.js, d3-geo e o mapa só carregam quando o globo chega perto da tela.
// Sem WebGL (ou se algo falhar), mostra a logo estática. Estilos no bloco "Globo" de src/styles.css.
import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import logoUrl from "@/assets/code-flow-logo-compacta.png";
import logoCompletaUrl from "@/assets/code-flow-logo-completa.png";
import terrasUrl from "@/assets/geo/land.json?url";
import brasilUrl from "@/assets/geo/brasil.json?url";

// ===== Parâmetros (ajuste aqui) =====
// Pontos dos continentes
const COR_PONTOS = "#9adbff"; // continentes
const COR_BRASIL = "#e6f7ff"; // Brasil em destaque (entre #FFFFFF e #CFEFFF)
const OPACIDADE_PONTOS = 0.95;
const TAMANHO_PONTO = 0.0062; // raio do ponto normal (o globo tem raio 1)
const VARIACAO_TAMANHO = 0.3; // pontos grandes/pequenos ficam 30% maiores/menores
const VARIACAO_BRILHO = 0.35; // 0 = todos iguais; 0.35 = alguns pontos até 35% mais apagados
const PONTOS_DESKTOP = 26000; // amostras na esfera (só as que caem em terra viram pontos)
const PONTOS_MOBILE = 11000;
// Oceano (gradiente do centro para a borda) e luz de borda
const OCEANO_CENTRO = "#0b2a4f";
const OCEANO_CENTRO_ALFA = 0.55;
const OCEANO_BORDA = "#0a1830";
const OCEANO_BORDA_ALFA = 0.85;
const COR_LUZ_BORDA = "#5cb8ff"; // brilho no contorno da esfera
const INTENSIDADE_LUZ_BORDA = 0.85;
// Atmosfera (halo em volta)
const COR_ATMOSFERA = "#5cb8ff";
const INTENSIDADE_ATMOSFERA = 0.35;
// Grade e contornos
const COR_GRADE = "#5cb8ff";
const OPACIDADE_GRADE = 0.18;
const COR_CONTORNO = "#5cb8ff"; // contorno dos continentes
const OPACIDADE_CONTORNO = 0.55;
// Local da Code Flow
const LOCAL = { nome: "Goiânia · GO", lat: -16.6869, lng: -49.2648 };
const COR_MARCADOR = "#00d9ff";
// Arcos de conexão saindo de Goiânia (só decoração, sem rótulos)
const COR_ARCOS = "#00d9ff";
const DESTINOS_ARCOS = [
  { lat: 38.72, lng: -9.14 }, // Lisboa
  { lat: 40.71, lng: -74.0 }, // Nova York
  { lat: 19.43, lng: -99.13 }, // Cidade do México
  { lat: -33.92, lng: 18.42 }, // Cidade do Cabo
  { lat: -33.45, lng: -70.67 }, // Santiago
];
const VELOCIDADE_ARCOS = 0.16; // voltas por segundo da partícula em cada arco
// Movimento
const VELOCIDADE = 0.4 / 60; // giro automático: 0,4 radiano por minuto, sentido leste
const INCLINACAO_EIXO = 15; // graus de inclinação do eixo (efeito de órbita)
const SENSIBILIDADE = 0.006; // radianos girados por px arrastado
const ATRITO = 0.93; // inércia restante a cada quadro após soltar (0 a 1)
// Estrelas em volta
const QUANTIDADE_ESTRELAS = 80;
const COR_ESTRELAS = "#9adbff";
const OPACIDADE_ESTRELAS = 0.35;
// Tamanho do globo dentro do quadrado (o resto fica para o halo e os arcos)
const OCUPACAO = 0.7;

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
      <div className="grid h-full w-full place-items-center p-6">
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
      data-sem-rastro=""
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

// Número pseudoaleatório estável (mesmo resultado a cada carregamento)
const acaso = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

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
  if (foiCancelado()) return () => {};

  type Vetor = InstanceType<typeof THREE.Vector3>;
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(pointer: coarse)").matches || caixa.clientWidth < 400;

  // lat/lng em graus -> ponto na esfera (lng 0 voltado para +z)
  const vetor = (lat: number, lng: number, r = 1): Vetor => {
    const f = (lat * Math.PI) / 180;
    const l = (lng * Math.PI) / 180;
    return new THREE.Vector3(
      r * Math.cos(f) * Math.sin(l),
      r * Math.sin(f),
      r * Math.cos(f) * Math.cos(l),
    );
  };

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
  const pontos: { lat: number; lng: number; br: boolean; i: number }[] = [];
  for (let i = 0; i < total; i++) {
    const y = 1 - (2 * (i + 0.5)) / total;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lng = (((((i * ouro * 180) / Math.PI) % 360) + 540) % 360) - 180;
    const p: [number, number] = [lng, lat];
    if (!caixasTerra.some(({ f, b }) => dentro(b, lng, lat) && d3.geoContains(f, p))) continue;
    pontos.push({ lat, lng, br: dentro(caixaBrasil, lng, lat) && d3.geoContains(brasil, p), i });
  }

  // ----- Cena -----
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0); // fundo 100% transparente
  renderer.domElement.className = "globe-canvas";
  caixa.prepend(renderer.domElement);

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  const eixo = new THREE.Group(); // inclinação do eixo (efeito de órbita)
  const inclinacao = new THREE.Group(); // gira em X (latitude)
  const giro = new THREE.Group(); // gira em Y (eixo da Terra)
  eixo.add(inclinacao);
  inclinacao.add(giro);
  cena.add(eixo);
  eixo.rotation.z = (-INCLINACAO_EIXO * Math.PI) / 180;
  // Começa com o Brasil (Goiânia) de frente
  inclinacao.rotation.x = (LOCAL.lat * Math.PI) / 180;
  giro.rotation.y = (-LOCAL.lng * Math.PI) / 180;

  const descartaveis: { dispose: () => void }[] = [];
  const guardar = <T extends { dispose: () => void }>(x: T) => (descartaveis.push(x), x);
  const cor = (hex: string) => new THREE.Color(hex);

  // Oceano: gradiente radial (centro mais claro e translúcido, borda mais densa) + luz de borda
  const oceano = new THREE.Mesh(
    guardar(new THREE.SphereGeometry(1, 96, 64)),
    guardar(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        uniforms: {
          uCentro: { value: cor(OCEANO_CENTRO) },
          uBorda: { value: cor(OCEANO_BORDA) },
          uAlfaCentro: { value: OCEANO_CENTRO_ALFA },
          uAlfaBorda: { value: OCEANO_BORDA_ALFA },
          uLuz: { value: cor(COR_LUZ_BORDA) },
          uIntensidade: { value: INTENSIDADE_LUZ_BORDA },
        },
        vertexShader: `
          varying vec3 vNormal; varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uCentro; uniform vec3 uBorda; uniform float uAlfaCentro; uniform float uAlfaBorda;
          uniform vec3 uLuz; uniform float uIntensidade;
          varying vec3 vNormal; varying vec3 vPos;
          void main() {
            float borda = 1.0 - clamp(dot(normalize(vNormal), normalize(-vPos)), 0.0, 1.0);
            vec3 c = mix(uCentro, uBorda, smoothstep(0.0, 1.0, borda));
            float a = mix(uAlfaCentro, uAlfaBorda, borda);
            float rim = pow(borda, 7.0) * uIntensidade; // só a beirada acende
            gl_FragColor = vec4(c + uLuz * rim, min(1.0, a + rim * 0.4));
          }`,
      }),
    ),
  );
  oceano.renderOrder = 0;
  giro.add(oceano);

  // Atmosfera: esfera um pouco maior com brilho aditivo nas bordas
  const atmosfera = new THREE.Mesh(
    guardar(new THREE.SphereGeometry(1.12, 64, 48)),
    guardar(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uCor: { value: cor(COR_ATMOSFERA) },
          uIntensidade: { value: INTENSIDADE_ATMOSFERA },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform vec3 uCor; uniform float uIntensidade; varying vec3 vNormal;
          void main() {
            float i = pow(clamp(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 4.0);
            gl_FragColor = vec4(uCor, i * uIntensidade);
          }`,
      }),
    ),
  );
  atmosfera.renderOrder = 5; // depois do oceano: a parte atrás da esfera fica escondida
  cena.add(atmosfera);

  // Grade de latitude/longitude em tubos finos
  const matGrade = guardar(
    new THREE.MeshBasicMaterial({
      color: COR_GRADE,
      transparent: true,
      opacity: OPACIDADE_GRADE,
      depthWrite: false,
    }),
  );
  const tubo = (pts: Vetor[]) => {
    const malhaTubo = new THREE.Mesh(
      guardar(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 120, 0.0016, 4, true)),
      matGrade,
    );
    malhaTubo.renderOrder = 1;
    giro.add(malhaTubo);
  };
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts: Vetor[] = [];
    for (let lng = -180; lng < 180; lng += 3) pts.push(vetor(lat, lng, 1.002));
    tubo(pts);
  }
  for (let lng = -180; lng < 180; lng += 30) {
    const pts: Vetor[] = [];
    for (let lat = -90; lat < 270; lat += 3) {
      // meridiano completo (volta pela face oposta)
      const l = lat <= 90 ? lat : 180 - lat;
      pts.push(vetor(l, lat <= 90 ? lng : lng + 180, 1.002));
    }
    tubo(pts);
  }

  // Contorno dos continentes
  const linhasContorno: number[] = [];
  const contornarAnel = (anel: Position[]) => {
    for (let i = 0; i < anel.length - 1; i++) {
      const a = vetor(anel[i]![1]!, anel[i]![0]!, 1.0025);
      const b = vetor(anel[i + 1]![1]!, anel[i + 1]![0]!, 1.0025);
      linhasContorno.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  };
  const contornar = (g: Geometry | null) => {
    if (!g) return;
    if (g.type === "Polygon") g.coordinates.forEach(contornarAnel);
    if (g.type === "MultiPolygon") g.coordinates.forEach((p) => p.forEach(contornarAnel));
  };
  terras.features.forEach((f) => contornar(f.geometry));
  const geoContorno = guardar(new THREE.BufferGeometry());
  geoContorno.setAttribute("position", new THREE.Float32BufferAttribute(linhasContorno, 3));
  const contorno = new THREE.LineSegments(
    geoContorno,
    guardar(
      new THREE.LineBasicMaterial({
        color: COR_CONTORNO,
        transparent: true,
        opacity: OPACIDADE_CONTORNO,
        depthWrite: false,
      }),
    ),
  );
  contorno.renderOrder = 2;
  giro.add(contorno);

  // Continentes em pontos instanciados: dois tamanhos e brilho variado por ponto
  const geoPonto = guardar(
    new THREE.CircleGeometry(mobile ? TAMANHO_PONTO * 1.25 : TAMANHO_PONTO, 6),
  );
  const matPonto = guardar(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: OPACIDADE_PONTOS,
      depthWrite: false,
    }),
  );
  const malha = new THREE.InstancedMesh(geoPonto, matPonto, pontos.length);
  malha.renderOrder = 1;
  const auxiliar = new THREE.Object3D();
  const corTerra = cor(COR_PONTOS);
  const corBrasil = cor(COR_BRASIL);
  const corPonto = new THREE.Color();
  pontos.forEach((p, n) => {
    const pos = vetor(p.lat, p.lng, 1.003);
    auxiliar.position.copy(pos);
    auxiliar.lookAt(pos.clone().multiplyScalar(2)); // virado para fora da esfera
    auxiliar.scale.setScalar(acaso(p.i) < 0.5 ? 1 + VARIACAO_TAMANHO : 1 - VARIACAO_TAMANHO);
    auxiliar.updateMatrix();
    malha.setMatrixAt(n, auxiliar.matrix);
    const brilho = 1 - VARIACAO_BRILHO * acaso(p.i + 0.5);
    malha.setColorAt(n, corPonto.copy(p.br ? corBrasil : corTerra).multiplyScalar(brilho));
  });
  malha.instanceMatrix.needsUpdate = true;
  if (malha.instanceColor) malha.instanceColor.needsUpdate = true;
  giro.add(malha);

  // Marcador de Goiânia: ponto maior + anel pulsante
  const posLocal = vetor(LOCAL.lat, LOCAL.lng, 1.006);
  const marcador = new THREE.Group();
  marcador.position.copy(posLocal);
  marcador.lookAt(posLocal.clone().multiplyScalar(2));
  const ponto = new THREE.Mesh(
    guardar(new THREE.CircleGeometry(0.026, 28)),
    guardar(new THREE.MeshBasicMaterial({ color: COR_MARCADOR, transparent: true })),
  );
  const matAnel = guardar(
    new THREE.MeshBasicMaterial({
      color: COR_MARCADOR,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  );
  const anel = new THREE.Mesh(guardar(new THREE.RingGeometry(0.032, 0.039, 48)), matAnel);
  ponto.renderOrder = anel.renderOrder = 4;
  marcador.add(ponto, anel);
  giro.add(marcador);

  // Arcos de conexão animados (linha com rastro + partícula percorrendo o arco)
  const origem = vetor(LOCAL.lat, LOCAL.lng, 1);
  const arcos = DESTINOS_ARCOS.map((d, k) => {
    const destino = vetor(d.lat, d.lng, 1);
    const angulo = origem.angleTo(destino);
    const altura = 0.12 + 0.22 * (angulo / Math.PI); // arcos longos sobem mais
    const pts: Vetor[] = [];
    const ts: number[] = [];
    const passos = 72;
    for (let i = 0; i <= passos; i++) {
      const t = i / passos;
      // interpolação esférica + elevação em forma de arco
      const p = origem
        .clone()
        .multiplyScalar(Math.sin((1 - t) * angulo))
        .add(destino.clone().multiplyScalar(Math.sin(t * angulo)))
        .divideScalar(Math.sin(angulo))
        .normalize()
        .multiplyScalar(1.004 + altura * Math.sin(Math.PI * t));
      pts.push(p);
      ts.push(t);
    }
    const geo = guardar(new THREE.BufferGeometry().setFromPoints(pts));
    geo.setAttribute("aT", new THREE.Float32BufferAttribute(ts, 1));
    const mat = guardar(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uCor: { value: cor(COR_ARCOS) }, uCabeca: { value: 0 } },
        vertexShader: `
          attribute float aT; varying float vT;
          void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform vec3 uCor; uniform float uCabeca; varying float vT;
          void main() {
            float pontas = smoothstep(0.0, 0.08, vT) * smoothstep(1.0, 0.92, vT);
            float d = uCabeca - vT;
            float rastro = (d >= 0.0 && d < 0.28) ? (1.0 - d / 0.28) : 0.0;
            gl_FragColor = vec4(uCor, (0.12 + 0.75 * rastro) * pontas);
          }`,
      }),
    );
    const linha = new THREE.Line(geo, mat);
    linha.renderOrder = 3;
    giro.add(linha);
    const particula = new THREE.Mesh(
      guardar(new THREE.SphereGeometry(0.011, 10, 8)),
      guardar(new THREE.MeshBasicMaterial({ color: COR_ARCOS, transparent: true })),
    );
    particula.renderOrder = 3;
    giro.add(particula);
    return { pts, mat, particula, fase: k / DESTINOS_ARCOS.length };
  });

  // Estrelas: pontinhos sutis flutuando em volta do globo
  const posEstrelas: number[] = [];
  for (let i = 0; i < QUANTIDADE_ESTRELAS; i++) {
    const u = acaso(i * 3.1) * 2 - 1;
    const th = acaso(i * 7.7) * Math.PI * 2;
    const r = 1.3 + acaso(i * 1.3) * 0.75;
    const s = Math.sqrt(1 - u * u);
    posEstrelas.push(r * s * Math.cos(th), r * u, r * s * Math.sin(th));
  }
  const geoEstrelas = guardar(new THREE.BufferGeometry());
  geoEstrelas.setAttribute("position", new THREE.Float32BufferAttribute(posEstrelas, 3));
  const estrelas = new THREE.Points(
    geoEstrelas,
    guardar(
      new THREE.PointsMaterial({
        color: COR_ESTRELAS,
        size: 1.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: OPACIDADE_ESTRELAS,
        depthWrite: false,
      }),
    ),
  );
  estrelas.renderOrder = 6; // depois do oceano: estrelas atrás do globo ficam escondidas
  cena.add(estrelas);

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
    camera.position.set(0, 0, Math.sqrt(1 + 1 / (t * t)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    caixa.style.setProperty("--globe-d", `${OCUPACAO * Math.min(largura, altura)}px`);
  };
  const ro = new ResizeObserver(ajustar);
  ro.observe(caixa);
  ajustar();

  // ----- Interação -----
  let inercia = 0;
  let mouseEmCima = false;
  let velocidadeAtual = reduzir.matches ? 0 : VELOCIDADE;
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
    const parado = reduzir.matches;
    if (!parado) tempo += dt;

    if (!arraste.ativo) {
      // pausa no hover e retoma suavemente
      const alvo = parado || mouseEmCima ? 0 : VELOCIDADE;
      velocidadeAtual += (alvo - velocidadeAtual) * Math.min(1, dt * 2.5);
      giro.rotation.y += (velocidadeAtual + inercia) * dt;
      inercia *= Math.pow(ATRITO, dt * 60);
      if (Math.abs(inercia) < 0.002) inercia = 0;
    }
    if (!parado) estrelas.rotation.y += dt * 0.01;

    // anel pulsante (parado com movimento reduzido)
    const fase = parado ? 0.35 : (tempo % 2) / 2;
    anel.scale.setScalar(1 + fase * 1.8);
    matAnel.opacity = 0.8 * (1 - fase);

    // arcos: a cabeça percorre o arco e some por um instante antes de recomeçar
    for (const a of arcos) {
      const ciclo = parado ? 0.6 : (tempo * VELOCIDADE_ARCOS + a.fase) % 1.35;
      a.mat.uniforms["uCabeca"]!.value = ciclo;
      const t = Math.min(ciclo, 1);
      const idx = Math.round(t * (a.pts.length - 1));
      a.particula.position.copy(a.pts[idx]!);
      a.particula.visible = !parado && ciclo <= 1 && ciclo > 0.02;
    }

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
      // fica à direita do ponto; se não couber, passa para a esquerda
      const larguraRotulo = rotulo.offsetWidth;
      const rx = x + 14 + larguraRotulo > largura - 6 ? x - 14 - larguraRotulo : x + 14;
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
