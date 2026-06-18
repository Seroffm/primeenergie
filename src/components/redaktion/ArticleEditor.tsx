import { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogArticle, BlogArticleSection } from "@/lib/api-types";

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function calcReadTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

function getBodyText(sections: BlogArticleSection[]): string {
  return sections
    .map((s) => s.heading + " " + s.paragraphs.join(" "))
    .join(" ");
}

// Stoppwörter für Keyword-Dichte
const STOP_WORDS = new Set([
  "der", "die", "das", "und", "in", "von", "zu", "den", "mit", "sich",
  "des", "auf", "für", "ist", "im", "dem", "nicht", "ein", "eine", "als",
  "auch", "es", "an", "werden", "aus", "er", "hat", "dass", "sie", "nach",
  "wird", "bei", "einer", "um", "am", "sind", "noch", "wie", "einem", "über",
  "einen", "so", "zum", "war", "haben", "nur", "oder", "aber", "vor", "zur",
  "bis", "mehr", "durch", "man", "sein", "wurde", "sei", "in", "können",
  "wenn", "je", "ihr", "wie", "wir", "pro", "per", "ab", "ich", "du", "wer",
  "was", "wo", "kann", "wird", "alle", "schon", "ohne", "dabei", "sehr",
]);

function detectKeyword(title: string): string {
  const words = title.toLowerCase().split(/\s+/);
  const candidates = words.filter(
    (w) => w.length > 3 && !STOP_WORDS.has(w) && /^[a-zäöüß]+$/.test(w),
  );
  if (candidates.length === 0) return "";
  // Häufigstes Wort (heuristisch: letztes signifikantes Wort im Titel)
  return candidates[0];
}

function calcKeywordDensity(
  keyword: string,
  fullText: string,
): { density: number; count: number } {
  if (!keyword) return { density: 0, count: 0 };
  const words = fullText.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
  const count = words.filter((w) => w.includes(keyword.toLowerCase())).length;
  const density = words.length > 0 ? (count / words.length) * 100 : 0;
  return { density, count };
}

// ---------------------------------------------------------------------------
// SEO-Audit-Types
// ---------------------------------------------------------------------------

type TrafficLight = "green" | "yellow" | "red";

interface SeoCheck {
  label: string;
  status: TrafficLight;
  detail: string;
}

function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ---------------------------------------------------------------------------
// SEO Panel
// ---------------------------------------------------------------------------

function SeoStatusDot({ status }: { status: TrafficLight }) {
  const colors: Record<TrafficLight, string> = {
    green: "bg-emerald-500",
    yellow: "bg-amber-400",
    red: "bg-rose-500",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 flex-none rounded-full ${colors[status]}`}
      aria-hidden
    />
  );
}

interface SeoAuditPanelProps {
  title: string;
  teaser: string;
  slug: string;
  sections: BlogArticleSection[];
  image: string;
}

function SeoAuditPanel({ title, teaser, slug, sections, image }: SeoAuditPanelProps) {
  const dTitle = useDebounced(title, 500);
  const dTeaser = useDebounced(teaser, 500);
  const dSlug = useDebounced(slug, 500);
  const dSections = useDebounced(sections, 500);
  const dImage = useDebounced(image, 500);

  const fullText = dTitle + " " + getBodyText(dSections);
  const wordCount = countWords(fullText);
  const keyword = detectKeyword(dTitle);
  const { density, count: kwCount } = calcKeywordDensity(keyword, fullText);

  const checks: SeoCheck[] = [];

  // 1. Titel-Länge
  const tl = dTitle.length;
  let titleStatus: TrafficLight = "red";
  if (tl >= 50 && tl <= 60) titleStatus = "green";
  else if ((tl >= 40 && tl < 50) || (tl > 60 && tl <= 70)) titleStatus = "yellow";
  checks.push({
    label: "Titel-Länge",
    status: titleStatus,
    detail: `${tl}/60 Zeichen`,
  });

  // 2. Teaser / Meta-Description
  const ml = dTeaser.length;
  let metaStatus: TrafficLight = "red";
  if (ml >= 120 && ml <= 160) metaStatus = "green";
  else if ((ml >= 80 && ml < 120) || (ml > 160 && ml <= 180)) metaStatus = "yellow";
  checks.push({
    label: "Meta-Description",
    status: metaStatus,
    detail: `${ml}/160 Zeichen`,
  });

  // 3. Slug-Format
  const slugOk = /^[a-z0-9-]{3,}$/.test(dSlug);
  checks.push({
    label: "Slug-Format",
    status: slugOk ? "green" : "red",
    detail: dSlug || "—",
  });

  // 4. Wortanzahl
  let wordStatus: TrafficLight = "red";
  if (wordCount >= 600) wordStatus = "green";
  else if (wordCount >= 300) wordStatus = "yellow";
  checks.push({
    label: "Wortanzahl",
    status: wordStatus,
    detail: `${wordCount} Wörter`,
  });

  // 5. Abschnitte
  const sectionCount = dSections.filter((s) => s.heading.trim()).length;
  let sectionStatus: TrafficLight = "red";
  if (sectionCount >= 3) sectionStatus = "green";
  else if (sectionCount >= 1) sectionStatus = "yellow";
  checks.push({
    label: "Abschnitte",
    status: sectionStatus,
    detail: `${sectionCount} Abschnitte mit Überschrift`,
  });

  // 6. Bild-URL
  const imageOk = dImage.startsWith("https://");
  checks.push({
    label: "Bild-URL",
    status: imageOk ? "green" : "red",
    detail: imageOk ? "URL vorhanden" : "Fehlt oder ungültig",
  });

  // 7. Keyword-Dichte
  let kwStatus: TrafficLight = "red";
  if (density >= 1 && density <= 3) kwStatus = "green";
  else if ((density >= 0.5 && density < 1) || (density > 3 && density <= 5)) kwStatus = "yellow";
  checks.push({
    label: "Keyword-Dichte",
    status: kwStatus,
    detail: keyword
      ? `"${keyword}": ${density.toFixed(1)}% (${kwCount}×)`
      : "Kein Keyword erkannt",
  });

  // Score berechnen
  const scorePoints = checks.reduce((acc, c) => {
    if (c.status === "green") return acc + 1;
    if (c.status === "yellow") return acc + 0.5;
    return acc;
  }, 0);
  const score = Math.round((scorePoints / checks.length) * 100);

  let scoreLabel = "Schwach";
  let scoreColor = "text-rose-600";
  let ringColor = "stroke-rose-500";
  if (score >= 80) {
    scoreLabel = "Sehr gut";
    scoreColor = "text-emerald-600";
    ringColor = "stroke-emerald-500";
  } else if (score >= 60) {
    scoreLabel = "Gut";
    scoreColor = "text-lime-600";
    ringColor = "stroke-lime-500";
  } else if (score >= 40) {
    scoreLabel = "Verbesserungswürdig";
    scoreColor = "text-amber-600";
    ringColor = "stroke-amber-500";
  }

  const circumference = 2 * Math.PI * 22;
  const dash = (score / 100) * circumference;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">SEO-Analyse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score-Ring */}
        <div className="flex flex-col items-center gap-1">
          <svg width="64" height="64" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted"
            />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              strokeWidth="4"
              className={ringColor}
              strokeDasharray={`${dash} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </svg>
          <div className={`text-2xl font-bold ${scoreColor}`}>{score}</div>
          <div className={`text-xs font-medium ${scoreColor}`}>{scoreLabel}</div>
        </div>

        {/* Checks */}
        <div className="space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="flex items-start gap-2">
              <SeoStatusDot status={c.status} />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// ArticleEditor
// ---------------------------------------------------------------------------

interface ArticleEditorProps {
  initial?: Partial<BlogArticle>;
  onSave: (data: Partial<BlogArticle>) => Promise<void>;
  isSaving?: boolean;
}

export function ArticleEditor({ initial, onSave, isSaving = false }: ArticleEditorProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "Strom");
  const [teaser, setTeaser] = useState(initial?.teaser ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "EnergieClever Redaktion");
  const [readTimeMin, setReadTimeMin] = useState(initial?.read_time_min ?? 5);
  const [seoTitle, setSeoTitle] = useState(initial?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seo_description ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);
  const [sections, setSections] = useState<BlogArticleSection[]>(
    initial?.body?.length ? initial.body : [{ heading: "", paragraphs: [""] }],
  );
  const [slugManual, setSlugManual] = useState(!!initial?.slug);

  // Auto-Slug aus Titel
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  // Auto-Lesezeit
  const updateReadTime = useCallback(() => {
    const text = getBodyText(sections);
    const wc = countWords(text);
    setReadTimeMin(calcReadTime(wc));
  }, [sections]);

  useEffect(() => {
    updateReadTime();
  }, [sections, updateReadTime]);

  // Abschnitte bearbeiten
  function updateSection(idx: number, field: keyof BlogArticleSection, value: string) {
    setSections((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        if (field === "heading") return { ...s, heading: value };
        // paragraphs: Split per Leerzeile
        return { ...s, paragraphs: value.split("\n\n").filter((p) => p.trim().length > 0) || [""] };
      }),
    );
  }

  function getSectionParagraphsText(section: BlogArticleSection): string {
    return section.paragraphs.join("\n\n");
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", paragraphs: [""] }]);
  }

  function removeSection(idx: number) {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveSection(idx: number, dir: "up" | "down") {
    setSections((prev) => {
      const next = [...prev];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function handleSave() {
    await onSave({
      slug,
      title,
      teaser,
      tag,
      image,
      author,
      body: sections,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      read_time_min: readTimeMin,
      is_published: isPublished,
    });
  }

  const imageIsValid = image.startsWith("https://");

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Linke Seite: Formular (60%) */}
      <div className="space-y-6 lg:col-span-3">
        {/* Basis-Felder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Artikel-Inhalt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="article-title">Titel</Label>
              <Input
                id="article-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Strompreis 2026: Was Haushalte jetzt wissen müssen"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-slug">Slug</Label>
              <Input
                id="article-slug"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                placeholder="strompreis-2026"
              />
              <p className="text-xs text-muted-foreground">
                URL: energieclever.de/wissen/<span className="font-mono">{slug || "…"}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-tag">Kategorie</Label>
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger id="article-tag">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Strom">Strom</SelectItem>
                  <SelectItem value="Gas">Gas</SelectItem>
                  <SelectItem value="Solar">Solar</SelectItem>
                  <SelectItem value="Strom & Gas">Strom & Gas</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Wissen">Wissen</SelectItem>
                  <SelectItem value="Allgemein">Allgemein</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-teaser">Teaser / Meta-Description</Label>
              <Textarea
                id="article-teaser"
                value={teaser}
                onChange={(e) => setTeaser(e.target.value)}
                rows={3}
                placeholder="2-3 prägnante Sätze, die den Artikel zusammenfassen (120-160 Zeichen ideal)."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="article-image">Bild-URL</Label>
              <Input
                id="article-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/…"
              />
              {imageIsValid && (
                <div className="mt-2 overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt="Vorschau"
                    className="h-32 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="article-author">Autor</Label>
                <Input
                  id="article-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="EnergieClever Redaktion"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="article-readtime">Lesezeit (min)</Label>
                <Input
                  id="article-readtime"
                  type="number"
                  min={1}
                  max={60}
                  value={readTimeMin}
                  onChange={(e) => setReadTimeMin(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO-Felder (optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SEO-Overrides (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="article-seo-title">SEO-Titel (überschreibt Artikel-Titel)</Label>
              <Input
                id="article-seo-title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Leer = Artikel-Titel wird verwendet"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="article-seo-desc">SEO-Description (überschreibt Teaser)</Label>
              <Textarea
                id="article-seo-desc"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                placeholder={teaser || "Leer = Teaser wird verwendet"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Abschnitte-Editor */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Inhalt</CardTitle>
            <Button variant="outline" size="sm" onClick={addSection} type="button">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Abschnitt
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-muted/20 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Abschnitt {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      type="button"
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      type="button"
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sections.length - 1}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-rose-500 hover:text-rose-600"
                      type="button"
                      onClick={() => removeSection(idx)}
                      disabled={sections.length === 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Überschrift des Abschnitts</Label>
                  <Input
                    value={section.heading}
                    onChange={(e) => updateSection(idx, "heading", e.target.value)}
                    placeholder="Die wichtigsten Trends 2026"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    Absätze{" "}
                    <span className="text-xs text-muted-foreground">
                      (je Absatz eine Leerzeile)
                    </span>
                  </Label>
                  <Textarea
                    value={getSectionParagraphsText(section)}
                    onChange={(e) => updateSection(idx, "paragraphs", e.target.value)}
                    rows={5}
                    placeholder={"Erster Absatz.\n\nZweiter Absatz."}
                  />
                </div>
              </div>
            ))}
            {sections.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Noch keine Abschnitte. Füge einen hinzu.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aktionen */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="publish-toggle"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="publish-toggle" className="cursor-pointer">
                {isPublished ? "Veröffentlichen" : "Als Entwurf speichern"}
              </Label>
            </div>
            <div className="flex gap-2">
              {slug && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => window.open(`/wissen/${slug}`, "_blank")}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Vorschau
                </Button>
              )}
              <Button
                size="sm"
                type="button"
                onClick={handleSave}
                disabled={isSaving || !title || !slug || !teaser}
              >
                {isSaving ? "Speichern…" : "Speichern"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rechte Seite: SEO-Panel (40%) */}
      <div className="lg:col-span-2">
        <SeoAuditPanel
          title={title}
          teaser={teaser}
          slug={slug}
          sections={sections}
          image={image}
        />
      </div>
    </div>
  );
}
