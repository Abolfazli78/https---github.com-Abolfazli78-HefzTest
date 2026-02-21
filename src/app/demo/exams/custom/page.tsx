import { CustomExamBuilder } from "@/components/exams/CustomExamBuilder";

export default function DemoCustomExamPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ساخت آزمون دلخواه (دمو)</h1>
        <p className="text-gray-600">این صفحه نسخه دمو از سازنده آزمون است؛ مراحل غیرفعال‌اند.</p>
      </div>
      <CustomExamBuilder role="USER" demoMode />
    </div>
  );
}