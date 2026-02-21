"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    PlusCircle,
    BarChart3,
    CreditCard,
    Settings,
    LogOut,
    MessageSquare,
    UserPlus,
    ChevronRight,
    ChevronLeft,
    FileText,
    Crown,
    ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { NotificationCenter } from "@/components/organization/notification-center";
import { motion } from "framer-motion";
import { useState } from "react";
import { UsageTracker } from "@/components/subscription/usage-tracker";
import type { QuotaUsageSummary } from "@/lib/quota-usage";
import { useSubscription } from "@/hooks/use-subscription";

const sidebarItems = [
    {
        title: "داشبورد",
        href: "/teacher",
        icon: LayoutDashboard,
    },
    {
        title: "دانش‌آموزان من",
        href: "/teacher/students",
        icon: Users,
    },
    {
        title: "مدیریت کلاس",
        href: "/teacher/team",
        icon: UserPlus,
    },
    {
        title: "آزمون‌های من",
        href: "/teacher/exams",
        icon: BookOpen,
    },
    {
        title: "طراحی آزمون",
        href: "/teacher/exams/new",
        icon: PlusCircle,
    },
    {
        title: "ساخت آزمون دلخواه",
        href: "/teacher/exams/custom",
        icon: FileText,
    },
    {
        title: "شبیه‌ساز آزمون",
        href: "/teacher/simulator",
        icon: ClipboardCheck,
    },
    {
        title: "گزارش عملکرد",
        href: "/teacher/reports",
        icon: BarChart3,
    },
    {
        title: "تیکت ها",
        href: "/teacher/support",
        icon: MessageSquare,
    },
    {
        title: "اشتراک‌ها",
        href: "/teacher/subscriptions",
        icon: CreditCard,
    },
    {
        title: "تنظیمات",
        href: "/teacher/settings",
        icon: Settings,
    },
];

export function TeacherSidebar({ quotaUsage }: { quotaUsage: QuotaUsageSummary }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { subscriptionInfo } = useSubscription();
    const showSimulator = subscriptionInfo?.examSimulatorEnabled === true;
    const visibleSidebarItems = sidebarItems.filter(
        (item) => item.href !== "/teacher/simulator" || showSimulator
    );

    return (
        <>
            {/* Mobile hamburger */}
            <button
                type="button"
                aria-label="open sidebar"
                className="md:hidden fixed top-4 right-4 z-50 rounded-md border border-white/10 bg-slate-900/80 backdrop-blur px-3 py-2 shadow text-white"
                onClick={() => setMobileOpen(true)}
            >
                <span className="block w-5 h-0.5 bg-white mb-1"></span>
                <span className="block w-5 h-0.5 bg-white mb-1"></span>
                <span className="block w-5 h-0.5 bg-white"></span>
            </button>

            {/* Desktop sidebar */}
            <motion.div
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="hidden md:flex h-screen flex-col border-l border-white/10 bg-slate-950 text-white shadow-2xl relative transition-all duration-300 ease-in-out"
            >
            {/* Background Gradient Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex h-20 items-center justify-between border-b border-white/5 px-6 relative z-10">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                T
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 font-black">
                                پنل معلم
                            </span>
                        </Link>
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto">
                        T
                    </div>
                )}
                {!isCollapsed && <NotificationCenter />}
            </div>

            <div className="flex-1 overflow-y-auto py-8 relative z-10">
                <style jsx>{`
                  .flex-1::-webkit-scrollbar {
                    width: 4px;
                  }
                  .flex-1::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .flex-1::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 2px;
                  }
                  .flex-1::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                  }
                `}</style>
                <nav className="grid gap-1.5 px-3">
                    {visibleSidebarItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] border border-emerald-500/20"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"
                                )} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 top-0 h-full w-1 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-white/5 relative z-10">
                {!isCollapsed && (
                    <div className="mb-4 rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-black text-white">اشتراک</div>
                            {quotaUsage.planName ? (
                                <div className="text-[10px] font-bold text-white/60">{quotaUsage.planName}</div>
                            ) : (
                                <div className="text-[10px] font-bold text-white/60">بدون اشتراک</div>
                            )}
                        </div>

                        {quotaUsage.hasActiveSubscription ? (
                            <>
                                <UsageTracker
                                    tone="dark"
                                    title="آزمون‌ها (این ماه)"
                                    used={quotaUsage.usage.examsThisMonth}
                                    limit={quotaUsage.quotas.maxExamsPerMonth}
                                />

                                <UsageTracker
                                    tone="dark"
                                    title="دانش‌آموزان"
                                    used={quotaUsage.usage.studentsCount}
                                    limit={quotaUsage.quotas.maxStudentsAllowed}
                                />
                            </>
                        ) : (
                            <Link href="/teacher/subscriptions" className="block">
                                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center justify-between hover:bg-emerald-500/15 transition-colors">
                                    <div>
                                        <div className="text-xs font-black text-white">ارتقاء پلن</div>
                                        <div className="text-[10px] text-white/60 mt-1">برای فعال‌سازی امکانات، پلن تهیه کنید</div>
                                    </div>
                                    <Crown className="h-4 w-4 text-emerald-400" />
                                </div>
                            </Link>
                        )}
                    </div>
                )}

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors rounded-xl h-12 font-bold",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span>خروج از حساب</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -left-3 top-[-20px] h-6 w-6 rounded-full bg-slate-800 border border-white/10 text-white shadow-xl hover:bg-slate-700 hidden md:flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </div>
            </motion.div>

            {/* Mobile overlay sidebar */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-72 bg-slate-950 text-white border-l border-white/10 shadow-2xl flex flex-col">
                        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                                    T
                                </div>
                                <span className="font-bold">پنل معلم</span>
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
                            <nav className="grid gap-1.5 px-3">
                                {visibleSidebarItems.map((item, index) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group relative overflow-hidden",
                                                isActive
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-5 w-5 shrink-0",
                                                isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="p-4 border-t border-white/10">
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl h-12"
                                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                            >
                                <LogOut className="h-5 w-5" />
                                <span>خروج از حساب</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
