"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, ShieldCheck, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NotificationsDropdown } from "./notifications-dropdown";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isExamTakingPage = pathname?.match(/^\/exams\/[^\/]+$/);
  const isAdminPage = pathname?.startsWith("/admin");
  const isDashboardPage = pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/teacher") ||
    pathname?.startsWith("/institute");

  if (isExamTakingPage || isAdminPage || isDashboardPage) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/LOGO.jpg" alt="تست حفظ" width={160} height={48} className="h-10 w-auto" priority />
              <span className="sr-only">تست حفظ</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/about">درباره ما</NavLink>
              <NavLink href="/features">امکانات</NavLink>
              <NavLink href="/pricing">قیمت‌ها</NavLink>
            </div>

            {session && (
              <div className="hidden md:flex items-center gap-8">
                <NavLink href="/dashboard">داشبورد</NavLink>
                <NavLink href="/history">تاریخچه</NavLink>
                <NavLink href="/leaderboard">رده‌بندی</NavLink>
                <NavLink href="/subscriptions">اشتراک‌ها</NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {session && session.user && <NotificationsDropdown />}
            {session && session.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
                  <div className="px-3 py-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5" dir="ltr">
                      {user?.email}
                    </p>
                    <Badge variant="outline" className="mt-2 text-[10px] h-5 bg-accent/10 text-accent border-accent/20">
                      {user?.role}
                    </Badge>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg h-10">
                    <Link href="/dashboard" className="flex items-center w-full">
                      <LayoutDashboard className="ml-2 h-4 w-4 opacity-70" />
                      داشبورد من
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg h-10">
                        <Link href="/admin" className="flex items-center w-full">
                          <ShieldCheck className="ml-2 h-4 w-4 opacity-70" />
                          پنل مدیریت
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer rounded-lg h-10">
                        <Link href="/admin/discount-codes" className="flex items-center w-full">
                          <Tag className="ml-2 h-4 w-4 opacity-70" />
                          کدهای تخفیف
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 cursor-pointer rounded-lg h-10 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                  >
                    <LogOut className="ml-2 h-4 w-4 opacity-70" />
                    خروج از حساب
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl h-10 px-5">ورود</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-highlight hover:bg-[#C18C35] text-white rounded-xl h-10 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    ثبت نام
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-accent relative py-1",
        isActive ? "text-accent" : "text-muted-foreground"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 right-0 h-0.5 w-full bg-accent rounded-full" />
      )}
    </Link>
  );
}
