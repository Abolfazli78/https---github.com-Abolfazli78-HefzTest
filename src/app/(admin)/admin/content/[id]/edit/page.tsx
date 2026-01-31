import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ContentForm } from "@/components/admin/content-form";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const content = await db.homepageContent.findUnique({
    where: { id },
  });

  if (!content) {
    redirect("/admin/content");
  }

  // Transform null to undefined for the form
  const formContent = {
    id: content.id,
    type: content.type,
    title: content.title ?? undefined,
    content: content.content ?? undefined,
    imageUrl: content.imageUrl ?? undefined,
    order: content.order,
    isActive: content.isActive,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ویرایش محتوا</h1>
        <p className="text-muted-foreground">ویرایش اطلاعات محتوا</p>
      </div>

      <ContentForm content={formContent} />
    </div>
  );
}

