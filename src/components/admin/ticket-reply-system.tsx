"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Paperclip, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle,
  User,
  Bot,
  Reply,
  Forward,
  MoreVertical,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketStatus } from "@prisma/client";

interface TicketMessage {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
  };
}

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

interface TicketReplySystemProps {
  ticket: Ticket;
  onReply: (message: string) => Promise<void>;
  onStatusChange: (status: TicketStatus) => Promise<void>;
  currentUserRole: "ADMIN" | "INSTITUTE" | "TEACHER" | "STUDENT";
  currentUserName: string;
}

export function TicketReplySystem({ 
  ticket, 
  onReply, 
  onStatusChange,
  currentUserRole,
  currentUserName 
}: TicketReplySystemProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleReply = async () => {
    if (!newMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReply(newMessage);
      setNewMessage("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      await onStatusChange(status);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CLOSED": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "NEW": return <AlertCircle className="h-4 w-4" />;
      case "IN_PROGRESS": return <Clock className="h-4 w-4" />;
      case "CLOSED": return <CheckCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleString("fa-IR", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTicketClosed = ticket.status === "CLOSED";

  return (
    <div className="space-y-6">
      {/* Ticket Status and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-2`}>
                {getStatusIcon(ticket.status)}
                {ticket.status === "NEW" && "جدید"}
                {ticket.status === "IN_PROGRESS" && "در حال بررسی"}
                {ticket.status === "CLOSED" && "بسته شده"}
              </Badge>
              {ticket.category && (
                <Badge variant="outline">{ticket.category}</Badge>
              )}
            </div>
            
            {currentUserRole === "ADMIN" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    تغییر وضعیت
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusChange("NEW")}>
                    <AlertCircle className="h-4 w-4 ml-2" />
                    جدید
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("IN_PROGRESS")}>
                    <Clock className="h-4 w-4 ml-2" />
                    در حال بررسی
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("CLOSED")}>
                    <CheckCircle className="h-4 w-4 ml-2" />
                    بسته شده
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            گفتگو ({ticket.messages.length} پیام)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ticket.messages.map((message, index) => (
              <div key={message.id}>
                <div
                  className={`flex gap-3 ${
                    message.isAdmin ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${
                    message.isAdmin ? "flex-row" : "flex-row-reverse"
                  }`}>
                    {/* Avatar */}
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={message.isAdmin ? "bg-blue-100" : "bg-gray-100"}>
                        {message.isAdmin ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    {/* Message Content */}
                    <div className={`space-y-1 ${
                      message.isAdmin ? "items-start" : "items-end"
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {message.isAdmin ? "پشتیبانی" : ticket.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                      
                      <div className={`rounded-lg p-3 ${
                        message.isAdmin 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>

                      {/* Reply Button */}
                      {!isTicketClosed && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(message.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Reply className="h-3 w-3 ml-1" />
                            پاسخ
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < ticket.messages.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {!isTicketClosed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              ارسال پاسخ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {replyingTo && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">در حال پاسخ به:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(null)}
                    className="h-6 px-2 text-xs"
                  >
                    لغو
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {ticket.messages.find(m => m.id === replyingTo)?.message}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="پیام خود را بنویسید..."
                rows={4}
                className="resize-none"
                disabled={isSubmitting}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <Paperclip className="h-4 w-4 ml-2" />
                    پیوست
                  </Button>
                </div>
                
                <Button
                  onClick={handleReply}
                  disabled={!newMessage.trim() || isSubmitting}
                >
                  <Send className="h-4 w-4 ml-2" />
                  {isSubmitting ? "در حال ارسال..." : "ارسال پاسخ"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket Closed Notice */}
      {isTicketClosed && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">این تیکت بسته شده است</p>
                <p className="text-sm opacity-75">
                  برای ارسال پیام جدید، لطفاً تیکت دیگری ایجاد کنید یا وضعیت این تیکت را تغییر دهید.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
