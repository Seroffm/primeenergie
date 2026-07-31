import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const databaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!databaseUrl || !serviceRoleKey) {
  throw new Error("VITE_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY werden benötigt.");
}

const sql = await readFile(
  new URL("../supabase/migrations/008_rebrand_blog_articles.sql", import.meta.url),
  "utf8",
);

const unescapeSql = (value) => value.replaceAll("''", "'");
const readString = (block, field) => {
  const match = block.match(new RegExp(`${field} = '((?:''|[^'])*)'`));
  if (!match) throw new Error(`Feld ${field} fehlt in einem Updateblock.`);
  return unescapeSql(match[1]);
};

const updates = sql
  .split("update public.blog_articles")
  .slice(1)
  .map((block) => {
    const bodySource = block.match(/body = jsonb_build_array\(([\s\S]*?)\n  \),\n  seo_title/)?.[1];
    if (!bodySource) throw new Error("Artikelinhalt konnte nicht gelesen werden.");

    const body = [
      ...bodySource.matchAll(
        /jsonb_build_object\(\s*'heading',\s*'((?:''|[^'])*)',\s*'paragraphs',\s*jsonb_build_array\(\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)'\s*\)\s*\)/g,
      ),
    ].map((match) => ({
      heading: unescapeSql(match[1]),
      paragraphs: [unescapeSql(match[2]), unescapeSql(match[3])],
    }));

    if (body.length !== 3) {
      throw new Error(`Erwartet wurden drei Abschnitte, gefunden wurden ${body.length}.`);
    }

    const slug = block.match(/where slug = '([^']+)';/)?.[1];
    const readTime = Number(block.match(/read_time_min = (\d+)/)?.[1]);
    if (!slug || !Number.isInteger(readTime)) {
      throw new Error("Slug oder Lesezeit fehlt in einem Updateblock.");
    }

    return {
      slug,
      values: {
        title: readString(block, "title"),
        teaser: readString(block, "teaser"),
        author: readString(block, "author"),
        read_time_min: readTime,
        body,
        seo_title: readString(block, "seo_title"),
        seo_description: readString(block, "seo_description"),
      },
    };
  });

if (updates.length !== 13) {
  throw new Error(`Erwartet wurden 13 Artikel, gefunden wurden ${updates.length}.`);
}

const supabase = createClient(databaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

for (const update of updates) {
  const { data, error } = await supabase
    .from("blog_articles")
    .update(update.values)
    .eq("slug", update.slug)
    .select("slug")
    .single();

  if (error) throw new Error(`${update.slug}: ${error.message}`);
  if (data.slug !== update.slug) throw new Error(`${update.slug}: unerwartete Antwort.`);
}

console.log(`${updates.length} Artikel wurden auf PRIME ENERGIE umgestellt.`);
