import Link from "next/link";

const LIFEOS = "https://lifeos.thecodebage.com";

export function LifeOSHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backdropFilter: "saturate(160%) blur(16px)",
        WebkitBackdropFilter: "saturate(160%) blur(16px)",
        background: "color-mix(in oklab, #08090C 72%, transparent)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 md:px-8">
        <Link
          href={`${LIFEOS}/`}
          aria-label="LifeOS — home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <img src="/lifeos/logo-64.png" alt="" width={28} height={28} className="h-7 w-7" />
          <span
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: 19,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              fontWeight: 500,
            }}
          >
            LifeOS
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-[13px] sm:gap-1 sm:text-sm">
          <NavLink href={`${LIFEOS}/#features`}>Features</NavLink>
          <NavLink href={`${LIFEOS}/#pricing`}>Pricing</NavLink>
          <NavLink href={`${LIFEOS}/#download`}>Download</NavLink>
          <NavLink href="https://thecodebage.com" external>
            codeBage ↗
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "rounded-full px-2 py-2 transition-colors sm:px-3 hover:text-[color:var(--ink)]";
  const style = { color: "var(--ink-muted)" };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}
