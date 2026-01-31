"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Flag } from "lucide-react";

interface QuestionNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    answers: Record<number, string>; // questionIndex -> answer
    flagged: Set<number>; // Set of flagged questionIndices
    onNavigate: (index: number) => void;
}

export function QuestionNavigator({
    totalQuestions,
    currentIndex,
    answers,
    flagged,
    onNavigate,
}: QuestionNavigatorProps) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">سوالات آزمون</h3>
                <span className="text-xs text-muted-foreground">
                    {Object.keys(answers).length} از {totalQuestions} پاسخ داده شده
                </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }).map((_, index) => {
                    const isAnswered = answers[index] !== undefined;
                    const isFlagged = flagged.has(index);
                    const isCurrent = currentIndex === index;

                    return (
                        <button
                            key={index}
                            onClick={() => onNavigate(index)}
                            className={cn(
                                "relative flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                isCurrent
                                    ? "border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2"
                                    : isAnswered
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                        : "bg-secondary hover:bg-secondary/80",
                                isFlagged && !isCurrent && "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
                            )}
                        >
                            {index + 1}
                            {isFlagged && (
                                <div className="absolute -right-1 -top-1">
                                    <Flag className="h-3 w-3 fill-orange-500 text-orange-500" />
                                </div>
                            )}
                            {isAnswered && !isFlagged && !isCurrent && (
                                <div className="absolute -right-1 -top-1">
                                    <CheckCircle2 className="h-3 w-3 fill-emerald-500 text-white dark:text-emerald-950" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span>سوال فعلی</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span>پاسخ داده شده</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span>نشان‌دار شده</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-secondary border" />
                    <span>بدون پاسخ</span>
                </div>
            </div>
        </div>
    );
}
