"use client";

import { TeacherSidebar } from "@/components/teacher/sidebar";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getQuotaUsageSummaryForTeacher } from "@/lib/quota-usage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [quotaUsage, setQuotaUsage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                
                if (!session || session.user?.role !== "TEACHER") {
                    redirect("/login");
                    return;
                }

                const quotaResponse = await fetch('/api/quota-usage');
                const quotaData = await quotaResponse.json();
                setQuotaUsage(quotaData);
            } catch (error) {
                console.error('Auth error:', error);
                redirect("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            <TeacherSidebar quotaUsage={quotaUsage} />
            <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

                <div className="container mx-auto p-6 md:p-10 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
