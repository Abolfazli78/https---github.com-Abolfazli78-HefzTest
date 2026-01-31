"use client";

import { UserSidebar } from "@/components/user/sidebar";
import { usePathname } from "next/navigation";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide sidebar on exam taking page
    const isExamPage = pathname?.includes("/take") || pathname?.includes("/results");

    if (isExamPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <UserSidebar />
            <main className="flex-1 overflow-y-auto bg-muted/20 p-8">
                <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
