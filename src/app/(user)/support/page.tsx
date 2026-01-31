"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/generated";
import { MessageSquare, Send } from "lucide-react";
import { UpgradeModal } from "@/components/common/upgrade-modal";
import { SubscriptionLock } from "@/components/subscription/subscription-lock";
import { FEATURES } from "@/lib/subscription-constants";

interface Ticket {
  id: string;
  subject: string;
  category?: string;
  status: TicketStatus;
  createdAt: Date;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
}

export default function SupportPage() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    message: "",
    recipientRole: "ADMIN" as "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT",
  });

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const response = await fetch('/api/subscriptions/info');
        if (response.ok) {
          const data = await response.json();
          console.log('Subscription info:', data);
          setSubscriptionInfo(data);
        }
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
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

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.message) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });

      if (response.status === 403) {
        setUpgradeOpen(true);
        return;
      }
      if (response.ok) {
        setNewTicket({ subject: "", category: "", message: "", recipientRole: "ADMIN" });
        setShowNewTicketForm(false);
        loadTickets();
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.status === 403) {
        setUpgradeOpen(true);
        return;
      }
      if (response.ok) {
        setNewMessage("");
        loadTickets();
        // Update selected ticket
        const updatedTickets = await fetch("/api/tickets").then((r) => r.json());
        setTickets(updatedTickets);
        const updated = updatedTickets.find((t: Ticket) => t.id === selectedTicket.id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
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
      
      {/* Show lock if user doesn't have access */}
      {(loading || !subscriptionInfo?.hasActiveSubscription || !subscriptionInfo?.features?.includes(FEATURES.TICKET_SUPPORT)) ? (
        <SubscriptionLock 
          feature={FEATURES.TICKET_SUPPORT}
          title="پشتیبانی تیکت"
          description="ارسال تیکت پشتیبانی فقط برای کاربران با اشتراک فعال در دسترس است"
          icon={<MessageSquare className="h-8 w-8" />}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">پشتیبانی</h1>
          <p className="text-muted-foreground">ارسال و مشاهده تیکت‌های پشتیبانی</p>
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
          <CardContent className="space-y-4">
            <div>
              <Label>موضوع</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
                placeholder="موضوع تیکت"
              />
            </div>
            <div>
              <Label>دسته‌بندی</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) =>
                  setNewTicket({ ...newTicket, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
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
                value={newTicket.recipientRole}
                onValueChange={(value) =>
                  setNewTicket({
                    ...newTicket,
                    recipientRole: value as "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مقصد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ادمین اصلی</SelectItem>
                  <SelectItem value="TEACHER">معلم</SelectItem>
                  <SelectItem value="INSTITUTE">مدیر موسسه</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>پیام</Label>
              <Textarea
                value={newTicket.message}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, message: e.target.value })
                }
                placeholder="پیام خود را بنویسید..."
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTicket} disabled={isSubmitting}>
                {isSubmitting ? "در حال ارسال..." : "ارسال"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewTicketForm(false);
                  setNewTicket({ subject: "", category: "", message: "", recipientRole: "ADMIN" });
                }}
              >
                لغو
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>تیکت‌ها</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  در حال بارگذاری...
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  تیکتی وجود ندارد
                </div>
              ) : (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`w-full text-right p-4 hover:bg-muted transition-colors ${selectedTicket?.id === ticket.id ? "bg-muted" : ""
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={getStatusVariant(ticket.status)}>
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{ticket.subject}</p>
                      {ticket.category && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {ticket.category}
                        </p>
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      {selectedTicket.category && (
                        <Badge variant="outline" className="mt-2">
                          {selectedTicket.category}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(selectedTicket.status)}>
                    {getStatusLabel(selectedTicket.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${message.isAdmin
                        ? "bg-blue-50 dark:bg-blue-900/20 mr-8"
                        : "bg-muted ml-8"
                        }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold">
                          {message.isAdmin ? "پشتیبانی" : "شما"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString("fa-IR")}
                        </span>
                      </div>
                      <p className="arabic-text">{message.message}</p>
                    </div>
                  ))}
                </div>

                {selectedTicket.status !== "CLOSED" && (
                  <div className="space-y-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      rows={3}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSubmitting}
                      className="w-full"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "در حال ارسال..." : "ارسال"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                تیکتی را برای مشاهده گفتگو انتخاب کنید
              </CardContent>
            </Card>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

