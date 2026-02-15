"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, PlusCircle, FileText } from "lucide-react";

export type UserExamItem = {
  id: string;
  title: string;
  juzStart: number;
  juzEnd: number;
  year: number | null;
  durationMinutes: number;
  totalQuestions: number;
  createdAt: string;
  _count?: { questions: number };
};

type UserSimulatorListProps = {
  basePath: string;
  subscriptionsPath: string;
  officialSimulatorPath: string;
  subscriptionInfo: { examSimulatorEnabled?: boolean } | null;
  loadingSubscription: boolean;
};

export function UserSimulatorList({
  basePath,
  subscriptionsPath,
  officialSimulatorPath,
  subscriptionInfo,
  loadingSubscription,
}: UserSimulatorListProps) {
  const [exams, setExams] = useState<UserExamItem[]>([]);
  const [loading, setLoading] = useState(true);

  const enabled = subscriptionInfo?.examSimulatorEnabled === true;

  useEffect(() => {
    if (!enabled && !loadingSubscription) {
      setLoading(false);
      return;
    }
    if (!enabled) return;
    fetch("/api/user-exams")
      .then((res) => (res.ok ? res.json() : []))
      .then(setExams)
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [enabled, loadingSubscription]);

  if (loadingSubscription || (enabled && loading)) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <p className="text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-md" dir="rtl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              شبیه‌ساز آزمون
            </CardTitle>
            <CardDescription>
              این قابلیت در پلن فعلی شما فعال نیست.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={subscriptionsPath}>
              <Button>ارتقاء پلن</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl" dir="rtl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <ClipboardCheck className="h-7 w-7" />
              شبیه‌ساز آزمون
            </h1>
            <p className="text-muted-foreground mt-1">
              آزمون‌های ساخته‌شده توسط شما و آزمون رسمی
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`${basePath}/new`}>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                آزمون جدید
              </Button>
            </Link>
            <Link href={officialSimulatorPath}>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                آزمون رسمی
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>آزمون‌های من</CardTitle>
            <CardDescription>
              لیست آزمون‌های شبیه‌سازی که ساخته‌اید
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground rounded-lg border border-dashed">
                <p className="mb-4">هنوز آزمونی نساخته‌اید.</p>
                <Link href={`${basePath}/new`}>
                  <Button variant="outline">ساخت اولین آزمون</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {exams.map((exam) => (
                  <li key={exam.id}>
                    <Link
                      href={`${basePath}/${exam.id}`}
                      className="block rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            جزء {exam.juzStart} تا {exam.juzEnd}
                            {exam.year != null ? ` · سال ${exam.year}` : ""}
                            {" · "}
                            {exam._count?.questions ?? exam.totalQuestions} سوال
                            {" · "}
                            {exam.durationMinutes} دقیقه
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          شروع آزمون
                        </Button>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
