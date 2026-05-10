import Link from "next/link";

export function Header() {
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
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span
            className="grid h-[22px] w-[22px] place-items-center rounded-full"
            style={{ background: "var(--ink)" }}
            aria-hidden
          >
            <span
              className="block h-[9px] w-[9px] rounded-full"
              style={{ background: "var(--hub-accent)" }}
            />
          </span>
          <span style={{ color: "var(--ink)" }}>thecodebage</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink href="/apps/">Apps</NavLink>
          <NavLink href="/apps/android/">Android</NavLink>
          <NavLink href="/apps/windows/">Windows</NavLink>
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
      className="rounded-full px-3 py-2 transition-colors"
      style={{ color: "var(--ink-muted)" }}
    >
      {children}
    </Link>
  );
}
