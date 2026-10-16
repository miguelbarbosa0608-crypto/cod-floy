// Avatar ilustrado em SVG, gerado a partir de uma "semente" (o nome da pessoa).
// O mesmo nome sempre gera o mesmo rosto: varia tom de pele, cabelo, roupa e cor de fundo
// (tons de azul, ciano e cinza do site). Não usa fotos de pessoas reais nem imagens da internet.
// Para usar foto real, adicione o campo foto no item e o componente a exibe no lugar da ilustração,
// com autorização do cliente.
import { useId } from "react";
import { cn } from "@/lib/utils";

const FUNDOS = [
  ["#0a8cff", "#0b5fbf"],
  ["#00a3c4", "#0b5fbf"],
  ["#2a3b57", "#13213a"],
  ["#3a6ea5", "#1b2a44"],
  ["#5cb8ff", "#0a8cff"],
  ["#1b2a44", "#0b1220"],
];
const PELES = ["#f6d5b8", "#eabb94", "#d39c70", "#b67c52", "#8e5b3a", "#6a4128"];
const CABELOS = ["#17171b", "#2f2219", "#4e3220", "#7a4f2a", "#a8814f", "#9aa3ae"];
const ROUPAS = ["#f7f9fc", "#c9d0da", "#13213a", "#0b1220", "#9adbff", "#2a3b57"];

// Hash simples e estável (FNV-1a) para transformar o nome em números.
function hash(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const escolher = <T,>(lista: T[], n: number) => lista[n % lista.length]!;

type Props = {
  /** Semente da ilustração (normalmente o nome). */
  nome: string;
  /** Foto real (opcional, com autorização): substitui a ilustração. */
  foto?: string | undefined;
  size?: number;
  className?: string;
};

export default function AvatarIlustrado({ nome, foto, size = 44, className }: Props) {
  const clipId = useId();
  if (foto)
    return (
      <img
        src={foto}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );

  const h = hash(nome);
  const [fundo1, fundo2] = escolher(FUNDOS, h);
  const pele = escolher(PELES, h >>> 3);
  const cabelo = escolher(CABELOS, h >>> 6);
  const roupa = escolher(ROUPAS, h >>> 9);
  const estilo = (h >>> 12) % 5; // 0 curto, 1 longo, 2 cacheado, 3 coque, 4 franja lateral
  const gradId = `${clipId}-g`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={fundo1} />
          <stop offset="1" stopColor={fundo2} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="64" height="64" fill={`url(#${gradId})`} />
        {/* cabelo longo fica atrás do rosto */}
        {estilo === 1 && <path d="M16 30c0-12 7-19 16-19s16 7 16 19v20H16z" fill={cabelo} />}
        {/* corpo e pescoço */}
        <path d="M10 64c2-11 11-16 22-16s20 5 22 16z" fill={roupa} />
        <rect x="27" y="38" width="10" height="11" rx="4" fill={pele} />
        {/* rosto */}
        <ellipse cx="32" cy="29" rx="11" ry="12.5" fill={pele} />
        {/* cabelos */}
        {estilo === 0 && (
          <path
            d="M20.5 27c0-9 5-14 11.5-14s11.5 5 11.5 14c-3-5-7-7-11.5-7s-8.5 2-11.5 7z"
            fill={cabelo}
          />
        )}
        {estilo === 1 && (
          <path
            d="M20.5 28c0-9 5-14.5 11.5-14.5S43.5 19 43.5 28c-4-6-8-8-11.5-8s-7.5 2-11.5 8z"
            fill={cabelo}
          />
        )}
        {estilo === 2 && (
          <g fill={cabelo}>
            {[
              [22, 22],
              [27, 17],
              [32, 15.5],
              [37, 17],
              [42, 22],
              [20.5, 27.5],
              [43.5, 27.5],
              [25, 19.5],
              [39, 19.5],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.6" />
            ))}
          </g>
        )}
        {estilo === 3 && (
          <g fill={cabelo}>
            <circle cx="32" cy="12.5" r="5" />
            <path d="M20.5 27c0-9 5-13.5 11.5-13.5S43.5 18 43.5 27c-3.5-4.5-7.5-6.5-11.5-6.5s-8 2-11.5 6.5z" />
          </g>
        )}
        {estilo === 4 && (
          <path
            d="M20.5 28c0-10 5-15 12-15 6 0 11 4.5 11 12-6-1-11-4-14-8-2 5-5 8.5-9 11z"
            fill={cabelo}
          />
        )}
        {/* olhos e sorriso */}
        <circle cx="27.5" cy="30" r="1.3" fill="#17171b" />
        <circle cx="36.5" cy="30" r="1.3" fill="#17171b" />
        <path
          d="M28.5 35.5c2 1.8 5 1.8 7 0"
          stroke="#17171b"
          strokeOpacity="0.55"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
