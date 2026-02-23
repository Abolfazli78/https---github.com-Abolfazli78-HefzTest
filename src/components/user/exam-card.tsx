"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AccessLevel } from "@prisma/client";
import { Clock, FileText, ArrowLeft } from "lucide-react";
import { parseDescription } from "@/lib/exam-utils";

interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number;
  questionCount: number;
  accessLevel: AccessLevel;
}

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="rounded-2xl border-border/60 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3 mb-2">
          <CardTitle className="text-lg sm:text-xl line-clamp-1">{exam.title}</CardTitle>
          <Badge variant={exam.accessLevel === "FREE" ? "default" : "secondary"}>
            {exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی"}
          </Badge>
        </div>
        {(() => {
            const cleanDescription = parseDescription(exam.description || null);
            return cleanDescription !== "بدون توضیحات" ? (
                <CardDescription className="arabic-text text-sm leading-7">
                    {cleanDescription}
                </CardDescription>
            ) : null;
        })()}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{exam.duration} دقیقه</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{exam.questionCount} سوال</span>
          </div>
        </div>
        <Link href={`/exams/${exam.id}`}>
          <Button className="w-full rounded-xl">
            شروع آزمون
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

