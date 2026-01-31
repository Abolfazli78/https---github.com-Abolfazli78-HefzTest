"use client";

import dynamic from "next/dynamic";

const UserPerformanceChartContent = dynamic(() => import("./user-performance-chart-content").then(mod => mod.UserPerformanceChart), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-xl" />
});

import { UserPerformanceChartProps } from "./user-performance-chart-content";

export function UserPerformanceChart(props: UserPerformanceChartProps) {
    return <UserPerformanceChartContent {...props} />;
}
