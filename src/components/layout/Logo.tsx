import Image from "next/image";
import clsx from "clsx";
import logoMark from "../../../public/images/logo.png";

type LogoMarkProps = {
  className?: string;
  title?: string;
  priority?: boolean;
};

/**
 * EcoModern Living brand mark — the eco-home + leaf emblem. Rendered from the
 * brand artwork (white background knocked out to transparency) so it sits on
 * any surface.
 */
export function LogoMark({
  className,
  title = "EcoModern Living",
  priority,
}: LogoMarkProps) {
  return (
    <Image
      src={logoMark}
      alt={title}
      priority={priority}
      sizes="48px"
      className={clsx("h-12 w-12 object-contain", className)}
    />
  );
}

type LogoProps = {
  /** Color theme of the surrounding surface. */
  theme?: "light" | "dark";
  /** Show the "EcoModern Living" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Hide the wordmark below the `sm` breakpoint (used in the header). */
  responsiveWordmark?: boolean;
  className?: string;
  markClassName?: string;
  priority?: boolean;
};

export function Logo({
  theme = "light",
  withWordmark = true,
  responsiveWordmark = false,
  className,
  markClassName,
  priority,
}: LogoProps) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} priority={priority} />
      {withWordmark && (
        <span
          className={clsx(
            "font-display text-[17px] leading-none tracking-tight",
            responsiveWordmark && "hidden sm:inline-block"
          )}
        >
          <span
            className={clsx(
              "font-bold",
              theme === "dark" ? "text-white" : "text-forest-900"
            )}
          >
            EcoModern
          </span>
          <span
            className={clsx(
              "font-light",
              theme === "dark" ? "text-sage-300" : "text-sage-500"
            )}
          >
            {" "}
            Living
          </span>
        </span>
      )}
    </span>
  );
}
