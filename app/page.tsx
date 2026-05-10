import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-zinc-200/80">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
              Software utilities for everyday computing
            </Badge>
            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Utilities that respect your time.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
              We build small, focused tools that do one thing well. No analytics, no
              tracking, no upsells. Buy once, own forever — or pay a fair monthly fee
              when it makes sense.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apps/remote-mouse-pro/"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                See Remote Mouse Pro
              </Link>
              <Link
                href="/support/"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apps grid */}
      <section className="bg-zinc-50/50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Apps
              </h2>
              <p className="mt-2 text-zinc-600">
                What we&rsquo;re shipping right now.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/apps/remote-mouse-pro/" className="group">
              <Card className="h-full border-zinc-200 transition-all hover:border-zinc-300 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/favicon.png"
                      alt=""
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                    <div>
                      <CardTitle className="text-xl">Remote Mouse Pro</CardTitle>
                      <CardDescription>Phone → PC remote control</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 leading-relaxed">
                    Turn your phone into a wireless trackpad, keyboard, voice macro pad,
                    OCR scanner, and snippet manager for your Windows PC. Works over
                    your local Wi-Fi — nothing leaves your network.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">Android</Badge>
                    <Badge variant="outline">Windows</Badge>
                    <Badge variant="outline">LAN-only</Badge>
                  </div>
                  <div className="mt-6 inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                    Learn more →
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="h-full border-dashed border-zinc-200 bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl text-zinc-400">More on the way</CardTitle>
                <CardDescription>We ship slow on purpose. Quality over volume.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
