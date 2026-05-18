import Link from "next/link";

export function LifeOSFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        padding: "64px 0 36px",
        marginTop: 96,
        color: "var(--ink-muted)",
      }}
    >
      <div className="mx-auto max-w-[1480px] px-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <Link href="/lifeos/" aria-label="LifeOS — home" className="inline-flex items-center gap-2.5">
              <img src="/lifeos/logo-64.png" alt="" width={28} height={28} className="h-7 w-7" />
              <span
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: 20,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                  fontWeight: 500,
                }}
              >
                LifeOS
              </span>
            </Link>
            <p className="mt-4 max-w-[380px] text-[13px] leading-relaxed">
              Your second brain — fully local. Capture, transcribe, recall.
              Runs entirely on your Windows PC. Made by{" "}
              <a
                href="https://thecodebage.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--ink)] underline underline-offset-2"
                style={{ color: "var(--ink-muted)" }}
              >
                codeBage
              </a>
              .
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/lifeos/#features" className="hover:text-[color:var(--ink)]">
              Features
            </Link>
            <Link href="/lifeos/#pricing" className="hover:text-[color:var(--ink)]">
              Pricing
            </Link>
            <Link href="/lifeos/#download" className="hover:text-[color:var(--ink)]">
              Download
            </Link>
            <Link href="/lifeos/privacy/" className="hover:text-[color:var(--ink)]">
              Privacy
            </Link>
            <Link href="/lifeos/terms/" className="hover:text-[color:var(--ink)]">
              Terms
            </Link>
            <a
              href="https://thecodebage.com/support/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--ink)]"
            >
              Support ↗
            </a>
            <a
              href="https://github.com/malookshah4/LifeOS"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--ink)]"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
        <div
          className="mt-16 flex flex-wrap justify-between gap-6 pt-6"
          style={{
            borderTop: "1px solid var(--line)",
            fontFamily: "var(--font-mono-stack)",
            fontSize: 11,
          }}
        >
          <span>© {new Date().getFullYear()} codeBage · LifeOS</span>
          <span>support@thecodebage.com</span>
        </div>
      </div>
    </footer>
  );
}
