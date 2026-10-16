// Borda orbital para cards e blocos: o mesmo arco luminoso dos botões (OrbitButton),
// girando em volta de qualquer conteúdo. O arco cresce quando o mouse passa sobre o bloco.
// CSS no bloco "Botões e bordas orbitais" de src/styles.css (camadas compartilhadas).
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Raio dos cantos em px (padrão 24). */
  radius?: number;
  /** Espessura da borda em px (padrão 2). */
  thickness?: number;
  /** Cor principal do arco (padrão #0A8CFF). */
  color?: string;
  /** Cor da ponta do arco (padrão #9ADBFF). */
  tipColor?: string;
  /** Segundos por volta (padrão 7). */
  speed?: number;
  /** Sem brilho desfocado: só o arco nítido (versão discreta). */
  subtle?: boolean;
  className?: string;
  /** Classes do conteúdo interno (fundo, padding, layout). */
  contentClassName?: string;
};

export default function OrbitBorder({
  children,
  radius = 24,
  thickness = 2,
  color = "#0a8cff",
  tipColor = "#9adbff",
  speed = 7,
  subtle = false,
  className,
  contentClassName,
}: Props) {
  const style = {
    borderRadius: radius,
    "--orbit-radius": `${radius}px`,
    "--orbit-thickness": `${thickness}px`,
    "--orbit-c1": color,
    "--orbit-c2": tipColor,
    "--orbit-speed": `${speed}s`,
  } as CSSProperties;

  return (
    <div
      className={cn("orbit-surface orbit-border", subtle && "orbit-subtle", className)}
      style={style}
    >
      {!subtle && (
        <span className="orbit-glow" aria-hidden="true">
          <span className="orbit-ring orbit-ring-glow">
            <span className="orbit-spin" />
          </span>
        </span>
      )}
      <span className="orbit-ring" aria-hidden="true">
        <span className="orbit-spin" />
      </span>
      <div className={cn("orbit-border-content", contentClassName)}>{children}</div>
    </div>
  );
}
