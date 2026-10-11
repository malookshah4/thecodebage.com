import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header
      data-codebage-chrome
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
          <NavLink href="/apps/android/">
            <span className="sm:hidden">Apps</span>
            <span className="hidden sm:inline">Mobile apps</span>
          </NavLink>
          <NavLink href="/apps/windows/">Windows</NavLink>
          <NavLink href="/tools/">Tools</NavLink>
          <NavLink href="/blog/">Blog</NavLink>
          <NavLink href="/about/" className="hidden sm:inline-block">
            About
          </NavLink>
          <NavLink href="/support/" className="hidden sm:inline-block">
            Support
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-2 py-2 transition-colors sm:px-3 ${className}`}
      style={{ color: "var(--ink-muted)" }}
    >
      {children}
    </Link>
  );
}
