import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "56px 0 32px",
        marginTop: 80,
        color: "var(--ink-muted)",
      }}
    >
      <div className="mx-auto max-w-[1480px] px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link href="/" aria-label="codeBage — home" className="inline-flex items-center">
              <Image
                src="/header.png"
                alt="codeBage"
                width={944}
                height={265}
                className="h-6 w-auto sm:h-7"
              />
            </Link>
            <p className="mt-3 max-w-[360px] text-[13px] leading-relaxed">
              Small utilities for everyday computing. LAN-only by default. Privacy by design.
              Made in spare hours, shipped when ready.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/about/" className="hover:text-[color:var(--ink)]">
              About
            </Link>
            <Link href="/privacy/" className="hover:text-[color:var(--ink)]">
              Privacy
            </Link>
            <Link href="/terms/" className="hover:text-[color:var(--ink)]">
              Terms
            </Link>
            <Link href="/support/" className="hover:text-[color:var(--ink)]">
              Support
            </Link>
            <a
              href="https://github.com/malookshah4"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--ink)]"
            >
              GitHub
            </a>
          </nav>
        </div>
        <div
          className="mt-14 flex flex-wrap justify-between gap-6 pt-6"
          style={{ borderTop: "1px solid var(--line)", fontFamily: "var(--font-mono-stack)", fontSize: 11 }}
        >
          <span>© {new Date().getFullYear()} codeBage</span>
          <span>support@thecodebage.com · dl.thecodebage.com</span>
        </div>
      </div>
    </footer>
  );
}
