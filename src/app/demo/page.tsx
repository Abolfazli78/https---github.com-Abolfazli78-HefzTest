import type { Metadata } from "next";
import { db } from "@/lib/db";
import DemoExam from "@/components/demo/DemoExam";
import { CustomExamBuilder } from "@/components/exams/CustomExamBuilder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "دمو ساخت آزمون دلخواه | حفظ تست",
  description: "دموی ساخت آزمون دلخواه برای تمرین حفظ قرآن: انتخاب جزء، سال، تعداد سوال و تجربه نزدیک به آزمون رسمی.",
  alternates: {
    canonical: "https://hefztest.ir/demo",
  },
};

export default async function DemoUnifiedPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const searchParams = await props.searchParams;
  const takeParam = Array.isArray(searchParams?.take) ? searchParams.take[0] : (searchParams?.take as string | undefined);
  const take = takeParam === "1";

  if (take) {
    const yearParam = Array.isArray(searchParams.year) ? searchParams.year[0] : (searchParams.year as string | undefined);
    const year = parseInt(yearParam || "1404", 10);
    const countParam = Array.isArray(searchParams.count) ? searchParams.count[0] : (searchParams.count as string | undefined);
    const count = Math.min(25, Math.max(1, parseInt(countParam || "25", 10)));
    const juzParam = Array.isArray(searchParams.juz) ? searchParams.juz[0] : (searchParams.juz as string | undefined);
    const topicsParam = Array.isArray(searchParams.topic) ? searchParams.topic[0] : (searchParams.topic as string | undefined);
    const allowedJuz = (juzParam || "1,2,3,4,5")
      .split(",")
      .map((x: string) => parseInt(x, 10))
      .filter((x: number) => !Number.isNaN(x));
    const topics = (topicsParam || "")
      .split(",")
      .map((x: string) => x.trim())
      .filter((x: string) => !!x);

    const where: any = {
      isActive: true,
      year,
      juz: { in: allowedJuz },
    };
    if (topics.length > 0) {
      where.topic = { in: topics };
    }

    const questions = await db.question.findMany({
      where,
      orderBy: { id: "asc" },
      take: count,
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
      },
    });

    return <DemoExam questions={questions as any} />;
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ساخت آزمون دلخواه (دمو محدود)</h1>
        <p className="text-gray-600">برای استفاده آزمایشی می‌توانید جزء ۱ تا ۵ و سال ۱۴۰۴ را انتخاب کنید. تعداد سوال: ۲۵.</p>
      </div>
      <CustomExamBuilder role="USER" demoMode demoConfig={{ juzRange: [1, 5], year: "1404", questionCount: 25 }} />
      <Card>
        <CardHeader>
          <CardTitle>راهنما</CardTitle>
          <CardDescription>در مرحله نهایی، با کلیک روی ایجاد آزمون، دمو آغاز می‌شود و نتیجه محاسبه می‌گردد.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}
