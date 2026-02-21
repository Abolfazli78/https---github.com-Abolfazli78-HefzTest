"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Sidebar({ isOpen, onClose, children }: SidebarProps) {
    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out",
                    "lg:static lg:inset-y-auto lg:right-auto lg:translate-x-0 lg:border-l-0 lg:border-r",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Mobile close button */}
                    <div className="flex justify-end p-3 lg:hidden">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    {/* Sidebar content */}
                    <div className="flex-1 overflow-hidden">
                        {children}
                    </div>
                </div>
            </aside>
        </>
    );
}
