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
                {/* Desktop Sidebar - User Dashboard */}
                {!isExamPage && <UserSidebar />}
                
                {/* Mobile Menu Button for Exam Pages */}
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

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden">
                    <div className="h-full">
                        {children}
                    </div>
                </main>
            </div>
        </ExamContext.Provider>
    );
}
