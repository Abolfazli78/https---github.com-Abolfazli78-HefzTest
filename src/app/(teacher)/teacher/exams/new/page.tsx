import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { ExamForm } from "@/components/admin/exam-form";

export default async function TeacherNewExamPage() {
    const session = await getServerSession();

    if (!session || session.user.role !== "TEACHER") {
        redirect("/login");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">طراحی آزمون جدید</h1>
                <p className="text-muted-foreground">سوالات آزمون بر اساس تنظیمات شما به صورت خودکار از بانک سوالات انتخاب می‌شوند.</p>
            </div>

            <ExamForm redirectPath="/teacher/exams" />
        </div>
    );
}
