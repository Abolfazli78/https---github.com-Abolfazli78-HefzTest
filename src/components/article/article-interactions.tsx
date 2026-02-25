"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type TocItem = { id: string; label: string };
export type FaqItem = { question: string; answer: string };

export function ScrollProgressBar() {
  const [width, setWidth] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setWidth(Math.max(0, Math.min(100, p)));
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <div className="h-[3px] bg-transparent">
        <div
          className={cn(
            "h-[3px] origin-right bg-gradient-to-l from-emerald-600 to-emerald-400",
            reduce ? "" : "transition-[width] duration-150"
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function ArticleReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        threshold: [0.1, 0.2, 0.4, 0.6],
        rootMargin: "-15% 0px -70% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ArticleToc({
  toc,
  className,
  title = "فهرست مطالب",
}: {
  toc: TocItem[];
  className?: string;
  title?: string;
}) {
  const ids = useMemo(() => toc.map((t) => t.id), [toc]);
  const active = useScrollSpy(ids);
  const reduce = useReducedMotion();

  return (
    <div className={className}>
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
            <div className="h-2 w-2 rounded-full bg-emerald-600 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]" />
          </div>
          <nav className="space-y-1 text-sm">
            {toc.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToId(t.id)}
                  className={cn(
                    "w-full text-right rounded-xl px-3 py-2 transition-colors",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="relative inline-flex items-center gap-2">
                    {!reduce && isActive ? (
                      <motion.span
                        layoutId="toc-active"
                        className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600"
                        transition={{ duration: 0.25 }}
                      />
                    ) : (
                      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700")} />
                    )}
                    {t.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="lg:hidden">
        <details className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm p-4">
          <summary className="cursor-pointer select-none font-semibold text-slate-900 dark:text-white">
            {title}
          </summary>
          <div className="mt-3 space-y-1">
            {toc.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToId(t.id)}
                  className={cn(
                    "w-full text-right rounded-xl px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </details>
      </div>
    </div>
  );
}

export function MidArticleCta({
  headline,
  description,
  primary,
  secondary,
}: {
  headline: string;
  description: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-2xl border border-emerald-200/70 dark:border-emerald-900/40 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/35 dark:to-white/5 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.55)] p-6 md:p-8"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-700/15" />

      <div className="relative space-y-3">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-relaxed text-slate-900 dark:text-white">
          {headline}
        </h2>
        <p className="text-base leading-8 text-slate-700 dark:text-slate-300 max-w-2xl">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link href={primary.href}>
              <Button className="rounded-2xl bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-200/60">
                {primary.label}
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link href={secondary.href}>
              <Button variant="outline" className="rounded-2xl border-emerald-200 dark:border-emerald-900/40">
                {secondary.label}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((f, idx) => {
        const isOpen = open === idx;
        return (
          <div
            key={`${idx}-${f.question}`}
            className={cn(
              "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm overflow-hidden"
            )}
          >
            <button
              type="button"
              className="w-full text-right px-5 py-4 flex items-center justify-between gap-4"
              onClick={() => setOpen((v) => (v === idx ? null : idx))}
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate-900 dark:text-white leading-7">{f.question}</span>
              <span className={cn("text-emerald-700 dark:text-emerald-300 transition-transform", isOpen ? "rotate-180" : "rotate-0")}>
                ▾
              </span>
            </button>
            <motion.div
              initial={false}
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { height: "auto", opacity: 1 },
                closed: { height: 0, opacity: 0 },
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="px-5"
            >
              <div className="pb-4 text-slate-700 dark:text-slate-300 leading-8">{f.answer}</div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

