import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { ExamForm } from "@/components/admin/exam-form";

export default async function InstituteNewExamPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "INSTITUTE") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ایجاد آزمون جدید موسسه</h1>
        <p className="text-muted-foreground">با تنظیمات زیر آزمون ایجاد کنید. در صورت تعیین مهلت پایان، نیاز به اشتراک فعال دارید.</p>
      </div>

      <ExamForm redirectPath="/institute/exams" />
    </div>
  );
}
