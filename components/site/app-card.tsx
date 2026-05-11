import Link from "next/link";
import { AppIcon } from "./app-icon";
import { Stars } from "./stars";
import { appHref, type AppEntry } from "@/lib/apps";

interface AppCardProps {
  app: AppEntry;
  featured?: boolean;
}

export function AppCard({ app, featured = false }: AppCardProps) {
  const isAndroid = app.platform === "android";
  return (
    <Link href={appHref(app)} className={`appcard${featured ? " featured" : ""}`}>
      <div className="appcard-platform">
        <span className="hub-chip hub-chip-platform">
          {isAndroid ? "Android" : "Windows"}
        </span>
      </div>
      <div className="appcard-icon-wrap">
        <span className="appcard-icon-halo" />
        <AppIcon
          title={app.title}
          tint={app.accentTint}
          size={featured ? 72 : 56}
          iconUrl={app.iconUrl}
        />
      </div>
      <div>
        <h3 className="appcard-title">{app.title}</h3>
        <p className="appcard-summary">{app.summary}</p>
      </div>
      <div className="appcard-meta">
        {isAndroid ? (
          <>
            {app.score !== undefined && (
              <span className="appcard-stars">
                <Stars value={app.score} /> <b>{app.score.toFixed(1)}</b>
              </span>
            )}
            {app.installs && <span className="hub-chip">{app.installs}</span>}
            {app.genre && <span className="hub-chip">{app.genre}</span>}
          </>
        ) : (
          <>
            <span className="hub-chip">v{app.version}</span>
            {app.sizeMb !== undefined && (
              <span className="hub-chip">{app.sizeMb} MB</span>
            )}
            {app.updatedDate && <span className="hub-chip">{app.updatedDate}</span>}
          </>
        )}
        {app.paid ? (
          <span className="hub-chip hub-chip-accent">Pro</span>
        ) : (
          <span className="hub-chip">Free</span>
        )}
      </div>
      <div className="appcard-cta">
        <span className="appcard-cta-text">
          {isAndroid ? "Get on Google Play" : "Download for Windows"}
        </span>
        <span className="appcard-cta-meta">
          <span className="appcard-go" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
