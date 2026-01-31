"use client";

import dynamic from "next/dynamic";

const ReportsChartsContent = dynamic(() => import("./reports-charts-content").then(mod => mod.ReportsCharts), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full animate-pulse bg-muted rounded-xl" />
});

import { ReportsChartsProps } from "./reports-charts-content";

export function ReportsCharts(props: ReportsChartsProps) {
    return <ReportsChartsContent {...props} />;
}
