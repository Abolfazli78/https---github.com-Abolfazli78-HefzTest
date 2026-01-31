"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ParsedQuestion } from "@/types";
import { CorrectAnswer } from "@/generated";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface QuestionPreviewProps {
  questions: ParsedQuestion[];
}

export function QuestionPreview({ questions }: QuestionPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>پیش‌نمایش سوالات</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {total}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
              disabled={currentIndex === total - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">سوال:</h3>
          <p className="arabic-text text-lg">{currentQuestion.questionText}</p>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold mb-2">گزینه‌ها:</h3>
          <div className="space-y-2">
            <div className={`p-3 rounded-md border ${currentQuestion.correctAnswer === CorrectAnswer.A ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
              <span className="font-semibold">أ) </span>
              <span className="arabic-text">{currentQuestion.optionA}</span>
              {currentQuestion.correctAnswer === CorrectAnswer.A && (
                <Badge className="mr-2" variant="default">صحیح</Badge>
              )}
            </div>
            <div className={`p-3 rounded-md border ${currentQuestion.correctAnswer === CorrectAnswer.B ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
              <span className="font-semibold">ب) </span>
              <span className="arabic-text">{currentQuestion.optionB}</span>
              {currentQuestion.correctAnswer === CorrectAnswer.B && (
                <Badge className="mr-2" variant="default">صحیح</Badge>
              )}
            </div>
            <div className={`p-3 rounded-md border ${currentQuestion.correctAnswer === CorrectAnswer.C ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
              <span className="font-semibold">ج) </span>
              <span className="arabic-text">{currentQuestion.optionC}</span>
              {currentQuestion.correctAnswer === CorrectAnswer.C && (
                <Badge className="mr-2" variant="default">صحیح</Badge>
              )}
            </div>
            <div className={`p-3 rounded-md border ${currentQuestion.correctAnswer === CorrectAnswer.D ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-muted"}`}>
              <span className="font-semibold">د) </span>
              <span className="arabic-text">{currentQuestion.optionD}</span>
              {currentQuestion.correctAnswer === CorrectAnswer.D && (
                <Badge className="mr-2" variant="default">صحیح</Badge>
              )}
            </div>
          </div>
        </div>

        {currentQuestion.explanation && (
          <div>
            <h3 className="font-semibold mb-2">توضیح:</h3>
            <p className="arabic-text text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {currentQuestion.year && (
            <Badge variant="outline">سال: {currentQuestion.year}</Badge>
          )}
          {currentQuestion.juz && (
            <Badge variant="outline">جزء: {currentQuestion.juz}</Badge>
          )}
          {currentQuestion.topic && (
            <Badge variant="outline">موضوع: {currentQuestion.topic}</Badge>
          )}
          {currentQuestion.difficultyLevel && (
            <Badge variant="outline">سطح دشواری: {currentQuestion.difficultyLevel}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

