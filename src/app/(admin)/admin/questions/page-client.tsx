"use client";

import { useState, useEffect, useMemo } from "react";
import { QuestionsTable } from "@/components/admin/questions-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { CorrectAnswer, QuestionKind } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface QuestionsFilterDto {
  year?: (number | string)[];
  juz?: (number | string)[];
  topic?: string[];
  difficultyLevel?: string[];
  questionKind?: string[];
  isActive?: (boolean | string)[];
}

export default function QuestionsPageClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const currentSort: SortConfig | null = useMemo(() => {
    const sortParam = searchParams.get("sort");
    if (!sortParam) return null;
    try {
      const parsed = JSON.parse(sortParam) as SortConfig;
      if (
        parsed &&
        typeof parsed.column === "string" &&
        (parsed.direction === "asc" || parsed.direction === "desc")
      ) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }, [searchString, searchParams]);

  const currentFilters: QuestionsFilterDto | null = useMemo(() => {
    const filtersParam = searchParams.get("filters");
    if (!filtersParam) return null;
    try {
      return JSON.parse(filtersParam) as QuestionsFilterDto;
    } catch {
      return null;
    }
  }, [searchString, searchParams]);

  const fetchQuestions = async (
    page: number,
    pageSize: number,
    sort: SortConfig | null,
    filters: QuestionsFilterDto | null
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());

      if (sort) {
        params.set("sort", JSON.stringify(sort));
      }

      if (filters && Object.keys(filters).length > 0) {
        params.set("filters", JSON.stringify(filters));
      }

      const response = await fetch(`/api/questions?${params.toString()}`);
      if (!response.ok) {
        throw new Error("خطا در دریافت سوالات");
      }

      const data = await response.json();
      
      // Transform the data to match the component interface
      const transformedQuestions = data.questions.map((q: any) => ({
        id: q.id,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        year: q.year ?? undefined,
        juz: q.juz ?? undefined,
        topic: q.topic ?? undefined,
        difficultyLevel: q.difficultyLevel ?? undefined,
        questionKind: q.questionKind ?? undefined,
        isActive: q.isActive,
        createdAt: new Date(q.createdAt),
      }));

      setQuestions(transformedQuestions);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("خطا در دریافت سوالات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const page = parseInt(params.get("page") || "1");
    const pageSize = parseInt(params.get("pageSize") || "50");

    fetchQuestions(page, pageSize, currentSort, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  const updateQuery = (options: {
    page?: number;
    sort?: SortConfig | null;
    filters?: QuestionsFilterDto | null;
    resetPage?: boolean;
  }) => {
    const params = new URLSearchParams(searchString);

    const pageSize = params.get("pageSize") || pagination.pageSize.toString();
    params.set("pageSize", pageSize);

    if (options.page !== undefined) {
      params.set("page", options.page.toString());
    } else if (options.resetPage) {
      params.set("page", "1");
    } else if (!params.get("page")) {
      params.set("page", "1");
    }

    const sortToUse =
      options.sort !== undefined ? options.sort : currentSort;
    const filtersToUse =
      options.filters !== undefined ? options.filters : currentFilters;

    if (sortToUse) {
      params.set("sort", JSON.stringify(sortToUse));
    } else {
      params.delete("sort");
    }

    if (filtersToUse && Object.keys(filtersToUse).length > 0) {
      params.set("filters", JSON.stringify(filtersToUse));
    } else {
      params.delete("filters");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      updateQuery({ page: newPage });
    }
  };

  const handleSortChange = (sort: SortConfig | null) => {
    updateQuery({ sort, resetPage: true });
  };

  const handleFiltersChange = (filters: QuestionsFilterDto) => {
    updateQuery({ filters, resetPage: true });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت سوالات</h1>
          <p className="text-muted-foreground">مدیریت و واردات سوالات</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/import">
            <Button variant="outline">واردات از فایل</Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button>افزودن سوال جدید</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>لیست سوالات</CardTitle>
          <CardDescription>
            مجموع سوالات: {pagination.total} (صفحه {pagination.page} از {pagination.totalPages})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <QuestionsTable
                questions={questions}
                sort={currentSort || undefined}
                filters={currentFilters || undefined}
                onSortChange={handleSortChange}
                onFiltersChange={handleFiltersChange}
              />
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  نمایش {pagination.total === 0 ? 0 : ((pagination.page - 1) * pagination.pageSize) + 1} تا{" "}
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} از {pagination.total} سوال
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext || loading}
                  >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
