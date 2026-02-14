"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/generated";
import { MessageSquare } from "lucide-react";
import { UpgradeModal } from "@/components/common/upgrade-modal";
import { TicketReplySystem } from "@/components/admin/ticket-reply-system";
import {
  TicketCreateFormWithReceiver,
  type TicketCreatePayload,
} from "@/components/support/ticket-create-form-with-receiver";

interface Ticket {
  id: string;
  subject: string;
  category?: string;
  status: TicketStatus;
  createdAt: Date;
  messages: TicketMessage[];
  user: { id: string; name: string; email: string };
}

interface TicketMessage {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
}

export default function InstituteSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tickets");
      if (response.status === 403) {
        setTickets([]);
        setSelectedTicket(null);
        setUpgradeOpen(true);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
        if (data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
        }
      }
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (payload: TicketCreatePayload) => {
    setIsSubmittingTicket(true);
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: payload.subject,
          category: payload.category || null,
          message: payload.message,
          recipientRole: payload.recipientRole || null,
          recipientUserId: payload.recipientUserId || null,
        }),
      });

      if (response.status === 403) {
        setUpgradeOpen(true);
        return;
      }
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "خطا در ایجاد تیکت");
      }
      setShowNewTicketForm(false);
      loadTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleReply = async (message: string) => {
    if (!selectedTicket) return;
    
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (response.status === 403) {
        setUpgradeOpen(true);
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "خطا در ارسال پیام");
      }

      await loadTickets();
      const updatedTickets = await fetch("/api/tickets").then((r) => r.json());
      setTickets(updatedTickets);
      const updated = updatedTickets.find((t: Ticket) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      throw err;
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.status === 403) {
        setUpgradeOpen(true);
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "خطا در تغییر وضعیت");
      }

      await loadTickets();
      const updatedTickets = await fetch("/api/tickets").then((r) => r.json());
      setTickets(updatedTickets);
      const updated = updatedTickets.find((t: Ticket) => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      throw err;
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    const labels = {
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

  return (
    <div className="container mx-auto py-8 px-4">
      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">تیکت‌های پشتیبانی موسسه</h1>
          <p className="text-muted-foreground">ارسال، مشاهده و مدیریت تیکت‌های پشتیبانی موسسه</p>
        </div>
        <Button onClick={() => setShowNewTicketForm(!showNewTicketForm)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          تیکت جدید
        </Button>
      </div>

      {showNewTicketForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ایجاد تیکت جدید</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketCreateFormWithReceiver
              role="INSTITUTE"
              onSubmit={handleCreateTicket}
              onCancel={() => setShowNewTicketForm(false)}
              isSubmitting={isSubmittingTicket}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>تیکت‌ها</CardTitle>
              <CardDescription>لیست تیکت‌های شما و اعضای موسسه</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">در حال بارگذاری...</div>
              ) : tickets.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">تیکتی وجود ندارد</div>
              ) : (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-right p-4 hover:bg-muted transition-colors ${selectedTicket?.id === ticket.id ? "bg-muted" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={getStatusVariant(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      {ticket.user && (
                        <p className="text-xs text-muted-foreground mt-1" dir="ltr">{ticket.user.email}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedTicket ? (
            <TicketReplySystem
              ticket={selectedTicket}
              onReply={handleReply}
              onStatusChange={handleStatusChange}
              currentUserRole="INSTITUTE"
              currentUserName="موسسه"
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">تیکتی را برای مشاهده گفتگو انتخاب کنید</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
