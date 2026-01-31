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
import { AccessLevel, SelectionMode } from "@/generated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number;
  questionCount: number;
  accessLevel: AccessLevel;
  selectionMode: SelectionMode;
  year?: number;
  juz?: number;
  isActive: boolean;
  createdAt: Date;
  _count: {
    questions: number;
    examAttempts: number;
  };
}

interface ExamsTableProps {
  exams: Exam[];
}

export function ExamsTable({ exams }: ExamsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این آزمون مطمئن هستید؟")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/exams/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("خطا در حذف آزمون");
      }
    } catch (error) {
      alert("خطا در حذف آزمون");
    } finally {
      setDeletingId(null);
    }
  };

  const getSelectionModeLabel = (mode: SelectionMode) => {
    switch (mode) {
      case "YEAR":
        return "بر اساس سال";
      case "JUZ":
        return "بر اساس جزء";
      case "RANDOM":
        return "تصادفی";
      default:
        return mode;
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هنوز آزمونی وجود ندارد. یک آزمون جدید ایجاد کنید.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>عنوان</TableHead>
          <TableHead>مدت زمان (دقیقه)</TableHead>
          <TableHead>تعداد سوالات</TableHead>
          <TableHead>نوع انتخاب</TableHead>
          <TableHead>سطح دسترسی</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>آمار</TableHead>
          <TableHead className="text-left">عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.id}>
            <TableCell className="font-medium">{exam.title}</TableCell>
            <TableCell>{exam.duration}</TableCell>
            <TableCell>
              {exam._count.questions} / {exam.questionCount}
            </TableCell>
            <TableCell>
              {getSelectionModeLabel(exam.selectionMode)}
              {exam.year && ` (${exam.year})`}
              {exam.juz && ` (جزء ${exam.juz})`}
            </TableCell>
            <TableCell>
              <Badge variant={exam.accessLevel === "FREE" ? "default" : "secondary"}>
                {exam.accessLevel === "FREE" ? "رایگان" : "اشتراکی"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={exam.isActive ? "default" : "secondary"}>
                {exam.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {exam._count.examAttempts} آزمون
              </span>
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
                    <Link href={`/admin/exams/${exam.id}`} className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      مشاهده
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/exams/${exam.id}/edit`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4" />
                      ویرایش
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(exam.id)}
                    disabled={deletingId === exam.id}
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

