"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CorrectAnswer } from "@/generated";
import { Skeleton } from "@/components/ui/skeleton-loader";
import { ExamInterface } from "@/components/exam/exam-interface";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
}



import { use } from "react";

export default function ExamTakePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [exam, setExam] = useState<{ duration: number; questionCount: number } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, CorrectAnswer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load exam and start attempt
  useEffect(() => {
    const loadExam = async () => {
      try {
        const response = await fetch(`/api/exams/${params.id}`);
        const examData = await response.json();

        if (!response.ok) {
          router.push("/dashboard");
          return;
        }

        setExam(examData);

        // Start exam attempt
        const attemptResponse = await fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: params.id,
            questionCount: examData.questionCount,
          }),
        });

        const attemptData = await attemptResponse.json();

        if (attemptResponse.ok) {
          setAttemptId(attemptData.id);

          // Load questions based on selection mode
          const questionsResponse = await fetch(
            `/api/exams/${params.id}/questions?count=${examData.questionCount}`
          );
          const questionsData = await questionsResponse.json();

          if (questionsResponse.ok) {
            setQuestions(questionsData);
          }
        }
      } catch (error) {
        console.error("Error loading exam:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [params.id, router]);

  // Auto-save answers
  useEffect(() => {
    if (!attemptId || Object.keys(answers).length === 0) return;

    const autoSave = async () => {
      try {
        await fetch(`/api/attempts/${attemptId}/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
      } catch (error) {
        console.error("Error auto-saving:", error);
      }
    };

    const timeoutId = setTimeout(autoSave, 2000); // Debounce 2 seconds
    return () => clearTimeout(timeoutId);
  }, [answers, attemptId]);

  // Prevent refresh abuse
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (attemptId && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [attemptId, isSubmitting]);

  const handleAnswerChange = (questionId: string, answer: CorrectAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleAutoSubmit = async () => {
    if (!attemptId || isSubmitting) return;

    setIsSubmitting(true);
    await submitExam();
  };

  const submitExam = async () => {
    if (!attemptId) return;

    try {
      const response = await fetch(`/api/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        router.push(`/exams/${params.id}/results`);
      } else {
        alert("خطا در ارسال آزمون");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("خطا در ارسال آزمون");
      setIsSubmitting(false);
    }
  };



  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-screen gap-4">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex gap-4 w-full">
          <Skeleton className="h-12 w-1/3 rounded-lg" />
          <Skeleton className="h-12 w-1/3 rounded-lg" />
          <Skeleton className="h-12 w-1/3 rounded-lg" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>سوالی در دسترس نیست</p>
      </div>
    );
  }

  // Map answers from Record<string, CorrectAnswer> to Record<number, string>
  const mappedAnswers: Record<number, string> = {};
  questions.forEach((q, idx) => {
    if (answers[q.id]) {
      mappedAnswers[idx] = answers[q.id];
    }
  });

  const handleInterfaceAnswerChange = (index: number, value: string) => {
    const question = questions[index];
    if (question) {
      handleAnswerChange(question.id, value as CorrectAnswer);
    }
  };

  return (
    <ExamInterface
      questions={questions}
      durationMinutes={exam?.duration || 20}
      answers={mappedAnswers}
      onAnswerChange={handleInterfaceAnswerChange}
      onSubmit={handleAutoSubmit}
    />
  );
}
