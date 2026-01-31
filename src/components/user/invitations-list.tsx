"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, GraduationCap, Check, X, Clock } from "lucide-react";

interface Invitation {
  id: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    phone: string;
  };
}

export function InvitationsList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/invitations/received");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleResponse = async (invitationId: string, action: "accept" | "reject") => {
    console.log("handleResponse called:", { invitationId, action });
    setIsLoading(true);
    try {
      const res = await fetch("/api/invitations/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, action }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        toast.success(`دعوت‌نامه با موفقیت ${action === "accept" ? "پذیرفته" : "رد"} شد`);
        fetchInvitations(); // Refresh list
      } else {
        toast.error(data.error || "خطا در پاسخ به دعوت‌نامه");
      }
    } catch (error) {
      console.error("Error in handleResponse:", error);
      toast.error("خطا در برقراری ارتباط");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-700">در انتظار</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-emerald-100 text-emerald-700">پذیرفته شده</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700">رد شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            دعوت‌نامه‌ها
          </CardTitle>
          <CardDescription>دعوت‌نامه‌هایی که برای شما ارسال شده است</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            دعوت‌نامه فعالی برای شما وجود ندارد
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          دعوت‌نامه‌ها
        </CardTitle>
        <CardDescription>دعوت‌نامه‌هایی که برای شما ارسال شده است</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {invitation.role === "TEACHER" ? (
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                  ) : (
                    <Users className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="font-medium">
                    دعوت به عنوان {invitation.role === "TEACHER" ? "معلم" : "دانش‌آموز"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  از طرف: <span className="font-medium">{invitation.sender.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  شماره: <span dir="ltr">{invitation.sender.phone}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(invitation.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(invitation.status)}
                {invitation.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log("Reject button clicked for:", invitation.id);
                        handleResponse(invitation.id, "reject");
                      }}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      رد
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        console.log("Accept button clicked for:", invitation.id);
                        handleResponse(invitation.id, "accept");
                      }}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                      پذیرش
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
