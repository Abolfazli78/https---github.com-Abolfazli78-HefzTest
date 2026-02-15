"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    BarChart3,
    CreditCard,
    Settings,
    LogOut,
    MessageSquare,
    UserPlus,
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    BookOpen,
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
        href: "/institute",
        icon: LayoutDashboard,
    },
    {
        title: "معلمان موسسه",
        href: "/institute/teachers",
        icon: GraduationCap,
    },
    {
        title: "آزمون‌های موسسه",
        href: "/institute/exams",
        icon: BookOpen,
    },
    {
        title: "ساخت آزمون دلخواه",
        href: "/institute/exams/custom",
        icon: FileText,
    },
    {
        title: "شبیه‌ساز آزمون",
        href: "/institute/simulator",
        icon: ClipboardCheck,
    },
    {
        title: "دانش‌آموزان کل",
        href: "/institute/students",
        icon: Users,
    },
    {
        title: "مدیریت دبیران و کادر",
        href: "/institute/team",
        icon: UserPlus,
    },
    {
        title: "گزارش‌های مدیریتی",
        href: "/institute/reports",
        icon: BarChart3,
    },
    {
        title: "تیکت ها",
        href: "/institute/support",
        icon: MessageSquare,
    },
    {
        title: "اشتراک‌ها",
        href: "/institute/subscriptions",
        icon: CreditCard,
    },
    {
        title: "تنظیمات",
        href: "/institute/settings",
        icon: Settings,
    },
];

export function InstituteSidebar({ quotaUsage }: { quotaUsage: QuotaUsageSummary }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { subscriptionInfo } = useSubscription();
    const showSimulator = subscriptionInfo?.examSimulatorEnabled === true;
    const visibleSidebarItems = sidebarItems.filter(
        (item) => item.href !== "/institute/simulator" || showSimulator
    );

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="flex h-screen flex-col border-l border-white/10 bg-indigo-950 text-white shadow-2xl relative transition-all duration-300 ease-in-out"
        >
            {/* Background Gradient Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex h-20 items-center justify-between border-b border-white/5 px-6 relative z-10">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                M
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400 font-black">
                                پنل مدیر موسسه
                            </span>
                        </Link>
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white mx-auto">
                        M
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
                                        ? "bg-indigo-500/20 text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)] border border-indigo-500/30"
                                        : "text-indigo-200/50 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                                    isActive ? "text-indigo-400" : "text-indigo-500/50 group-hover:text-indigo-300"
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
                                        layoutId="active-pill-inst"
                                        className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-r-full shadow-[0_0_15px_rgba(129,140,248,0.5)]"
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
                            <Link href="/institute/subscriptions" className="block">
                                <div className="rounded-xl bg-indigo-500/20 border border-indigo-400/30 p-3 flex items-center justify-between hover:bg-indigo-500/25 transition-colors">
                                    <div>
                                        <div className="text-xs font-black text-white">ارتقاء پلن</div>
                                        <div className="text-[10px] text-white/60 mt-1">برای فعال‌سازی امکانات، پلن تهیه کنید</div>
                                    </div>
                                    <Crown className="h-4 w-4 text-indigo-300" />
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
                    className="absolute -left-3 top-[-20px] h-6 w-6 rounded-full bg-indigo-900 border border-white/10 text-white shadow-xl hover:bg-indigo-800 hidden md:flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                </Button>
            </div>
        </motion.div>
    );
}
