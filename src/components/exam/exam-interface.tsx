"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    ChevronRight,
    ChevronLeft,
    Flag,
    CheckCircle2,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ParsedQuestion } from "@/types"; // Assuming this type exists or will be compatible

interface ExamInterfaceProps {
    questions: ParsedQuestion[];
    durationMinutes: number;
    answers: Record<number, string>;
    onAnswerChange: (index: number, value: string) => void;
    onSubmit: (answers: Record<number, string>) => void;
}

export function ExamInterface({ questions, durationMinutes, answers, onAnswerChange, onSubmit }: ExamInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // answers state lifted up
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const isTimeCritical = timeLeft < 60; // Less than 1 minute

    const handleAnswer = (option: string) => {
        onAnswerChange(currentQuestionIndex, option);
    };

    const toggleFlag = () => {
        setFlagged((prev) => {
            const next = new Set(prev);
            if (next.has(currentQuestionIndex)) next.delete(currentQuestionIndex);
            else next.add(currentQuestionIndex);
            return next;
        });
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden theme-exam">
            {/* Sticky Sidebar / Navigator */}
            <aside
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">سوالات آزمون</h2>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <ChevronRight />
                        </Button>
                    </div>

                    <div className="grid grid-cols-5 gap-2 overflow-y-auto pb-4">
                        {questions.map((_, idx) => {
                            const isAnswered = answers[idx] !== undefined;
                            const isFlagged = flagged.has(idx);
                            const isCurrent = currentQuestionIndex === idx;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentQuestionIndex(idx);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "w-10 h-10 rounded-lg text-sm font-medium transition-all relative",
                                        isCurrent
                                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-110 z-10"
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

                    <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-500" />
                                <span>پاسخ داده</span>
                            </div>
                            <span>{Object.keys(answers).length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300" />
                                <span>باقی‌مانده</span>
                            </div>
                            <span>{questions.length - Object.keys(answers).length}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen relative">
                {/* Header */}
                <header className="h-20 px-6 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                        <Menu />
                    </Button>

                    <div className="flex items-center gap-4 mr-auto">
                        {/* Circular Timer */}
                        <div className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-full border transition-colors",
                            isTimeCritical
                                ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                        )}>
                            <Clock className="w-4 h-4" />
                            <span className="font-mono font-bold text-lg tracking-widest">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-3xl"
                        >
                            <Card className="p-8 md:p-10 shadow-xl border-0 bg-white dark:bg-slate-900 rounded-3xl relative overflow-hidden">
                                {/* Decorative background blob */}
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <span className="text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 rounded-full">
                                            سوال {currentQuestionIndex + 1} از {questions.length}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleFlag}
                                            className={cn(
                                                "text-slate-400 hover:text-amber-500",
                                                flagged.has(currentQuestionIndex) && "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                            )}
                                        >
                                            <Flag className="w-4 h-4 mr-2" />
                                            نشان‌دار کردن
                                        </Button>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-10 text-right font-arabic">
                                        {currentQuestion.questionText}
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        {["A", "B", "C", "D"].map((optKey) => {
                                            const optionText = currentQuestion[`option${optKey}` as keyof ParsedQuestion] as string;
                                            const isSelected = answers[currentQuestionIndex] === optKey;

                                            return (
                                                <div
                                                    key={optKey}
                                                    onClick={() => handleAnswer(optKey)}
                                                    className={cn(
                                                        "group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4",
                                                        isSelected
                                                            ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                                            : "border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 bg-white dark:bg-slate-800"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors",
                                                        isSelected
                                                            ? "border-teal-500 bg-teal-500 text-white"
                                                            : "border-slate-300 text-slate-400 group-hover:border-teal-300"
                                                    )}>
                                                        {optKey}
                                                    </div>
                                                    <span className="text-lg text-slate-700 dark:text-slate-200">{optionText}</span>

                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute left-4 text-teal-500"
                                                        >
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="text-slate-500"
                                >
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                    سوال قبلی
                                </Button>

                                {currentQuestionIndex === questions.length - 1 ? (
                                    <Button
                                        size="lg"
                                        onClick={() => onSubmit(answers)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-500/30"
                                    >
                                        پایان آزمون
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                                    >
                                        سوال بعدی
                                        <ChevronLeft className="w-5 h-5 mr-2" />
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
