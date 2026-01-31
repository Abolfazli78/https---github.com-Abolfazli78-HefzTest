"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function TicketCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [recipientRole, setRecipientRole] = useState<string>("none");
  const [recipientUserId, setRecipientUserId] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subject, 
          category: category || null, 
          message,
          recipientRole: recipientRole === "none" ? null : recipientRole,
          recipientUserId: recipientUserId || null
        }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "failed");
      }
      
      router.push("/admin/tickets");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("ایجاد تیکت ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">موضوع</Label>
        <Input 
          id="subject" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">دسته‌بندی</Label>
        <Input 
          id="category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="مثلا technical" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">پیام اولیه</Label>
        <Textarea 
          id="message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نقش گیرنده (اختیاری)</Label>
          <Select value={recipientRole} onValueChange={setRecipientRole}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب نقش گیرنده" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">بدون گیرنده خاص</SelectItem>
              <SelectItem value="ADMIN">مدیر</SelectItem>
              <SelectItem value="INSTITUTE">موسسه</SelectItem>
              <SelectItem value="TEACHER">معلم</SelectItem>
              <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientUserId">شناسه گیرنده (اختیاری)</Label>
          <Input 
            id="recipientUserId" 
            value={recipientUserId} 
            onChange={(e) => setRecipientUserId(e.target.value)} 
            placeholder="شناسه کاربری گیرنده"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "در حال ایجاد..." : "ایجاد تیکت"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/admin/tickets")}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}
