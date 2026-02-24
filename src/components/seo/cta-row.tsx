import Link from "next/link";

export function SeoCtaRow() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      <Link href="/register" className="rounded-lg bg-slate-900 px-4 py-2 text-white">
        ثبت نام رایگان
      </Link>
      <Link href="/demo" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 dark:text-white">
        مشاهده دموی سیستم
      </Link>
      <Link href="/login" className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
        ورود
      </Link>
    </div>
  );
}
