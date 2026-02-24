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
import { ParsedQuestion } from "@/types";
import { RenderText } from "@/components/RenderText";
import { ExamNavigation } from "./exam-navigation";
import { Sidebar } from "@/components/sidebar";
import { useExamSidebar } from "@/app/(user)/layout";

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
    const { isSidebarOpen, setIsSidebarOpen } = useExamSidebar();

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

    const isTimeCritical = timeLeft <= 300; // 5 minutes

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
        <div className="h-full bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row theme-exam">
            {/* Exam Navigation Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
                <ExamNavigation
                    questions={questions}
                    answers={answers}
                    flagged={flagged}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionSelect={(index) => {
                        setCurrentQuestionIndex(index);
                        setIsSidebarOpen(false);
                    }}
                />
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-12 flex items-start justify-center">
                <div className="w-full max-w-4xl xl:max-w-5xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            <Card className="p-6 sm:p-8 lg:p-10 shadow-xl border-0 bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl relative overflow-hidden flex flex-col max-h-[calc(100vh-9rem)] min-h-0">
                                {/* Decorative background blob */}
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

                                <div className="relative z-10 flex flex-col flex-1 min-h-0">
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

                                    <div className="flex flex-col gap-4 sm:gap-5 min-h-0 flex-1">
                                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed text-right break-words">
                                            <RenderText text={currentQuestion.questionText} />
                                        </h3>

                                        <div className="flex-1 min-h-0 overflow-y-auto h-[44vh] sm:h-[48vh] pr-2">
                                            <div className="grid grid-cols-1 gap-3 sm:gap-4 pr-1">
                                                {["الف", "ب", "ج", "د"].map((optDisplay, index) => {
                                                    const optKey = String.fromCharCode(65 + index);
                                                    const optionText = currentQuestion[`option${optKey}` as keyof ParsedQuestion] as string;
                                                    const isSelected = answers[currentQuestionIndex] === optKey;

                                                    return (
                                                        <div
                                                            key={optKey}
                                                            onClick={() => onAnswerChange(currentQuestionIndex, optKey)}
                                                            className={cn(
                                                                "group relative p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 sm:gap-4 w-full",
                                                                isSelected
                                                                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                                                    : "border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 bg-white dark:bg-slate-800"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-colors flex-shrink-0",
                                                                isSelected
                                                                    ? "border-teal-500 bg-teal-500 text-white"
                                                                    : "border-slate-300 text-slate-400 group-hover:border-teal-300"
                                                            )}>
                                                                {optDisplay}
                                                            </div>
                                                            <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 break-words flex-1">
                                                                <RenderText text={optionText} />
                                                            </span>

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
                                    </div>
                                </div>
                            </Card>

                            {/* Navigation Buttons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 sm:mt-8">
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
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 shadow-lg shadow-emerald-500/30 w-full sm:w-auto"
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
            </div>
            </div>
        </div>
    );
}
