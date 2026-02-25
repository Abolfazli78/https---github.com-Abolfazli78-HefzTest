"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
};

export function BlogListingClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("همه");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category)));
    return ["همه", ...cats];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return articles.filter((a) => {
      const matchQ = q
        ? a.title.includes(q) ||
          a.excerpt.includes(q) ||
          a.category.includes(q)
        : true;
      const matchC = activeCategory === "همه" ? true : a.category === activeCategory;
      return matchQ && matchC;
    });
  }, [articles, query, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const latest = [...articles].slice(0, 5);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((a) => (
            <article
              key={a.slug}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm shadow-emerald-100 hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="relative">
                <div className="h-40 w-full bg-gradient-to-tr from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 flex items-center justify-center">
                  <Image
                    src={a.image}
                    alt={a.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-contain opacity-80"
                    loading="lazy"
                    unoptimized
                  />
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1">
                  {a.category}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h2 className="text-lg font-bold leading-7">
                  <Link href={`/blog/${a.slug}`} className="hover:underline">
                    {a.title}
                  </Link>
                </h2>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-7 line-clamp-3">
                  {a.excerpt}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">تاریخ: {a.date}</span>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="inline-flex items-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 transition-colors"
                  >
                    مطالعه بیشتر
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4 shadow-sm">
              <div className="font-bold mb-3">جستجو</div>
              <input
                type="search"
                placeholder="عبارت مورد نظر را وارد کنید..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={query}
                onChange={(e) => { setPage(1); setQuery(e.target.value); }}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4 shadow-sm">
              <div className="font-bold mb-3">دسته‌بندی</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setPage(1); setActiveCategory(c); }}
                    className={[
                      "text-xs px-3 py-1 rounded-full border transition-colors",
                      activeCategory === c
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white/60 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    ].join(" ")}
                    aria-pressed={activeCategory === c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-4 shadow-sm">
              <div className="font-bold mb-3">آخرین مقالات</div>
              <ul className="space-y-3">
                {latest.map((l) => (
                  <li key={l.slug} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden">
                      <Image
                        src={l.image}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain opacity-80"
                        loading="lazy"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/blog/${l.slug}`} className="block text-sm font-medium hover:underline truncate">
                        {l.title}
                      </Link>
                      <div className="text-[11px] text-slate-500">{l.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="rounded-xl px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        <ul className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              <button
                className={[
                  "min-w-9 h-9 rounded-xl text-sm border",
                  currentPage === n
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                ].join(" ")}
                onClick={() => setPage(n)}
                aria-current={currentPage === n ? "page" : undefined}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="rounded-xl px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
      </div>
    </>
  );
}
