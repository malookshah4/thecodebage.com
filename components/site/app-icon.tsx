import type { AccentTint } from "@/lib/apps";

interface AppIconProps {
  title: string;
  tint: AccentTint;
  size?: number;
  className?: string;
}

function initials(title: string): string {
  return title
    .split(/[\s.·]+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppIcon({ title, tint, size = 64, className }: AppIconProps) {
  const fontSize = Math.round(size * 0.42);
  const radius = Math.round(size * 0.28);
  return (
    <div
      className={`appcard-icon tint-${tint}${className ? ` ${className}` : ""}`}
      style={{ width: size, height: size, fontSize, borderRadius: radius }}
    >
      <span style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
        {initials(title)}
      </span>
    </div>
  );
}
