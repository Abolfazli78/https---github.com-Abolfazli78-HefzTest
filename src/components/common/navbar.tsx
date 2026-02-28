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
import { User, LogOut, LayoutDashboard, ShieldCheck, Tag, Menu, X, Home, BookOpen, HelpCircle, Phone, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isExamTakingPage = pathname?.match(/^\/exams\/[^\/]+$/);
  const isAdminPage = pathname?.startsWith("/admin");
  const isDashboardPage = pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/teacher") ||
    pathname?.startsWith("/institute");

  if (isExamTakingPage || isAdminPage || isDashboardPage) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-1 p-0 group transition-opacity duration-200 hover:opacity-90">
                <Image src="/logo2.png" alt="سامانه آزمون آنلاین حفظ قرآن حفظ تست" className="h-14 w-auto block object-contain ml-3" width={56} height={56} />
                <span className="flex flex-col mt-3">
                  <span className="text-[20px] md:text-[22px] leading-none font-bold tracking-[-0.3px] text-brand whitespace-nowrap">
                    حفظ تست
                  </span>
                  <span className="hidden sm:block text-[11px] md:text-[12px] leading-[1.2] text-neutral-500 mt-[2px]">
                    سامانه هوشمند آزمون
                  </span>
                </span>
              </Link>
              <div className="hidden md:block h-6 w-px bg-neutral-200" />

              <div className="hidden md:flex items-center gap-8">
                <NavLink href="/">صفحه اصلی</NavLink>
                <NavLink href="/blog">مقالات</NavLink>
                 <NavLink href="/rahnama-samane-test-hefz">راهنمای سامانه</NavLink>
                <NavLink href="/faq">سوالات متداول</NavLink>
               
                 <NavLink href="/about">درباره ما</NavLink>
                <NavLink href="/contact">تماس با ما</NavLink>
              </div>

              {session && (
                <div className="hidden md:flex items-center gap-8">
                  <NavLink href="/dashboard">داشبورد</NavLink>
                  <NavLink href="/history">تاریخچه آزمون ها</NavLink>

                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-10 w-10 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

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
                <div className="hidden md:flex gap-2">
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

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Slide-in Menu */}
        <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Image src="/logo2.png" alt="سامانه آزمون آنلاین حفظ قرآن حفظ تست" className="h-10 w-auto" width={40} height={40} />
                <span className="text-lg font-bold text-brand">حفظ تست</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            {session && user && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-secondary/10 border border-accent/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">{user.email}</p>
                    <Badge variant="outline" className="mt-1 text-[10px] h-5 bg-accent/10 text-accent border-accent/20">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <nav className="space-y-2">
              <MobileNavLink href="/" icon={<Home className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                صفحه اصلی
              </MobileNavLink>
              <MobileNavLink href="/about" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                درباره ما
              </MobileNavLink>
              <MobileNavLink href="/faq" icon={<HelpCircle className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                سوالات متداول
              </MobileNavLink>
              <MobileNavLink href="/rahnama-samane-test-hefz" icon={<FileText className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                راهنمای سامانه
              </MobileNavLink>
              <MobileNavLink href="/blog" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                مقالات
              </MobileNavLink>
              <MobileNavLink href="/contact" icon={<Phone className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                تماس با ما
              </MobileNavLink>
            </nav>

            {/* User Navigation */}
            {session && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">پنل کاربری</h3>
                <nav className="space-y-2">
                  <MobileNavLink href="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                    داشبورد
                  </MobileNavLink>
                  <MobileNavLink href="/history" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                    تاریخچه
                  </MobileNavLink>
                  <MobileNavLink href="/leaderboard" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                    رده‌بندی
                  </MobileNavLink>
                  <MobileNavLink href="/subscriptions" icon={<BookOpen className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                    اشتراک‌ها
                  </MobileNavLink>
                  {user?.role === "ADMIN" && (
                    <>
                      <MobileNavLink href="/admin" icon={<ShieldCheck className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                        پنل مدیریت
                      </MobileNavLink>
                      <MobileNavLink href="/admin/discount-codes" icon={<Tag className="h-4 w-4" />} onClick={() => setMobileMenuOpen(false)}>
                        کدهای تخفیف
                      </MobileNavLink>
                    </>
                  )}
                </nav>
              </div>
            )}

            {/* Auth Buttons */}
            {!session && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full rounded-xl h-12 justify-center">
                    ورود
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-highlight hover:bg-[#C18C35] text-white rounded-xl h-12 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    ثبت نام
                  </Button>
                </Link>
              </div>
            )}

            {/* Logout */}
            {session && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl h-12 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 justify-start"
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج از حساب
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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

function MobileNavLink({ 
  href, 
  icon, 
  children, 
  onClick 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        isActive 
          ? "bg-accent/10 text-accent font-semibold" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
        isActive ? "bg-accent/20 text-accent" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
}
