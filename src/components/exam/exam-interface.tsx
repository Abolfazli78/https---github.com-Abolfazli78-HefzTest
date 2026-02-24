"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    ChevronRight,
    ChevronLeft,
    Flag,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ParsedQuestion } from "@/types";
import { RenderText } from "@/components/RenderText";
import { ExamNavigation } from "./exam-navigation";
import Link from "next/link";

interface ExamInterfaceProps {
    questions: ParsedQuestion[];
    durationMinutes: number;
    answers: Record<number, string>;
    onAnswerChange: (index: number, value: string) => void;
    onSubmit: (answers: Record<number, string>) => void;
}

export function ExamInterface({ questions, durationMinutes, answers, onAnswerChange, onSubmit }: ExamInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    onSubmit(answers);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [answers, onSubmit]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const isTimeWarning = timeLeft <= 300;
    const isTimeCritical = timeLeft <= 60;

    const toggleFlag = () => {
        setFlagged((prev) => {
            const next = new Set(prev);
            if (next.has(currentQuestionIndex)) next.delete(currentQuestionIndex);
            else next.add(currentQuestionIndex);
            return next;
        });
    };

    const currentQuestion = questions[currentQuestionIndex];

    const timerTone = isTimeCritical
        ? "bg-red-50 border-red-200 text-red-600 shadow-red-200/40 animate-pulse dark:bg-red-950/30 dark:border-red-900/40 dark:text-red-300"
        : isTimeWarning
            ? "bg-orange-50 border-orange-200 text-orange-600 shadow-orange-200/40 dark:bg-orange-950/30 dark:border-orange-900/40 dark:text-orange-300"
            : "bg-white border-slate-200 text-slate-700 shadow-slate-200/40 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200";

    return (
        <div className="h-full bg-slate-50 dark:bg-slate-950 flex flex-col theme-exam">
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-end bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
                    <div className={cn("flex items-center gap-3 px-3 py-2 rounded-xl border shadow-sm", timerTone)}>
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-medium">زمان باقی‌مانده</span>
                            <span className="font-mono font-bold text-xl tracking-widest">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <Clock className="w-4 h-4" />
                    </div>
                </header>

                <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
                    <div className="min-h-0 lg:basis-[70%] lg:max-w-[70%] lg:order-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -14 }}
                                className="w-full"
                            >
                                <Card className="p-4 sm:p-5 lg:p-6 shadow-md border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col min-h-0">
                                    <div className="absolute -top-16 -left-16 w-52 h-52 bg-teal-500/5 rounded-full blur-3xl" />

                                    <div className="relative z-10 flex flex-col min-h-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-full">
                                                سوال {currentQuestionIndex + 1} از {questions.length}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={toggleFlag}
                                                className={cn(
                                                    "text-slate-400 hover:text-amber-500 px-2",
                                                    flagged.has(currentQuestionIndex) && "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                                )}
                                            >
                                                <Flag className="w-4 h-4 mr-2" />
                                                نشان‌دار کردن
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-3 min-h-0">
                                            <h3 className="text-[17px] sm:text-[18px] font-semibold text-slate-800 dark:text-slate-100 leading-7 text-right break-words">
                                                <RenderText text={currentQuestion.questionText} />
                                            </h3>

                                            <div className="grid grid-cols-1 gap-2">
                                                {["الف", "ب", "ج", "د"].map((optDisplay, index) => {
                                                    const optKey = String.fromCharCode(65 + index);
                                                    const optionText = currentQuestion[`option${optKey}` as keyof ParsedQuestion] as string;
                                                    const isSelected = answers[currentQuestionIndex] === optKey;

                                                    return (
                                                        <div
                                                            key={optKey}
                                                            onClick={() => onAnswerChange(currentQuestionIndex, optKey)}
                                                            className={cn(
                                                                "group relative px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 flex items-center gap-3 w-full hover:shadow-sm",
                                                                isSelected
                                                                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-teal-200/40"
                                                                    : "border-slate-200 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 bg-white dark:bg-slate-800"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-7 h-7 rounded-md border flex items-center justify-center text-[11px] font-bold transition-colors flex-shrink-0",
                                                                isSelected
                                                                    ? "border-teal-500 bg-teal-500 text-white"
                                                                    : "border-slate-300 text-slate-400 group-hover:border-teal-300"
                                                            )}>
                                                                {optDisplay}
                                                            </div>
                                                            <span className="text-[15px] leading-6 text-slate-700 dark:text-slate-200 break-words flex-1">
                                                                <RenderText text={optionText} />
                                                            </span>

                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="absolute left-3 text-teal-500"
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5" />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="lg:hidden mt-3">
                                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
                                        <div className="grid gap-2 mb-3">
                                            <Link href="/dashboard">
                                                <Button variant="outline" className="w-full">بازگشت به داشبورد</Button>
                                            </Link>
                                            <Link href="/exams">
                                                <Button variant="outline" className="w-full">بازگشت به صفحه آزمون‌ها</Button>
                                            </Link>
                                        </div>
                                        <ExamNavigation
                                            questions={questions}
                                            answers={answers}
                                            flagged={flagged}
                                            currentQuestionIndex={currentQuestionIndex}
                                            onQuestionSelect={setCurrentQuestionIndex}
                                            compact
                                            showBackLink={false}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className="text-slate-500 w-full sm:w-auto"
                                    >
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                        سوال قبلی
                                    </Button>

                                    {currentQuestionIndex === questions.length - 1 ? (
                                        <Button
                                            size="lg"
                                            onClick={() => onSubmit(answers)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-md shadow-emerald-500/30 w-full sm:w-auto"
                                        >
                                            پایان آزمون
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                            className="bg-teal-600 hover:bg-teal-700 text-white px-8 w-full sm:w-auto"
                                        >
                                            سوال بعدی
                                            <ChevronLeft className="w-5 h-5 mr-2" />
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <aside className="hidden lg:flex lg:flex-col gap-4 lg:sticky lg:top-4 lg:self-start lg:basis-[30%] lg:max-w-[30%] lg:order-1">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
                            <Link href="/dashboard">
                                <Button variant="outline" className="w-full">بازگشت به داشبورد</Button>
                            </Link>
                            <Link href="/exams">
                                <Button variant="outline" className="w-full">بازگشت به صفحه آزمون‌ها</Button>
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                            <ExamNavigation
                                questions={questions}
                                answers={answers}
                                flagged={flagged}
                                currentQuestionIndex={currentQuestionIndex}
                                onQuestionSelect={setCurrentQuestionIndex}
                                compact
                                showBackLink={false}
                            />
                        </div>
                        <div className={cn("rounded-2xl border px-4 py-3 shadow-sm", timerTone)}>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span>زمان باقی‌مانده</span>
                                <Clock className="h-4 w-4" />
                            </div>
                            <div className="mt-2 text-center font-mono font-bold text-3xl tracking-widest">
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
