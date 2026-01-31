"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseWordFile } from "@/lib/parsers/word";
import { parseExcelFile } from "@/lib/parsers/excel";
import { ParsedQuestion } from "@/types";
import { QuestionPreview } from "@/components/admin/question-preview";
import { QuestionImport } from "@/components/admin/question-import";
import { Button } from "@/components/ui/button";

export default function ImportQuestionsPage() {
  const router = useRouter();
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError("");
    setParsedQuestions([]);
    setProgress(10);

    try {
      const file = files[0]; // Process first file for now
      let questions: ParsedQuestion[] = [];

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      if (file.name.endsWith(".docx")) {
        questions = await parseWordFile(file);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        questions = await parseExcelFile(file);
      } else {
        clearInterval(progressInterval);
        setError("نوع فایل پشتیبانی نمی‌شود. لطفاً از فایل Word (.docx) یا Excel (.xlsx) استفاده کنید");
        setIsProcessing(false);
        return;
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (questions.length === 0) {
        setError("هیچ سوالی در فایل یافت نشد. لطفاً فرمت فایل را بررسی کنید");
      } else {
        setParsedQuestions(questions);
      }
    } catch (err) {
      console.error("Error parsing file:", err);
      setError("خطا در خواندن فایل. لطفاً فرمت فایل را بررسی کنید");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleImport = async () => {
    if (parsedQuestions.length === 0) return;

    setIsImporting(true);
    setError("");

    try {
      const response = await fetch("/api/questions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: parsedQuestions }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "خطا در واردات سوالات");
        setIsImporting(false);
      } else {
        router.push("/admin/questions?imported=true");
      }
    } catch {
      setError("خطا در واردات سوالات");
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">واردات سوالات</h1>
        <p className="text-muted-foreground">واردات سوالات از فایل Word یا Excel</p>
      </div>

      <Card className="mb-8 border-none shadow-md">
        <CardHeader>
          <CardTitle>آپلود فایل</CardTitle>
          <CardDescription>
            فایل Word (.docx) یا Excel (.xlsx) را برای واردات سوالات انتخاب کنید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionImport
            onUpload={handleUpload}
            isUploading={isProcessing}
            progress={progress}
          />

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {parsedQuestions.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {parsedQuestions.length} سوال یافت شد
            </p>
            <Button onClick={handleImport} disabled={isImporting} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all">
              {isImporting ? "در حال واردات..." : "تایید و واردات سوالات"}
            </Button>
          </div>

          <QuestionPreview questions={parsedQuestions} />
        </div>
      )}
    </div>
  );
}
