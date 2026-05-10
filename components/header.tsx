import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Image
            src="/favicon.png"
            alt="thecodebage"
            width={32}
            height={32}
            className="rounded-full"
            priority
          />
          <span className="text-zinc-900">thecodebage</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/apps/remote-mouse-pro/" className="hover:text-zinc-900 transition-colors">
            Apps
          </Link>
          <Link href="/support/" className="hover:text-zinc-900 transition-colors">
            Support
          </Link>
        </nav>
      </div>
    </header>
  );
}
