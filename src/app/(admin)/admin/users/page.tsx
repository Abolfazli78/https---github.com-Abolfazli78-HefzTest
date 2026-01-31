import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Prisma, UserRole } from "@/generated/client";
import { UsersTable } from "@/components/admin/users-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage(props: {
  searchParams: Promise<{ role?: string }>;
}) {
  const session = await getServerSession();
  const searchParams = await props.searchParams;
  const role = searchParams.role;

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const where: Prisma.UserWhereInput = {};
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    where.role = role as UserRole;
  }

  const usersData = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { examAttempts: true, supportTickets: true },
      },
    },
  });

  const users = usersData.map((user) => ({
    id: user.id,
    email: user.email ?? "",
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    _count: user._count,
  }));

  const title = role === "STUDENT" ? "مدیریت دانش‌آموزان" :
    role === "TEACHER" ? "مدیریت معلمان" :
      role === "INSTITUTE" ? "مدیریت موسسات" : "مدیریت کاربران";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">مشاهده و مدیریت تمام کاربران</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست کاربران</CardTitle>
          <CardDescription>
            مجموع کاربران: {users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}

