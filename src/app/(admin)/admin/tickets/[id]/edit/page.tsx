import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import TicketEditForm from "@/components/admin/ticket-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminTicketEditPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const { id } = await props.params;
  const ticket = await db.supportTicket.findUnique({
    where: { id },
    select: {
      id: true,
      subject: true,
      category: true,
      status: true,
    },
  });

  if (!ticket) redirect("/admin/tickets");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>ویرایش تیکت</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketEditForm ticket={ticket} />
        </CardContent>
      </Card>
    </div>
  );
}
