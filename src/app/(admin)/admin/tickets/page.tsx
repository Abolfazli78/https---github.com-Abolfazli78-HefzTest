import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { TicketsTable } from "@/components/admin/tickets-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminTicketsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const ticketsData = await db.supportTicket.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform null to undefined for the component
  const tickets = ticketsData.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    category: ticket.category ?? undefined,
    status: ticket.status,
    createdAt: ticket.createdAt,
    user: {
      ...ticket.user,
      email: ticket.user.email ?? "",
    },
    _count: ticket._count,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">مدیریت تیکت‌های پشتیبانی</h1>
        <p className="text-muted-foreground">مشاهده و مدیریت تمام تیکت‌های پشتیبانی</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>لیست تیکت‌ها</CardTitle>
              <CardDescription>
                مجموع تیکت‌ها: {tickets.length}
              </CardDescription>
            </div>
            <Link href="/admin/tickets/new">
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                تیکت جدید
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <TicketsTable tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}

