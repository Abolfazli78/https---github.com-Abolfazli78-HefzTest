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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CorrectAnswer, QuestionKind } from "@/generated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { RenderText } from "@/components/RenderText";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";

interface SortConfig {
  column: string;
  direction: SortDirection;
}

interface QuestionsFilterDto {
  year?: (number | string)[];
  juz?: (number | string)[];
  topic?: string[];
  difficultyLevel?: string[];
  questionKind?: string[];
  isActive?: (boolean | string)[];
}

interface Question {
  id: string;
  questionText: string;
  correctAnswer: CorrectAnswer;
  year?: number;
  juz?: number;
  topic?: string;
  difficultyLevel?: string;
  questionKind?: QuestionKind;
  isActive: boolean;
  createdAt: Date;
}

interface QuestionsTableProps {
  questions: Question[];
  sort?: SortConfig | null;
  filters?: QuestionsFilterDto | null;
  onSortChange?: (sort: SortConfig | null) => void;
  onFiltersChange?: (filters: QuestionsFilterDto) => void;
}

export function QuestionsTable({
  questions,
  sort,
  filters,
  onSortChange,
  onFiltersChange,
}: QuestionsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getQuestionKindLabel = (kind?: QuestionKind) => {
    if (kind === QuestionKind.MEMORIZATION) return "حفظ";
    if (kind === QuestionKind.CONCEPTS) return "مفاهیم";
    return "مفاهیم";
  };

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

  const handleSortClick = (column: string) => {
    if (!onSortChange) return;

    if (!sort || sort.column !== column) {
      onSortChange({ column, direction: "asc" });
    } else if (sort.direction === "asc") {
      onSortChange({ column, direction: "desc" });
    } else {
      onSortChange(null);
    }
  };

  const isSortedBy = (column: string, direction: SortDirection) =>
    sort?.column === column && sort.direction === direction;

  const hasActiveFilter = (key: keyof QuestionsFilterDto): boolean => {
    if (!filters) return false;
    const value = filters[key];
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  };

  const handleFilterUpdate = (key: keyof QuestionsFilterDto, value: any) => {
    if (!onFiltersChange) return;
    const current = filters || {};
    const next: QuestionsFilterDto = { ...current };

    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (next as any)[key];
    } else {
      (next as any)[key] = value;
    }

    onFiltersChange(next);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        هنوز سوالی وجود ندارد. یک سوال جدید اضافه کنید یا از فایل وارد کنید.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table style={{ tableLayout: 'fixed' }}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] px-3 py-2 text-right text-xs font-medium">
              سوال
            </TableHead>
            <TableHead className="w-[100px] px-3 py-2 text-center text-xs font-medium">
              پاسخ صحیح
            </TableHead>
            <TableHead className="w-[80px] px-3 py-2 text-center text-xs font-medium">
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("year")}
                >
                  <span>سال</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("year", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("year", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("year")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <div className="px-2 py-1.5 space-y-2 text-xs">
                      <div className="font-medium">فیلتر سال</div>
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="h-8 text-xs"
                        placeholder="مثال: ۱۴۰۲"
                        value={
                          filters?.year && filters.year[0] !== undefined
                            ? String(filters.year[0])
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          handleFilterUpdate(
                            "year",
                            value ? [value] : []
                          );
                        }}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[80px] px-3 py-2 text-center text-xs font-medium">
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("juz")}
                >
                  <span>جزء</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("juz", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("juz", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("juz")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <div className="px-2 py-1.5 space-y-2 text-xs">
                      <div className="font-medium">فیلتر جزء</div>
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={30}
                        className="h-8 text-xs"
                        placeholder="مثال: ۱"
                        value={
                          filters?.juz && filters.juz[0] !== undefined
                            ? String(filters.juz[0])
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          handleFilterUpdate(
                            "juz",
                            value ? [value] : []
                          );
                        }}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[120px] px-3 py-2 text-right text-xs font-medium">
              <div className="flex items-center justify-between gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("topic")}
                >
                  <span>سوره</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("topic", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("topic", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("topic")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    <div className="px-2 py-1.5 space-y-2 text-xs">
                      <div className="font-medium">فیلتر سوره</div>
                      <Input
                        className="h-8 text-xs"
                        placeholder="نام سوره..."
                        value={
                          filters?.topic && filters.topic[0]
                            ? filters.topic[0]
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          handleFilterUpdate(
                            "topic",
                            value ? [value] : []
                          );
                        }}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[100px] px-3 py-2 text-center text-xs font-medium">
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("difficultyLevel")}
                >
                  <span>سطح سختی</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("difficultyLevel", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("difficultyLevel", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("difficultyLevel")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    <div className="px-1 py-1 text-xs">
                      <div className="font-medium px-1 mb-1">
                        فیلتر سطح سختی
                      </div>
                      <DropdownMenuCheckboxItem
                        checked={
                          !filters?.difficultyLevel ||
                          filters.difficultyLevel.length === 0
                        }
                        onCheckedChange={() =>
                          handleFilterUpdate("difficultyLevel", [])
                        }
                      >
                        همه سطوح
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.difficultyLevel?.includes("آسان") ??
                          false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            filters?.difficultyLevel ?? []
                          );
                          if (checked) {
                            current.add("آسان");
                          } else {
                            current.delete("آسان");
                          }
                          handleFilterUpdate(
                            "difficultyLevel",
                            Array.from(current)
                          );
                        }}
                      >
                        آسان
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.difficultyLevel?.includes("Medium") ??
                          false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            filters?.difficultyLevel ?? []
                          );
                          if (checked) {
                            current.add("Medium");
                          } else {
                            current.delete("Medium");
                          }
                          handleFilterUpdate(
                            "difficultyLevel",
                            Array.from(current)
                          );
                        }}
                      >
                        Medium
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.difficultyLevel?.includes("سخت") ??
                          false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            filters?.difficultyLevel ?? []
                          );
                          if (checked) {
                            current.add("سخت");
                          } else {
                            current.delete("سخت");
                          }
                          handleFilterUpdate(
                            "difficultyLevel",
                            Array.from(current)
                          );
                        }}
                      >
                        سخت
                      </DropdownMenuCheckboxItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[100px] px-3 py-2 text-center text-xs font-medium">
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("questionKind")}
                >
                  <span>نوع سوال</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("questionKind", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("questionKind", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("questionKind")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <div className="px-1 py-1 text-xs">
                      <div className="font-medium px-1 mb-1">
                        فیلتر نوع سوال
                      </div>
                      <DropdownMenuCheckboxItem
                        checked={
                          !filters?.questionKind ||
                          filters.questionKind.length === 0
                        }
                        onCheckedChange={() =>
                          handleFilterUpdate("questionKind", [])
                        }
                      >
                        همه انواع
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.questionKind?.includes(
                            QuestionKind.MEMORIZATION
                          ) ?? false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            filters?.questionKind ?? []
                          );
                          if (checked) {
                            current.add(QuestionKind.MEMORIZATION);
                          } else {
                            current.delete(QuestionKind.MEMORIZATION);
                          }
                          handleFilterUpdate(
                            "questionKind",
                            Array.from(current)
                          );
                        }}
                      >
                        حفظ
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.questionKind?.includes(
                            QuestionKind.CONCEPTS
                          ) ?? false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            filters?.questionKind ?? []
                          );
                          if (checked) {
                            current.add(QuestionKind.CONCEPTS);
                          } else {
                            current.delete(QuestionKind.CONCEPTS);
                          }
                          handleFilterUpdate(
                            "questionKind",
                            Array.from(current)
                          );
                        }}
                      >
                        مفاهیم
                      </DropdownMenuCheckboxItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[80px] px-3 py-2 text-center text-xs font-medium">
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium"
                  onClick={() => handleSortClick("isActive")}
                >
                  <span>وضعیت</span>
                  <span className="flex flex-col leading-none">
                    <ChevronUp
                      className={cn(
                        "h-3 w-3",
                        isSortedBy("isActive", "asc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 -mt-1",
                        isSortedBy("isActive", "desc")
                          ? "text-blue-600"
                          : "text-muted-foreground/60"
                      )}
                    />
                  </span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 p-0"
                    >
                      <Filter
                        className={cn(
                          "h-3 w-3",
                          hasActiveFilter("isActive")
                            ? "text-blue-600"
                            : "text-muted-foreground/70"
                        )}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-36">
                    <div className="px-1 py-1 text-xs">
                      <div className="font-medium px-1 mb-1">
                        فیلتر وضعیت
                      </div>
                      <DropdownMenuCheckboxItem
                        checked={
                          !filters?.isActive ||
                          filters.isActive.length === 0
                        }
                        onCheckedChange={() =>
                          handleFilterUpdate("isActive", [])
                        }
                      >
                        همه
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.isActive?.includes(true) ?? false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            (filters?.isActive ?? []).map((v) =>
                              typeof v === "string"
                                ? v === "true" ||
                                  v === "1" ||
                                  v === "ACTIVE"
                                : v
                            )
                          );
                          if (checked) {
                            current.add(true);
                          } else {
                            current.delete(true);
                          }
                          handleFilterUpdate(
                            "isActive",
                            Array.from(current)
                          );
                        }}
                      >
                        فعال
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={
                          filters?.isActive?.includes(false) ?? false
                        }
                        onCheckedChange={(checked) => {
                          const current = new Set(
                            (filters?.isActive ?? []).map((v) =>
                              typeof v === "string"
                                ? v === "true" ||
                                  v === "1" ||
                                  v === "ACTIVE"
                                : v
                            )
                          );
                          if (checked) {
                            current.add(false);
                          } else {
                            current.delete(false);
                          }
                          handleFilterUpdate(
                            "isActive",
                            Array.from(current)
                          );
                        }}
                      >
                        غیرفعال
                      </DropdownMenuCheckboxItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead className="w-[80px] px-3 py-2 text-left text-xs font-medium">
              عملیات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} className="hover:bg-muted/50">
              <TableCell className="px-3 py-2">
                <div 
                  className="truncate text-sm" 
                  title={question.questionText}
                >
                  <RenderText text={question.questionText} />
                </div>
              </TableCell>
              <TableCell className="px-3 py-2 text-center">
                <Badge variant="default" className="text-xs">{getAnswerLabel(question.correctAnswer)}</Badge>
              </TableCell>
              <TableCell className="px-3 py-2 text-center text-sm">{question.year || "-"}</TableCell>
              <TableCell className="px-3 py-2 text-center text-sm">{question.juz ? `جزء ${question.juz}` : "-"}</TableCell>
              <TableCell className="px-3 py-2">
                <div 
                  className="truncate text-sm" 
                  title={question.topic}
                >
                  {question.topic || "-"}
                </div>
              </TableCell>
              <TableCell className="px-3 py-2 text-center">
                {question.difficultyLevel ? (
                  <Badge 
                    variant={
                      question.difficultyLevel === 'آسان' ? 'secondary' :
                      question.difficultyLevel === 'متوسط' ? 'default' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {question.difficultyLevel}
                  </Badge>
                ) : "-"}
              </TableCell>
              <TableCell className="px-3 py-2 text-center text-sm">{getQuestionKindLabel(question.questionKind)}</TableCell>
              <TableCell className="px-3 py-2 text-center">
                <Badge 
                  variant={question.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {question.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </TableCell>
              <TableCell className="px-3 py-2 text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </div>
  );
}

