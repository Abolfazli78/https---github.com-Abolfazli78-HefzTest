"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { TicketStatus } from "@/generated";
import { Eye, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  _count: {
    messages: number;
  };
}

interface TicketsTableProps {
  tickets: Ticket[];
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    if (!confirm("آیا از حذف این تیکت مطمئن هستید؟")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/tickets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("حذف تیکت ناموفق بود");
    } finally {
      setDeletingId(null);
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

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        تیکتی وجود ندارد
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>موضوع</TableHead>
          <TableHead>کاربر</TableHead>
          <TableHead>دسته‌بندی</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>تعداد پیام‌ها</TableHead>
          <TableHead>تاریخ</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="font-medium">{ticket.subject}</TableCell>
            <TableCell>
              <div>
                <div>{ticket.user.name}</div>
                <div className="text-sm text-muted-foreground" dir="ltr">
                  {ticket.user.email}
                </div>
              </div>
            </TableCell>
            <TableCell>{ticket.category || "-"}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(ticket.status)}>
                {getStatusLabel(ticket.status)}
              </Badge>
            </TableCell>
            <TableCell>{ticket._count.messages}</TableCell>
            <TableCell>
              {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
            </TableCell>
            <TableCell className="flex items-center gap-2">
              <Link href={`/admin/tickets/${ticket.id}`}>
                <Button variant="ghost" size="icon" aria-label="مشاهده">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/admin/tickets/${ticket.id}/edit`}>
                <Button variant="ghost" size="icon" aria-label="ویرایش">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="حذف"
                onClick={() => onDelete(ticket.id)}
                disabled={deletingId === ticket.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

