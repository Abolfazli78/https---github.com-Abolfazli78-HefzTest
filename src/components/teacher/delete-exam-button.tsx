"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteExamButton({ examId, redirectTo }: { examId: string; redirectTo: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    if (!confirm("آیا از حذف این آزمون مطمئن هستید؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/exams/${examId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "خطا در حذف آزمون");
        return;
      }
      try {
        window.dispatchEvent(new Event("subscription:updated"));
      } catch {}
      router.push(redirectTo);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={onDelete} disabled={loading} className="gap-2">
      <Trash2 className="h-4 w-4" />
      {loading ? "در حال حذف..." : "حذف آزمون"}
    </Button>
  );
}
