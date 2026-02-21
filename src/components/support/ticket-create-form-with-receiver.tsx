"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type TicketPanelRole = "TEACHER" | "INSTITUTE";

type DestinationOption = { value: string; label: string };

type ReceiverOption = { id: string; name: string; email: string | null };

const TEACHER_DESTINATIONS: DestinationOption[] = [
  { value: "ADMIN", label: "ادمین موسسه" },
  { value: "STUDENT", label: "دانش‌آموز" },
];

const INSTITUTE_DESTINATIONS: DestinationOption[] = [
  { value: "SUPER_ADMIN", label: "ادمین اصلی" },
  { value: "TEACHER", label: "معلم" },
  { value: "STUDENT", label: "دانش‌آموز" },
];

function destinationRequiresReceiver(
  role: TicketPanelRole,
  destination: string
): boolean {
  if (role === "TEACHER") return destination === "STUDENT";
  if (role === "INSTITUTE") return destination === "TEACHER" || destination === "STUDENT";
  return false;
}

function getReceiversApiUrl(role: TicketPanelRole, destination: string): string | null {
  if (role === "TEACHER" && destination === "STUDENT") return "/api/teacher/students";
  if (role === "INSTITUTE" && destination === "TEACHER") return "/api/institute/teachers";
  if (role === "INSTITUTE" && destination === "STUDENT") return "/api/institute/students";
  return null;
}

export type TicketCreatePayload = {
  subject: string;
  category: string;
  message: string;
  recipientRole: string | null;
  recipientUserId: string | null;
};

type TicketCreateFormWithReceiverProps = {
  role: TicketPanelRole;
  onSubmit: (payload: TicketCreatePayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
};

export function TicketCreateFormWithReceiver({
  role,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TicketCreateFormWithReceiverProps) {
  const destinations =
    role === "TEACHER" ? TEACHER_DESTINATIONS : INSTITUTE_DESTINATIONS;

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [destinationRole, setDestinationRole] = useState<string>(
    role === "TEACHER" ? "ADMIN" : "SUPER_ADMIN"
  );
  const [receiverId, setReceiverId] = useState("");
  const [receivers, setReceivers] = useState<ReceiverOption[]>([]);
  const [receiversLoading, setReceiversLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const needsReceiver = destinationRequiresReceiver(role, destinationRole);
  const apiUrl = getReceiversApiUrl(role, destinationRole);

  const fetchReceivers = useCallback(async () => {
    if (!apiUrl) {
      setReceivers([]);
      return;
    }
    setReceiversLoading(true);
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setReceivers(Array.isArray(data) ? data : []);
      } else {
        setReceivers([]);
      }
    } catch {
      setReceivers([]);
    } finally {
      setReceiversLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    setReceiverId("");
    if (apiUrl) {
      fetchReceivers();
    } else {
      setReceivers([]);
    }
  }, [destinationRole, apiUrl, fetchReceivers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!subject.trim() || !message.trim()) {
      setSubmitError("موضوع و پیام الزامی هستند.");
      return;
    }

    if (needsReceiver && !receiverId.trim()) {
      setSubmitError("لطفاً گیرنده را انتخاب کنید.");
      return;
    }

    const payload: TicketCreatePayload = {
      subject: subject.trim(),
      category: category.trim() || "",
      message: message.trim(),
      recipientRole: destinationRole === "SUPER_ADMIN" ? "ADMIN" : destinationRole,
      recipientUserId: needsReceiver ? receiverId : null,
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "خطا در ارسال تیکت");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="subject">موضوع</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="موضوع تیکت"
          required
        />
      </div>

      <div>
        <Label>دسته‌بندی</Label>
        <Select value={category || "_"} onValueChange={(v) => setCategory(v === "_" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_">انتخاب دسته‌بندی</SelectItem>
            <SelectItem value="technical">مشکل فنی</SelectItem>
            <SelectItem value="account">مشکل در حساب کاربری</SelectItem>
            <SelectItem value="exam">مشکل در آزمون</SelectItem>
            <SelectItem value="other">سایر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>مقصد</Label>
        <Select
          value={destinationRole}
          onValueChange={(v) => setDestinationRole(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب مقصد" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {needsReceiver && (
        <div>
          <Label>
            {role === "TEACHER" && destinationRole === "STUDENT"
              ? "دانش‌آموز"
              : role === "INSTITUTE" && destinationRole === "TEACHER"
                ? "معلم"
                : "دانش‌آموز"}
          </Label>
          {receiversLoading ? (
            <div className="text-sm text-muted-foreground py-2">
              در حال بارگذاری...
            </div>
          ) : (
            <Select
              value={receiverId}
              onValueChange={setReceiverId}
              required={needsReceiver}
            >
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {receivers.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                    {r.email ? ` (${r.email})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="message">پیام</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          rows={5}
          required
        />
      </div>

      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "در حال ارسال..." : "ارسال"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          لغو
        </Button>
      </div>
    </form>
  );
}
