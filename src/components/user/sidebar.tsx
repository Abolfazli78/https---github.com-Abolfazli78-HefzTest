"use client";

import Link from "next/link";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    Clock,
    Award,
    Lock,
    ClipboardCheck
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { UserUsageWidget } from "@/components/subscription/user-usage-widget";
import { UpgradeModal } from "@/components/common/upgrade-modal";
import { useSubscription } from "@/hooks/use-subscription";

const menuItems = [
    {
        title: "داشبورد",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "آزمون‌ها",
        href: "/exams",
        icon: BookOpen,
    },
    {
        title: "ساخت آزمون دلخواه",
        href: "/exams/custom",
        icon: PlusCircle,
    },
    {
        title: "تاریخچه آزمون‌ها",
        href: "/history",
        icon: Clock,
    },
    {
        title: "شبیه‌ساز آزمون",
        href: "/dashboard/simulator",
        icon: ClipboardCheck,
    },
    {
        title: "برترین‌ها",
        href: "/leaderboard",
        icon: Award,
    },
    {
        title: "اشتراک‌ها",
        href: "/subscriptions",
        icon: CreditCard,
    },
    {
        title: "تیکت‌ها",
        href: "/support",
        icon: MessageSquare,
    },
    {
        title: "تنظیمات",
        href: "/settings",
        icon: Settings,
    },
];

export function UserSidebar() {
    const pathname = usePathname();
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { subscriptionInfo } = useSubscription();

    // Check if user has access to support (has active subscription)
    const hasSupportAccess = subscriptionInfo?.hasActiveSubscription;
    // Show simulator menu only when plan has examSimulatorEnabled
    const showSimulator = subscriptionInfo?.examSimulatorEnabled === true;
    const visibleMenuItems = menuItems.filter(
        (item) => item.href !== "/dashboard/simulator" || showSimulator
    );

    return (
        <>
            {/* Mobile hamburger */}
            <button
                type="button"
                aria-label="open sidebar"
                className="lg:hidden fixed top-4 right-4 z-50 rounded-xl border bg-background/80 backdrop-blur px-3 py-2 shadow-sm hover:shadow-md transition-all"
                onClick={() => setMobileOpen(true)}
            >
                <span className="block w-5 h-0.5 bg-foreground mb-1"></span>
                <span className="block w-5 h-0.5 bg-foreground mb-1"></span>
                <span className="block w-5 h-0.5 bg-foreground"></span>
            </button>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex w-72 border-l bg-card/80 backdrop-blur-xl flex-col h-screen sticky top-0 shadow-xl">
                <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
                <div className="p-6 border-b border-border/60">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.jpg" alt="تست حفظ" className="h-8 object-contain" />
                        <span className="text-xl font-bold bg-gradient-to-l from-primary to-blue-600 bg-clip-text text-transparent">
                            پنل کاربری
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {visibleMenuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                        const isLocked = item.href === "/support" && (!hasSupportAccess && subscriptionInfo !== null);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={(e) => {
                                    if (isLocked) {
                                        e.preventDefault();
                                        setUpgradeOpen(true);
                                    }
                                }}
                                className={cn(
                                    "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                                        : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent")} />
                                    <span className="font-medium">{item.title}</span>
                                </div>
                                {isLocked ? <Lock className="h-4 w-4" /> : isActive ? <ChevronLeft className="h-4 w-4" /> : null}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border/60">
                    <UserUsageWidget />
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-950/30 h-11 rounded-xl"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <LogOut className="ml-3 h-5 w-5" />
                        خروج از حساب
                    </Button>
                </div>
            </div>

            {/* Mobile overlay sidebar */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="absolute inset-y-0 right-0 w-72 bg-card/95 backdrop-blur-xl border-l shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-border/60 flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                                <img src="/logo.jpg" alt="تست حفظ" className="h-8 object-contain" />
                                <span className="text-lg font-bold">پنل کاربری</span>
                            </Link>
                            <button
                                type="button"
                                aria-label="close sidebar"
                                className="rounded-xl p-2 hover:bg-muted/70"
                                onClick={() => setMobileOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                            {visibleMenuItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                                const isLocked = item.href === "/support" && (!hasSupportAccess && subscriptionInfo !== null);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                                setUpgradeOpen(true);
                                                return;
                                            }
                                            setMobileOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group",
                                            isActive
                                                ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                                                : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn("h-5 w-5", isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent")} />
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        {isActive ? <ChevronLeft className="h-4 w-4" /> : null}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-border/60">
                            <UserUsageWidget />
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-950/30 h-11 rounded-xl"
                                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                            >
                                <LogOut className="ml-3 h-5 w-5" />
                                خروج از حساب
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
