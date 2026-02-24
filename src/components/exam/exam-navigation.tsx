"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface ExamNavigationProps {
    questions: any[];
    answers: Record<number, string>;
    flagged: Set<number>;
    currentQuestionIndex: number;
    onQuestionSelect: (index: number) => void;
    compact?: boolean;
    showBackLink?: boolean;
    className?: string;
}

export function ExamNavigation({ 
    questions, 
    answers, 
    flagged, 
    currentQuestionIndex, 
    onQuestionSelect,
    compact = false,
    showBackLink = true,
    className
}: ExamNavigationProps) {
    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className={cn("flex flex-col", compact ? "p-0" : "p-4")}>
                <h2 className={cn("font-bold text-slate-800 dark:text-slate-100 text-center", compact ? "text-sm mb-3" : "text-lg mb-4")}>
                    سوالات آزمون
                </h2>
                
                {showBackLink && (
                    <Link href="../" className="w-full">
                        <Button variant="outline" className={cn("w-full group", compact ? "mb-3 h-9 text-xs" : "mb-4")}>
                            <ArrowRight className={cn("h-4 w-4 ml-2 transition-all group-hover:ml-3", compact && "h-3.5 w-3.5")} />
                            بازگشت به صفحه آزمون
                        </Button>
                    </Link>
                )}

                <div className={cn(
                    "grid gap-1.5 pb-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none lg:overflow-visible",
                    compact ? "grid-cols-6" : "grid-cols-4"
                )}>
                    {questions.map((_, idx) => {
                        const isAnswered = answers[idx] !== undefined;
                        const isFlagged = flagged.has(idx);
                        const isCurrent = currentQuestionIndex === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => onQuestionSelect(idx)}
                                className={cn(
                                    "rounded-lg font-medium transition-all relative flex items-center justify-center",
                                    compact ? "w-9 h-9 text-xs" : "w-12 h-12 text-sm",
                                    isCurrent
                                        ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105 z-10"
                                        : isAnswered
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700",
                                    isFlagged && "ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-slate-900"
                                )}
                            >
                                {idx + 1}
                                {isFlagged && (
                                    <div className={cn(
                                        "absolute -top-1 -right-1 bg-amber-400 rounded-full border border-white dark:border-slate-900",
                                        compact ? "w-2 h-2" : "w-2.5 h-2.5"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className={cn("mt-auto border-t border-slate-200 dark:border-slate-800", compact ? "pt-3" : "pt-4")}>
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <div className="flex items-center gap-1">
                            <div className={cn("rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500", compact ? "w-2.5 h-2.5" : "w-3 h-3")} />
                            <span className={cn("text-xs", compact && "text-[11px]")}>پاسخ داده</span>
                        </div>
                        <span className={cn("font-medium", compact ? "text-[11px]" : "text-xs")}>{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <div className={cn("rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300", compact ? "w-2.5 h-2.5" : "w-3 h-3")} />
                            <span className={cn("text-xs", compact && "text-[11px]")}>باقی‌مانده</span>
                        </div>
                        <span className={cn("font-medium", compact ? "text-[11px]" : "text-xs")}>{questions.length - Object.keys(answers).length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
