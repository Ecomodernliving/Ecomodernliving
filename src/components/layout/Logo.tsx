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
      className={clsx("object-contain", className ?? "h-12 w-12")}
    />
  );
}

type LogoProps = {
  /** Color theme of the surrounding surface. */
  theme?: "light" | "dark";
  /** Show the "EcoModern Living" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Hide the wordmark between `lg` and `xl` so the desktop nav has room (still shown on mobile). */
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
    <span className={clsx("inline-flex shrink-0 items-center gap-1.5 sm:gap-2", className)}>
      <LogoMark
        className={clsx("h-10 w-10 shrink-0 sm:h-11 sm:w-11", markClassName)}
        priority={priority}
      />
      {withWordmark && (
        <span
          className={clsx(
            "font-display text-[15px] leading-none tracking-tight whitespace-nowrap sm:text-[16px]",
            // Mobile (<lg): show name. Mid desktop (lg–xl): icon only. Wide (xl+): full name.
            responsiveWordmark && "max-lg:inline-block hidden xl:inline-block"
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
