// Faixa de rolagem automática infinita (marquee). Estilos no bloco "Marquee" de src/styles.css.
// O conteúdo é repetido duas vezes para a volta não ter emenda; a cópia fica escondida
// de leitores de tela. Pausa no hover; no toque dá para arrastar; com "reduzir movimento"
// a animação para e a faixa vira uma lista rolável.
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Segundos por volta no computador (no celular fica 40% mais lenta). */
  duration?: number;
  /** Espaço entre os itens, em px. */
  gap?: number;
  /** true = rola da esquerda para a direita. */
  reverse?: boolean;
  className?: string;
  /** Classes de cada grupo de itens (alinhamento vertical etc.). */
  groupClassName?: string;
  "aria-label"?: string;
};

export default function Marquee({
  children,
  duration = 60,
  gap = 20,
  reverse = false,
  className,
  groupClassName,
  "aria-label": ariaLabel,
}: Props) {
  const style = {
    "--marquee-duration": `${duration}s`,
    "--marquee-gap": `${gap}px`,
  } as CSSProperties;

  return (
    <div
      className={cn("marquee", className)}
      data-reverse={reverse}
      style={style}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="marquee-track">
        <div className={cn("marquee-group", groupClassName)}>{children}</div>
        <div className={cn("marquee-group marquee-copy", groupClassName)} aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
