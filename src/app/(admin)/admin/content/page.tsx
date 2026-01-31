import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ContentTable } from "@/components/admin/content-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ContentPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const contentData = await db.homepageContent.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  // Transform null to undefined for the component
  const content = contentData.map((item) => ({
    ...item,
    title: item.title ?? undefined,
    content: item.content ?? undefined,
    imageUrl: item.imageUrl ?? undefined,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت محتوای صفحه اصلی</h1>
          <p className="text-muted-foreground">مدیریت اسلایدرها، بنرها و محتوا</p>
        </div>
        <Link href="/admin/content/new">
          <Button>افزودن محتوای جدید</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست محتوا</CardTitle>
          <CardDescription>
            مجموع آیتم‌ها: {content.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentTable content={content} />
        </CardContent>
      </Card>
    </div>
  );
}

