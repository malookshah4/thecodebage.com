import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/50">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} thecodebage. All rights reserved.
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
          <Link href="/privacy/" className="hover:text-zinc-900 transition-colors">
            Privacy
          </Link>
          <Link href="/terms/" className="hover:text-zinc-900 transition-colors">
            Terms
          </Link>
          <Link href="/support/" className="hover:text-zinc-900 transition-colors">
            Support
          </Link>
          <a
            href="https://github.com/malookshah4"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
