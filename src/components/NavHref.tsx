import Link from "next/link";
import type { ReactNode } from "react";

type NavHrefProps = {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function NavHref({
  href,
  external,
  className,
  children,
  onClick,
}: NavHrefProps) {
  const isExternal = external ?? href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
