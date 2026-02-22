"use client";

import { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { UserSidebar } from "@/components/user/sidebar";
import { Sidebar } from "@/components/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Context for exam navigation
const ExamContext = createContext<{
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}>({
    isSidebarOpen: false,
    setIsSidebarOpen: () => {}
});

export function useExamSidebar() {
    return useContext(ExamContext);
}

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const isExamPage = pathname?.includes("/take") || pathname?.includes("/results");

    return (
        <ExamContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            <div className="flex min-h-screen bg-background text-foreground">
                {!isExamPage && <UserSidebar />}
                
                {isExamPage && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="fixed top-4 right-4 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                <main className="flex-1 overflow-x-hidden bg-muted/20">
                    {isExamPage ? (
                        <div className="h-full">
                            {children}
                        </div>
                    ) : (
                        <div className="h-full">
                            <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8 py-6 md:py-10">
                                {children}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ExamContext.Provider>
    );
}
