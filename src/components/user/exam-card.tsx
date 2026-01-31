"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AccessLevel } from "@/generated";
import { Clock, FileText, ArrowLeft } from "lucide-react";

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl">{exam.title}</CardTitle>
          <Badge variant={exam.accessLevel === "FREE" ? "default" : "secondary"}>
            {exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی"}
          </Badge>
        </div>
        {exam.description && (
          <CardDescription className="arabic-text">
            {exam.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
          <Button className="w-full">
            شروع آزمون
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

