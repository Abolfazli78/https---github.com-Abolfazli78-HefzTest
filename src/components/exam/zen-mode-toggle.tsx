"use client";

import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ZenModeToggle() {
    const [isZen, setIsZen] = useState(false);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsZen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullScreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
    }, []);

    const toggleZenMode = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleZenMode}
                        className="text-muted-foreground hover:text-primary"
                    >
                        {isZen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{isZen ? "خروج از حالت تمرکز" : "حالت تمرکز (Zen Mode)"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
