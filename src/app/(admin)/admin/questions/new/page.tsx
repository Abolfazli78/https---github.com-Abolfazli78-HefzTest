import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { QuestionForm } from "@/components/admin/question-form";

export default async function NewQuestionPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">افزودن سوال جدید</h1>
        <p className="text-muted-foreground">اطلاعات سوال را وارد کنید</p>
      </div>

      <QuestionForm />
    </div>
  );
}

