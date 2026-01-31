import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { ExamForm } from "@/components/admin/exam-form";

export default async function NewExamPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ایجاد آزمون جدید</h1>
        <p className="text-muted-foreground">اطلاعات زیر را پر کنید</p>
      </div>

      <ExamForm />
    </div>
  );
}

