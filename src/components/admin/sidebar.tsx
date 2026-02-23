"use client";

import Link from "next/link";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileQuestion,
    Users,
    CreditCard,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    BookOpen,
    Tag,
    Bell,
    FileText,
    FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarItems = [
    {
        title: "داشبورد",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "آزمون‌ها",
        href: "/admin/exams",
        icon: BookOpen,
    },
    {
        title: "ساخت آزمون دلخواه",
        href: "/admin/exams/custom",
        icon: FileText,
    },
    {
        title: "آزمون‌های رسمی",
        href: "/admin/official-exams",
        icon: FileCheck,
    },
    {
        title: "سوالات",
        href: "/admin/questions",
        icon: FileQuestion,
    },
    {
        title: "کاربران",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "اشتراک‌ها",
        href: "/admin/subscriptions",
        icon: CreditCard,
    },
    {
        title: "کدهای تخفیف",
        href: "/admin/discount-codes",
        icon: Tag,
    },
    {
        title: "اعلانات",
        href: "/admin/notifications",
        icon: Bell,
    },
    {
        title: "گزارش مالی",
        href: "/admin/finance",
        icon: BarChart3,
    },
    {
        title: "تیکت‌ها",
        href: "/admin/tickets",
        icon: MessageSquare,
    },
    {
        title: "گزارش‌ها",
        href: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "تنظیمات",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false as any);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                type="button"
                aria-label="open sidebar"
                className="md:hidden fixed top-4 right-4 z-50 rounded-md border bg-background/80 backdrop-blur px-3 py-2 shadow"
                onClick={() => setMobileOpen(true)}
            >
                <span className="block w-5 h-0.5 bg-foreground mb-1"></span>
                <span className="block w-5 h-0.5 bg-foreground mb-1"></span>
                <span className="block w-5 h-0.5 bg-foreground"></span>
            </button>

            {/* Desktop sidebar */}
            <div className="hidden md:flex h-screen w-64 flex-col border-l border-white/10 bg-sidebar/80 backdrop-blur-xl text-sidebar-foreground shadow-2xl relative overflow-hidden">
            {/* Glassmorphism Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex h-20 items-center border-b border-white/10 px-6 relative z-10">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
                    <img src="/logo.png" alt="تست حفظ" className="h-8 object-contain" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        پنل مدیریت
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 relative z-10">
                <nav className="grid gap-2 px-3">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-accent/10 to-accent/5 text-accent shadow-sm border border-accent/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-accent rounded-r-full" />
                                )}
                                <item.icon className={cn(
                                    "h-5 w-5 transition-transform group-hover:scale-110",
                                    isActive ? "text-accent" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-white/10 p-4 relative z-10">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-xl h-12"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-5 w-5" />
                    خروج از حساب
                </Button>
            </div>
            </div>

            {/* Mobile overlay sidebar */}
            {Boolean(mobileOpen) && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-72 bg-sidebar/90 backdrop-blur-xl text-sidebar-foreground border-l border-white/10 shadow-2xl flex flex-col">
                        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                                <img src="/logo.png" alt="تست حفظ" className="h-8 object-contain" />
                                <span className="font-bold">پنل مدیریت</span>
                            </Link>
                            <button
                                type="button"
                                aria-label="close sidebar"
                                className="rounded-md p-2 hover:bg-white/10"
                                onClick={() => setMobileOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-4">
                            <nav className="grid gap-2 px-3">
                                {sidebarItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-gradient-to-r from-accent/10 to-accent/5 text-accent border border-accent/20"
                                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-0 h-full w-1 bg-accent rounded-r-full" />
                                            )}
                                            <item.icon className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-accent" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="border-t border-white/10 p-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-xl h-12"
                                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                            >
                                <LogOut className="h-5 w-5" />
                                خروج از حساب
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
