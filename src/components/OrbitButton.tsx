// Botão com borda orbital: um arco luminoso gira em volta da borda (estilo "Orbit Border Button").
// Espessura, velocidade, tamanho do arco e cores ficam no bloco "Botões orbitais" de src/styles.css.
// Use className para tamanho, posição, texto e padding; faceClassName muda só a cor de fundo da face.
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "primary" | "secondary" | "whatsapp";
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children?: ReactNode;
  icon?: ReactNode;
  /** "end" (padrão): ícone depois do texto, desliza 4px no hover. "start": antes do texto. */
  iconPosition?: "start" | "end";
  /** Botão circular (ex.: WhatsApp flutuante). */
  round?: boolean;
  className?: string;
  faceClassName?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  tabIndex?: number;
  "aria-label"?: string;
  title?: string;
};

export default function OrbitButton({
  variant = "primary",
  href,
  onClick,
  children,
  icon,
  iconPosition = "end",
  round,
  className,
  faceClassName,
  type = "button",
  disabled,
  external,
  tabIndex,
  title,
  "aria-label": ariaLabel,
}: Props) {
  const conteudo = (
    <>
      {/* Brilho: uma cópia do anel, desfocada (o desfoque fica colado à borda) */}
      <span className="orbit-glow" aria-hidden="true">
        <span className="orbit-ring orbit-ring-glow">
          <span className="orbit-spin" />
        </span>
      </span>
      {/* Anel da borda: a máscara mostra só a faixa da espessura */}
      <span className="orbit-ring" aria-hidden="true">
        <span className="orbit-spin" />
      </span>
      {/* Face (fundo) por dentro do anel; o conteúdo fica numa camada própria por cima */}
      <span className={cn("orbit-face", faceClassName)} aria-hidden="true" />
      <span className="orbit-label">
        {icon && iconPosition === "start" && <span className="orbit-icon">{icon}</span>}
        {children}
        {icon && iconPosition === "end" && (
          <span className="orbit-icon orbit-icon-end">{icon}</span>
        )}
      </span>
    </>
  );
  const classes = cn(
    "orbit-surface orbit-btn",
    `orbit-${variant}`,
    round && "orbit-round",
    className,
  );

  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        tabIndex={tabIndex}
        title={title}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {conteudo}
      </a>
    );
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      tabIndex={tabIndex}
      title={title}
      aria-label={ariaLabel}
    >
      {conteudo}
    </button>
  );
}
