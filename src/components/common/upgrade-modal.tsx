"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Crown } from "lucide-react";

export function UpgradeModal({
  open,
  onOpenChange,
  title = "این قابلیت در پلن فعلی شما موجود نیست",
  description = "برای دسترسی به این بخش، پلن خود را ارتقاء دهید.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <div className="relative">
              <Crown className="h-7 w-7 text-amber-600" />
              <Lock className="absolute -bottom-1 -left-2 h-4 w-4 text-slate-700 dark:text-slate-200" />
            </div>
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Link href="/subscriptions" className="w-full sm:w-auto">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              ارتقاء پلن
            </Button>
          </Link>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
