"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CorrectAnswer } from "@/generated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  correctAnswer: CorrectAnswer;
  year?: number;
  juz?: number;
  topic?: string;
  difficultyLevel?: string;
  isActive: boolean;
  createdAt: Date;
}

interface QuestionsTableProps {
  questions: Question[];
}

export function QuestionsTable({ questions }: QuestionsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این سوال مطمئن هستید؟")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("خطا در حذف سوال");
      }
    } catch (error) {
      alert("خطا در حذف سوال");
    } finally {
      setDeletingId(null);
    }
  };

  const getAnswerLabel = (answer: CorrectAnswer) => {
    const labels = {
      A: "أ",
      B: "ب",
      C: "ج",
      D: "د",
    };
    return labels[answer];
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هنوز سوالی وجود ندارد. یک سوال جدید اضافه کنید یا از فایل وارد کنید.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[400px]">سوال</TableHead>
          <TableHead>پاسخ صحیح</TableHead>
          <TableHead>سال</TableHead>
          <TableHead>جزء</TableHead>
          <TableHead>موضوع</TableHead>
          <TableHead>سطح دشواری</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell className="max-w-[400px]">
              <div className="truncate arabic-text" title={question.questionText}>
                {question.questionText}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="default">{getAnswerLabel(question.correctAnswer)}</Badge>
            </TableCell>
            <TableCell>{question.year || "-"}</TableCell>
            <TableCell>{question.juz ? `جزء ${question.juz}` : "-"}</TableCell>
            <TableCell>{question.topic || "-"}</TableCell>
            <TableCell>{question.difficultyLevel || "-"}</TableCell>
            <TableCell>
              <Badge variant={question.isActive ? "default" : "secondary"}>
                {question.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/questions/${question.id}`} className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      مشاهده
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/questions/${question.id}/edit`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(question.id)}
                    disabled={deletingId === question.id}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

