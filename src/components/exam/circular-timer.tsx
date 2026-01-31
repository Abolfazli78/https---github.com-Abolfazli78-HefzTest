"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CircularTimerProps {
    durationSeconds: number; // Total duration in seconds
    onExpire?: () => void;
    className?: string;
}

export function CircularTimer({ durationSeconds, onExpire, className }: CircularTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);

    // Calculate progress
    const progress = (timeLeft / durationSeconds) * 100;
    const circumference = 2 * Math.PI * 40; // r=40
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Color based on time left
    const isWarning = timeLeft < durationSeconds * 0.2; // Last 20%
    const isCritical = timeLeft < durationSeconds * 0.1; // Last 10%

    const colorClass = isCritical
        ? "text-red-500 stroke-red-500"
        : isWarning
            ? "text-orange-500 stroke-orange-500"
            : "text-primary stroke-primary";

    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire?.();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onExpire]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Background Circle */}
            <svg className="h-24 w-24 -rotate-90 transform">
                <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                />
                {/* Progress Circle */}
                <circle
                    className={cn("transition-all duration-1000 ease-linear", colorClass)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="48"
                    cy="48"
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset,
                    }}
                />
            </svg>

            {/* Time Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                <Clock className={cn("h-4 w-4 mb-1 opacity-50", colorClass)} />
                <span className={cn("text-lg font-bold tabular-nums", colorClass)}>
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
}
