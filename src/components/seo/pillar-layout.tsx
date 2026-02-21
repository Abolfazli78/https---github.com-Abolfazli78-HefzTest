import Link from "next/link";

export function SeoPillarLayout({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc?: { href: string; label: string }[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">{children}</article>
        {toc && toc.length > 0 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-white/5 backdrop-blur p-5">
              <div className="font-bold mb-3">دسترسی سریع</div>
              <nav className="space-y-2 text-sm">
                {toc.map((t) => (
                  <div key={t.href}>
                    <Link className="text-slate-700 dark:text-slate-300 hover:underline" href={t.href}>
                      {t.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
