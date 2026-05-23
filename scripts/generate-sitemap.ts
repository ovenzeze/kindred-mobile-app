import { write } from "node:fs/promises";
import { join } from "node:path";

type UrlEntry = {
  loc: string;
  changefreq?: string;
  priority?: number;
};

const SITE_URL = "https://kindred.deth.dev";
const PUBLIC_DIR = join(process.cwd(), "public");

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXml(entries: UrlEntry[], lastmod: string): string {
  const urlsXml = entries
    .map((entry) => {
      const loc = escapeXml(`${SITE_URL}${entry.loc}`);
      const changefreq = entry.changefreq
        ? `<changefreq>${escapeXml(entry.changefreq)}</changefreq>`
        : "";
      const priority =
        typeof entry.priority === "number"
          ? `<priority>${entry.priority.toFixed(2)}</priority>`
          : "";

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
        changefreq ? `    ${changefreq}` : "",
        priority ? `    ${priority}` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urlsXml,
    `</urlset>`,
    "",
  ].join("\n");
}

async function main() {
  const lastmod = todayISO();

  const entries: UrlEntry[] = [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/matches", changefreq: "daily", priority: 0.8 },
    { loc: "/profile", changefreq: "daily", priority: 0.8 },
    { loc: "/chat", changefreq: "daily", priority: 0.7 },
    { loc: "/auth/login", changefreq: "monthly", priority: 0.5 },
    { loc: "/auth/register", changefreq: "monthly", priority: 0.5 },
    { loc: "/ui-kit", changefreq: "monthly", priority: 0.2 },
  ];

  const xml = toXml(entries, lastmod);
  const outPath = join(PUBLIC_DIR, "sitemap.xml");
  
  // Use Bun.write if available, else node:fs
  // @ts-ignore
  if (typeof Bun !== 'undefined') {
    // @ts-ignore
    await Bun.write(outPath, xml);
  } else {
    const fs = await import("node:fs/promises");
    await fs.writeFile(outPath, xml);
  }

  console.log(`Generated sitemap: public/sitemap.xml (${entries.length} URLs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
