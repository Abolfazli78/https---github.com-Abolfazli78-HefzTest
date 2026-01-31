"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TicketReplySystem } from "@/components/admin/ticket-reply-system";
import { TicketStatus } from "@/generated";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Ticket {
  id: string;
  subject: string;
  category?: string;
  status: TicketStatus;
  createdAt: Date;
  user: {
    name: string;
    email: string;
  };
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    if (!params.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        router.push("/admin/tickets");
      }
    } catch (err) {
      console.error("Error loading ticket:", err);
      router.push("/admin/tickets");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleReply = async (message: string) => {
    if (!ticket) return;
    
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "خطا در ارسال پیام");
      }

      await loadTicket();
    } catch (err) {
      throw err;
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!ticket) return;
    
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "خطا در تغییر وضعیت");
      }

      await loadTicket();
    } catch (err) {
      throw err;
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels: Record<TicketStatus, string> = {
      NEW: "جدید",
      IN_PROGRESS: "در حال بررسی",
      CLOSED: "بسته شده",
    };
    return labels[status];
  };

  const getStatusVariant = (status: TicketStatus) => {
    const variants: Record<TicketStatus, "default" | "secondary" | "outline"> = {
      NEW: "default",
      IN_PROGRESS: "secondary",
      CLOSED: "outline",
    };
    return variants[status];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{ticket.subject}</h1>
          <p className="text-muted-foreground">مدیریت تیکت پشتیبانی</p>
        </div>
        <Link href="/admin/tickets">
          <Button variant="outline">
            <ArrowRight className="mr-2 h-4 w-4" />
            بازگشت
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>اطلاعات تیکت</CardTitle>
              <CardDescription className="mt-2">
                <div>کاربر: {ticket.user.name}</div>
                <div dir="ltr" className="text-left">{ticket.user.email}</div>
                {ticket.category && (
                  <Badge variant="outline" className="mt-2">
                    {ticket.category}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant(ticket.status)}>
              {getStatusLabel(ticket.status)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <TicketReplySystem
        ticket={ticket}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
        currentUserRole="ADMIN"
        currentUserName="ادمین"
      />
    </div>
  );
}
