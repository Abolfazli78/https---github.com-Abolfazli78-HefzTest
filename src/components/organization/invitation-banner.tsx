"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Invitation {
    id: string;
    sender: {
        name: string;
        role: string;
    };
    role: string;
    createdAt: string;
}

export function InvitationBanner() {
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchInvites = async () => {
            try {
                const res = await fetch("/api/organization/invitations", {
                    cache: 'no-store'
                });
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setInvitation(data[0]);
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching invites:", error);
            }
        };

        fetchInvites();
        return () => { mounted = false; };
    }, []);

    const handleResponse = async (action: "ACCEPT" | "REJECT") => {
        if (!invitation) return;

        try {
            const res = await fetch("/api/organization/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invitationId: invitation.id, action }),
            });

            if (res.ok) {
                toast.success(action === "ACCEPT" ? "دعوت‌نامه پذیرفته شد" : "دعوت‌نامه رد شد");
                setIsVisible(false);
                if (action === "ACCEPT") {
                    setTimeout(() => window.location.reload(), 1000);
                }
            }
        } catch (_error) {
            toast.error("خطا در ثبت پاسخ");
        }
    };

    return (
        <AnimatePresence>
            {isVisible && invitation && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-50"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                        <div className="p-6">
                            <div className="flex gap-5">
                                <div className="relative">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                        <UserPlus className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"
                                    />
                                </div>

                                <div className="space-y-1.5 flex-1">
                                    <h4 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">دعوت به همکاری</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        <span className="font-bold text-slate-900 dark:text-slate-200">{invitation.sender.name}</span> شما را به عنوان <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">{invitation.role === "TEACHER" ? "معلم" : "دانش‌آموز"}</span> دعوت کرده است.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={() => handleResponse("ACCEPT")}
                                >
                                    <Check className="ml-2 h-5 w-5" />
                                    پذیرش و ورود
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-2xl h-12 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                    onClick={() => handleResponse("REJECT")}
                                >
                                    <X className="ml-2 h-5 w-5" />
                                    بعداً
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
