// Botão com borda orbital (arco luminoso girando). Ajuste espessura, velocidade,
// tamanho do arco e cores no bloco "Botões orbitais" de src/styles.css.
import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "primary" | "secondary" | "whatsapp";
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  children?: ReactNode;
  icon?: ReactNode;
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
  className,
  faceClassName,
  type = "button",
  disabled,
  external,
  tabIndex,
  title,
  ...rest
}: Props) {
  const inner = (
    <>
      <span className="orbit-ring" aria-hidden="true">
        <span className="orbit-spin orbit-spin-glow" />
        <span className="orbit-spin orbit-spin-sharp" />
      </span>
      <span className={cn("orbit-face", faceClassName)}>
        {children}
        {icon && <span className="orbit-icon">{icon}</span>}
      </span>
    </>
  );
  const cls = cn("orbit-btn", `orbit-${variant}`, className);
  if (href)
    return (
      <a
        href={href}
        onClick={onClick}
        className={cls}
        tabIndex={tabIndex}
        title={title}
        aria-label={rest["aria-label"]}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      tabIndex={tabIndex}
      title={title}
      aria-label={rest["aria-label"]}
    >
      {inner}
    </button>
  );
}
