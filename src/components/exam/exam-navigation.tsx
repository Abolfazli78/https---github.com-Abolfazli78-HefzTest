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
}

export function ExamNavigation({ 
    questions, 
    answers, 
    flagged, 
    currentQuestionIndex, 
    onQuestionSelect 
}: ExamNavigationProps) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4 text-center">سوالات آزمون</h2>
                
                <Link href="../" className="w-full">
                    <Button variant="outline" className="w-full mb-4 group">
                        <ArrowRight className="h-4 w-4 ml-2 transition-all group-hover:ml-3" />
                        بازگشت به صفحه آزمون
                    </Button>
                </Link>

                <div className="grid grid-cols-4 gap-1.5 pb-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {questions.map((_, idx) => {
                        const isAnswered = answers[idx] !== undefined;
                        const isFlagged = flagged.has(idx);
                        const isCurrent = currentQuestionIndex === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => onQuestionSelect(idx)}
                                className={cn(
                                    "w-12 h-12 rounded-lg text-sm font-medium transition-all relative flex items-center justify-center",
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
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white dark:border-slate-900" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500" />
                            <span className="text-xs">پاسخ داده</span>
                        </div>
                        <span className="text-xs font-medium">{Object.keys(answers).length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300" />
                            <span className="text-xs">باقی‌مانده</span>
                        </div>
                        <span className="text-xs font-medium">{questions.length - Object.keys(answers).length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
