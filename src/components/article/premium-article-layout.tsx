import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";
import {
  ArticleReveal,
  ArticleToc,
  FaqAccordion,
  ScrollProgressBar,
  type FaqItem,
  type TocItem,
} from "./article-interactions";

export const ARTICLE_TOKENS = {
  accent: "#0f766e",
  card: "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm",
  softShadow: "shadow-[0_14px_40px_-28px_rgba(2,44,34,0.35)]",
  ring: "ring-1 ring-emerald-200/70 dark:ring-emerald-900/35",
} as const;

export type ArticleAuthor = {
  name: string;
  role: string;
  avatarUrl?: string;
};

export type ArticleLink = {
  href: string;
  label: string;
  description?: string;
};

export type RelatedArticle = {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image?: string;
};

export type TrustStat = {
  label: string;
  value: string;
};

export type PremiumArticleData = {
  baseUrl: string;
  canonicalPath: string;
  title: string;
  subtitle: string;
  category: string;
  author: ArticleAuthor;
  publishedAtISO: string;
  publishedAtLabel: string;
  updatedAtISO?: string;
  readingTimeMinutes: number;
  coverImageUrl: string;
  coverAlt?: string;
  toc: TocItem[];
  faq: FaqItem[];
  internalLinks: ArticleLink[];
  related: RelatedArticle[];
  trustStats: TrustStat[];
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "ه";
  const b = parts[1]?.[0] ?? "";
  return `${a}${b}`;
}

export function PremiumComparisonTable({
  rows,
}: {
  rows: { label: string; a: string; b: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">مولفه</TableHead>
            <TableHead className="text-right">آزمون رسمی</TableHead>
            <TableHead className="text-right">شبیه‌سازی در hefztest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell className="font-medium">{r.label}</TableCell>
              <TableCell>{r.a}</TableCell>
              <TableCell>{r.b}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "success" | "warning" | "important";
  title: string;
  children: React.ReactNode;
}) {
  const styles =
    variant === "success"
      ? "border-emerald-200/70 bg-emerald-50/60 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-100"
      : variant === "warning"
      ? "border-amber-200/70 bg-amber-50/70 text-amber-950 dark:border-amber-900/40 dark:bg-amber-900/15 dark:text-amber-100"
      : variant === "important"
      ? "border-rose-200/70 bg-rose-50/70 text-rose-950 dark:border-rose-900/40 dark:bg-rose-900/15 dark:text-rose-100"
      : "border-slate-200/80 bg-slate-50/70 text-slate-950 dark:border-slate-800 dark:bg-white/5 dark:text-slate-100";

  return (
    <aside className={cn("rounded-2xl border p-5 shadow-sm", styles)}>
      <div className="font-bold mb-2">{title}</div>
      <div className="leading-8 opacity-90">{children}</div>
    </aside>
  );
}

export function TrustBar({ stats }: { stats: TrustStat[] }) {
  return (
    <div className={cn(ARTICLE_TOKENS.card, ARTICLE_TOKENS.softShadow, "p-4 md:p-5")}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800 p-4">
            <div className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">{s.value}</div>
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedArticles({ items }: { items: RelatedArticle[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          className={cn(
            "group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm p-5 transition-transform hover:-translate-y-0.5"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/35 dark:text-emerald-300 px-3 py-1 text-xs">
                  {a.category}
                </span>
                <span className="text-xs text-slate-500">{a.date}</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white leading-7 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors truncate">
                {a.title}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-7 line-clamp-2">
                {a.excerpt}
              </div>
            </div>
            {a.image ? (
              <div className="hidden sm:block h-16 w-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/10 overflow-hidden shrink-0">
                <Image src={a.image} alt="" width={64} height={64} className="h-16 w-16 object-contain p-3 opacity-85" unoptimized />
              </div>
            ) : null}
          </div>
          <div className="mt-4 inline-flex items-center text-xs text-emerald-700 dark:text-emerald-300">
            مطالعه مقاله
            <span className="mr-1 transition-transform group-hover:-translate-x-0.5">←</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PremiumArticleLayout({
  data,
  breadcrumbs,
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  children,
}: {
  data: PremiumArticleData;
  breadcrumbs: { name: string; href: string }[];
  articleJsonLd: unknown;
  faqJsonLd: unknown;
  breadcrumbJsonLd: unknown;
  children: React.ReactNode;
}) {
  return (
    <main dir="rtl" className="scroll-smooth">
      <ScrollProgressBar />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="relative">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl dark:bg-emerald-900/20" />
        <div className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-800/10" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-14">
        <nav aria-label="breadcrumb" className="text-sm text-slate-600 dark:text-slate-300">
          <ol className="flex items-center gap-2 flex-wrap">
            {breadcrumbs.map((b, idx) => (
              <li key={b.href} className="flex items-center gap-2">
                {idx > 0 ? <span className="opacity-60">/</span> : null}
                <Link
                  href={b.href}
                  className={cn(
                    "relative py-1 transition-colors",
                    idx === breadcrumbs.length - 1
                      ? "text-emerald-800 dark:text-emerald-300 font-medium"
                      : "hover:text-emerald-800 dark:hover:text-emerald-300"
                  )}
                >
                  {b.name}
                  {idx !== breadcrumbs.length - 1 ? (
                    <span className="absolute bottom-0 right-0 h-px w-0 bg-emerald-600 transition-[width] duration-300 group-hover:w-full" />
                  ) : null}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <ArticleReveal className="mt-6">
          <header className={cn("relative overflow-hidden", ARTICLE_TOKENS.card, ARTICLE_TOKENS.softShadow, ARTICLE_TOKENS.ring, "p-7 md:p-10")}>
            <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-emerald-300/35 blur-3xl dark:bg-emerald-800/15" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-700/15" />

            <div className="relative mx-auto max-w-3xl text-center space-y-4">
              <div className="flex justify-center">
                <Badge className="rounded-full bg-emerald-700 hover:bg-emerald-700 text-white px-4 py-1 shadow-sm">
                  {data.category}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.55] text-slate-900 dark:text-white">
                {data.title}
              </h1>
              <p className="text-base md:text-lg leading-8 text-slate-700 dark:text-slate-300">
                {data.subtitle}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-emerald-200/70 dark:ring-emerald-900/40">
                    {data.author.avatarUrl ? <AvatarImage src={data.author.avatarUrl} alt={data.author.name} /> : null}
                    <AvatarFallback className="bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100">
                      {initials(data.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900 dark:text-white">{data.author.name}</div>
                    <div className="text-xs">{data.author.role}</div>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                  <span>تاریخ انتشار: {data.publishedAtLabel}</span>
                  <span className="opacity-60">•</span>
                  <span>زمان مطالعه: {data.readingTimeMinutes} دقیقه</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5 shadow-sm overflow-hidden">
                  <Image
                    src={data.coverImageUrl}
                    alt={data.coverAlt ?? data.title}
                    width={760}
                    height={420}
                    className="h-auto w-full object-contain bg-white/60 dark:bg-white/5"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </header>
        </ArticleReveal>

        <div className="mt-8">
          <TrustBar stats={data.trustStats} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <ArticleToc toc={data.toc} className="mb-6 lg:hidden" />

            <div className="mx-auto max-w-3xl space-y-10">
              {children}

              <ArticleReveal>
                <section id="faq" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8")}>
                  <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
                    سوالات متداول
                  </h2>
                  <p className="mt-2 leading-8 text-slate-700 dark:text-slate-300">
                    پاسخ‌های کوتاه و دقیق به پرتکرارترین پرسش‌ها درباره این موضوع.
                  </p>
                  <FaqAccordion items={data.faq} className="mt-6" />
                </section>
              </ArticleReveal>

              <ArticleReveal>
                <section id="internal-links" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8")}>
                  <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
                    مسیر پیشنهادی مطالعه
                  </h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {data.internalLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/5 p-5 shadow-sm hover:-translate-y-0.5 transition-transform"
                      >
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                          {l.label}
                        </div>
                        {l.description ? (
                          <div className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                            {l.description}
                          </div>
                        ) : null}
                        <div className="mt-3 text-xs text-emerald-700 dark:text-emerald-300 inline-flex items-center">
                          مشاهده
                          <span className="mr-1 transition-transform group-hover:-translate-x-0.5">←</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </ArticleReveal>

              <ArticleReveal>
                <section id="related" className={cn(ARTICLE_TOKENS.card, "scroll-mt-28 p-6 md:p-8")}>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-900 dark:text-white">
                        مقالات مرتبط
                      </h2>
                      <p className="mt-2 text-slate-700 dark:text-slate-300 leading-8">
                        اگر این مقاله برای شما مفید بود، این موارد را هم ببینید.
                      </p>
                    </div>
                    <Link href="/blog" className="hidden sm:inline-flex">
                      <Button variant="outline" className="rounded-2xl">
                        مشاهده همه
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-6">
                    <RelatedArticles items={data.related} />
                  </div>
                </section>
              </ArticleReveal>
            </div>
          </div>

          <div className="hidden lg:block">
            <ArticleToc toc={data.toc} />
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm p-5">
              <div className="font-semibold text-slate-900 dark:text-white">اقدام سریع</div>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                برای تمرین و سنجش آمادگی، وارد شبیه‌ساز شوید یا امکانات را ببینید.
              </p>
              <div className="mt-4 flex gap-2">
                <Link href="/azmoon-hafizan-quran-online" className="flex-1">
                  <Button className="w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                    شروع آزمون
                  </Button>
                </Link>
                <Link href="/features" className="flex-1">
                  <Button variant="outline" className="w-full rounded-2xl border-emerald-200 dark:border-emerald-900/40">
                    امکانات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
