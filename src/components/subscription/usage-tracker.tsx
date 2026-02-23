"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UsageTrackerProps = {
    tone?: "dark" | "light";
    title: string;
    used: number;
    limit: number;
    className?: string;
};

export function UsageTracker({ tone = "light", title, used, limit, className }: UsageTrackerProps) {
    const isUnlimited = !Number.isFinite(limit) || limit <= 0;

    const rawPercent = isUnlimited ? 100 : (used / limit) * 100;
    const percent = Math.max(0, Math.min(100, Math.round(rawPercent)));

    const indicatorClassName = isUnlimited
        ? "bg-emerald-500"
        : percent >= 100
        ? "bg-red-500"
        : percent > 80
        ? "bg-orange-500"
        : "bg-emerald-500";

    const label = isUnlimited
        ? `${used.toLocaleString("fa-IR")} / نامحدود`
        : `${used.toLocaleString("fa-IR")} / ${limit.toLocaleString("fa-IR")}`;

    const titleClassName =
        tone === "dark" ? "text-white/80" : "text-slate-500 dark:text-slate-400";
    const valueClassName =
        tone === "dark" ? "text-white" : "text-slate-900 dark:text-white";
    const trackClassName =
        tone === "dark" ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800";

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between gap-3">
                <div className={cn("text-xs font-bold", titleClassName)}>{title}</div>
                <div className={cn("text-xs font-black", valueClassName)}>{label}</div>
            </div>
            <Progress
                value={percent}
                indicatorClassName={indicatorClassName}
                className={cn("h-3", trackClassName)}
            />
        </div>
    );
}
