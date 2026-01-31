"use client";

import { useState, useEffect } from "react";
import { Bell, UserPlus, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
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

export function NotificationCenter() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const fetchInvitations = async () => {
        try {
            const res = await fetch("/api/organization/invitations", {
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setInvitations(data);
            }
        } catch (error) {
            console.error("Error fetching invitations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        fetchInvitations();
        // Poll every 60 seconds instead of 30
        const interval = setInterval(() => {
            if (mounted) fetchInvitations();
        }, 60000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleResponse = async (invitationId: string, action: "ACCEPT" | "REJECT") => {
        try {
            const res = await fetch("/api/organization/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invitationId, action }),
            });

            if (res.ok) {
                toast.success(action === "ACCEPT" ? "دعوت‌نامه پذیرفته شد" : "دعوت‌نامه رد شد");
                setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
                if (action === "ACCEPT") {
                    window.location.reload(); // Reload to update permissions/hierarchy
                }
            } else {
                toast.error("خطا در ثبت پاسخ");
            }
        } catch (_error) {
            toast.error("خطا در برقراری ارتباط");
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group rounded-full hover:bg-indigo-500/10 transition-all">
                    <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    {invitations.length > 0 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-sm tracking-tight">اعلان‌ها</h3>
                        {invitations.length > 0 && (
                            <Badge className="bg-indigo-600 text-white border-0 text-[10px] h-5">
                                {invitations.length} جدید
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 opacity-50" />
                            </div>
                        ) : invitations.length === 0 ? (
                            <div className="p-12 text-center space-y-3">
                                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
                                    <Bell className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm text-muted-foreground font-medium">اعلانی وجود ندارد</p>
                            </div>
                        ) : (
                            invitations.map((inv) => (
                                <motion.div
                                    key={inv.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center shrink-0 border border-indigo-500/10">
                                            <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <p className="text-sm leading-snug font-medium text-slate-900 dark:text-slate-200">
                                                <span className="font-black">{inv.sender.name}</span> شما را به عنوان <span className="text-indigo-600 dark:text-indigo-400 font-bold">{inv.role === "TEACHER" ? "معلم" : "دانش‌آموز"}</span> دعوت کرده است.
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium">
                                                {new Date(inv.createdAt).toLocaleDateString("fa-IR")}
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    className="h-8 flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold"
                                                    onClick={() => handleResponse(inv.id, "ACCEPT")}
                                                >
                                                    پذیرش
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 flex-1 rounded-lg text-[11px] font-bold hover:bg-red-500/10 hover:text-red-600"
                                                    onClick={() => handleResponse(inv.id, "REJECT")}
                                                >
                                                    رد کردن
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
