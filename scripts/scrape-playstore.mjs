#!/usr/bin/env node
/**
 * Scrape all codeBage apps from Google Play Store.
 * Writes data/playstore.json + downloads icons/screenshots to public/apps/<slug>/.
 *
 * Usage:
 *   node scripts/scrape-playstore.mjs
 *   DEV_ID=codeBage node scripts/scrape-playstore.mjs
 */
import gplay from 'google-play-scraper';
import { writeFile, mkdir, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'data/playstore.json');
const ASSET_ROOT = resolve(ROOT, 'public/apps');

const DEV_ID = process.env.DEV_ID || 'codeBage';
const COUNTRY = process.env.COUNTRY || 'us';
const LANG = process.env.LANG || 'en';
const REVIEWS_PER_APP = 12;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function pickExt(url) {
  const clean = url.split('?')[0];
  const e = extname(clean).toLowerCase();
  if (e && e.length <= 5) return e;
  return '.jpg';
}

async function downloadImage(url, destPath) {
  if (!url) return null;
  if (await exists(destPath)) return destPath;
  await mkdir(dirname(destPath), { recursive: true });
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; codeBage-scraper)',
        Accept: 'image/*,*/*;q=0.8',
      },
    });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    await pipeline(res.body, createWriteStream(destPath));
    return destPath;
  } catch (e) {
    console.warn(`    ! image download failed: ${url.slice(0, 80)} — ${e.message}`);
    return null;
  }
}

function toPublicUrl(absPath) {
  if (!absPath) return null;
  const norm = String(absPath).replace(/\\/g, '/');
  const rootNorm = ROOT.replace(/\\/g, '/');
  const rel = norm.toLowerCase().startsWith(rootNorm.toLowerCase())
    ? norm.slice(rootNorm.length)
    : norm;
  return rel.replace(/^\/public/, '');
}

function slugify(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80) || 'app'
  );
}

function extractFeatures(description = '') {
  const lines = description.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const bullets = lines
    .filter((l) => /^[-•★✔✓▶●»➤➜▪◆♦■]/.test(l) || /^\d+[.)]/.test(l))
    .map((l) => l.replace(/^[-•★✔✓▶●»➤➜▪◆♦■\d+.)\s]+/, '').trim())
    .filter((l) => l.length > 6 && l.length < 160);
  return bullets.slice(0, 8);
}

function shortSummary(app) {
  return (
    app.summary ||
    (app.description || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 20) ||
    ''
  ).slice(0, 160);
}

async function main() {
  console.log(`[scrape] Fetching apps for developer: ${DEV_ID}`);
  const summaries = await gplay.developer({
    devId: DEV_ID,
    lang: LANG,
    country: COUNTRY,
    num: 120,
  });
  console.log(`[scrape] Found ${summaries.length} apps`);

  const usedSlugs = new Set();
  const results = [];

  for (const s of summaries) {
    try {
      const app = await gplay.app({ appId: s.appId, lang: LANG, country: COUNTRY });

      let reviews = [];
      try {
        const r = await gplay.reviews({
          appId: s.appId,
          lang: LANG,
          country: COUNTRY,
          sort: gplay.sort.NEWEST,
          num: REVIEWS_PER_APP,
        });
        reviews = (r?.data || r || []).slice(0, REVIEWS_PER_APP).map((rv) => ({
          id: rv.id,
          userName: rv.userName,
          userImage: rv.userImage,
          date: rv.date,
          score: rv.score,
          text: rv.text,
        }));
      } catch (e) {
        console.warn(`[scrape] reviews failed for ${s.appId}: ${e.message}`);
      }

      let slug = slugify(app.title || s.appId);
      if (usedSlugs.has(slug)) slug = `${slug}-${slugify(s.appId.split('.').pop())}`;
      usedSlugs.add(slug);

      const assetDir = resolve(ASSET_ROOT, slug);
      const iconLocal = await downloadImage(
        app.icon,
        resolve(assetDir, `icon${pickExt(app.icon || '')}`)
      );
      const headerLocal = app.headerImage
        ? await downloadImage(
            app.headerImage,
            resolve(assetDir, `header${pickExt(app.headerImage)}`)
          )
        : null;

      const screenshotUrls = app.screenshots || [];
      const screenshotLocals = [];
      for (let i = 0; i < Math.min(screenshotUrls.length, 12); i++) {
        const ext = pickExt(screenshotUrls[i]);
        const local = await downloadImage(
          screenshotUrls[i],
          resolve(assetDir, `screenshot-${i + 1}${ext}`)
        );
        if (local) screenshotLocals.push(toPublicUrl(local));
      }

      results.push({
        appId: app.appId,
        slug,
        title: app.title,
        summary: shortSummary(app),
        description: app.description,
        descriptionHTML: app.descriptionHTML,
        icon: toPublicUrl(iconLocal) || app.icon,
        iconRemote: app.icon,
        headerImage: toPublicUrl(headerLocal) || app.headerImage || null,
        screenshots: screenshotLocals.length ? screenshotLocals : app.screenshots || [],
        video: app.video || null,
        score: Number((app.score || 0).toFixed(2)),
        scoreText: app.scoreText,
        ratings: app.ratings || 0,
        reviews: app.reviews || 0,
        installs: app.installs || '—',
        minInstalls: app.minInstalls || 0,
        maxInstalls: app.maxInstalls || 0,
        price: app.price || 0,
        free: app.free !== false,
        currency: app.currency || 'USD',
        genre: app.genre || '',
        genreId: app.genreId || '',
        contentRating: app.contentRating || '',
        released: app.released || '',
        updated: app.updated || 0,
        updatedDate: app.updated
          ? new Date(app.updated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '',
        version: app.version || '',
        recentChanges: app.recentChanges || '',
        url: app.url,
        developer: app.developer,
        developerId: app.developerId,
        developerWebsite: app.developerWebsite,
        developerEmail: app.developerEmail,
        privacyPolicy: app.privacyPolicy,
        androidVersion: app.androidVersion,
        features: extractFeatures(app.description),
        recentReviews: reviews,
      });
      console.log(`  ✓ ${app.title}`);
    } catch (e) {
      console.warn(`  ✗ ${s.appId}: ${e.message}`);
    }
  }

  results.sort((a, b) => (b.minInstalls || 0) - (a.minInstalls || 0));

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[scrape] Wrote ${results.length} apps → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
