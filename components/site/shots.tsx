import Image from "next/image";
import type { AccentTint } from "@/lib/apps";

interface ShotProps {
  tint: AccentTint;
  title: string;
  screenshotUrl?: string;
}

export function PhoneShot({ tint, title, screenshotUrl }: ShotProps) {
  if (screenshotUrl) {
    return (
      <div
        className={`hub-shot tint-${tint}`}
        style={{
          position: "relative",
          overflow: "hidden",
          aspectRatio: "9 / 19.5",
          background: "#0d0d12",
        }}
      >
        <Image
          src={screenshotUrl}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 1024px) 380px, 80vw"
          style={{ objectFit: "contain" }}
        />
      </div>
    );
  }
  return (
    <div className={`hub-shot tint-${tint}`}>
      <div
        style={{
          height: 28,
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "var(--font-mono-stack)",
          fontSize: 10,
        }}
      >
        9:41
      </div>
      <div
        style={{
          padding: 18,
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, lineHeight: 1.1, opacity: 0.95 }}>
          {title}
        </div>
        <div style={{ fontFamily: "var(--font-mono-stack)", fontSize: 10, opacity: 0.6 }}>
          ● Connected · LAN
        </div>
        <div
          style={{
            flex: 1,
            marginTop: 8,
            background: "rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 14,
          }}
        >
          <div style={{ height: 8, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 4 }} />
          <div style={{ height: 6, width: "40%", background: "rgba(255,255,255,0.25)", borderRadius: 4, marginTop: 10 }} />
          <div style={{ height: 6, width: "80%", background: "rgba(255,255,255,0.20)", borderRadius: 4, marginTop: 8 }} />
          <div
            style={{
              marginTop: 24,
              height: 100,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              color: "rgba(255,255,255,0.7)",
              fontSize: 11,
              fontFamily: "var(--font-mono-stack)",
            }}
          >
            screenshot
          </div>
          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 6,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{ aspectRatio: "1", background: "rgba(255,255,255,0.10)", borderRadius: 8 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopShot({ tint, title }: ShotProps) {
  return (
    <div className={`hub-shot windows tint-${tint}`}>
      <div
        style={{
          height: 26,
          background: "rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          gap: 6,
        }}
      >
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.4)",
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 12,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "var(--font-mono-stack)",
            fontSize: 10,
          }}
        >
          {title} · System Tray
        </span>
      </div>
      <div style={{ padding: 22, color: "white" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 28, opacity: 0.95 }}>{title}</div>
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: 12,
              fontSize: 11,
              fontFamily: "var(--font-mono-stack)",
              opacity: 0.8,
            }}
          >
            <div>● Online</div>
            <div style={{ marginTop: 8 }}>PIN: 408 · 233</div>
            <div style={{ marginTop: 8 }}>2 paired</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 16 }}>
            <div style={{ height: 8, width: "60%", background: "rgba(255,255,255,0.4)", borderRadius: 4 }} />
            <div style={{ marginTop: 10, height: 6, width: "40%", background: "rgba(255,255,255,0.20)", borderRadius: 4 }} />
            <div style={{ marginTop: 24, height: 80, background: "rgba(255,255,255,0.10)", borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
