"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/lifeos")) return null;

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backdropFilter: "saturate(140%) blur(14px)",
        WebkitBackdropFilter: "saturate(140%) blur(14px)",
        background: "color-mix(in oklab, var(--paper) 78%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 md:px-8">
        <Link href="/" aria-label="codeBage — home" className="flex shrink-0 items-center">
          <Image
            src="/header.png"
            alt="codeBage"
            width={944}
            height={265}
            priority
            className="h-5 w-auto sm:h-6 md:h-8"
          />
        </Link>
        <nav className="flex items-center gap-0.5 text-[13px] sm:gap-1 sm:text-sm">
          <NavLink href="/apps/android/">Android</NavLink>
          <NavLink href="/apps/windows/">Windows</NavLink>
          <NavLink href="/about/">About</NavLink>
          <NavLink href="/support/">Support</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-2 py-2 transition-colors sm:px-3"
      style={{ color: "var(--ink-muted)" }}
    >
      {children}
    </Link>
  );
}
