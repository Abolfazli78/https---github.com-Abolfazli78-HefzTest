"use client";

import Link from "next/link";
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
    Lock
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
    const { subscriptionInfo } = useSubscription();

    // Check if user has access to support (has active subscription)
    const hasSupportAccess = subscriptionInfo?.hasActiveSubscription;
    
    // Debug logging
    console.log('Sidebar Debug:', {
        subscriptionInfo,
        hasSupportAccess,
        loading: subscriptionInfo === null
    });

    return (
        <div className="w-72 border-l bg-card flex flex-col h-screen sticky top-0">
            <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">آ</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-l from-primary to-blue-600 bg-clip-text text-transparent">
                        پنل کاربری
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
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
                                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                                <span className="font-medium">{item.title}</span>
                            </div>
                            {isLocked ? <Lock className="h-4 w-4" /> : isActive ? <ChevronLeft className="h-4 w-4" /> : null}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <UserUsageWidget />
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="ml-3 h-5 w-5" />
                    خروج از حساب
                </Button>
            </div>
        </div>
    );
}
