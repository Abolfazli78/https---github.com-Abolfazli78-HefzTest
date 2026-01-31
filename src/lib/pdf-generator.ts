import jsPDF from "jspdf";
import type { ExamAttempt, ExamAnswer, Question } from "@/generated/browser";

interface ExamAttemptWithDetails extends ExamAttempt {
  exam: {
    title: string;
  };
  examAnswers: (ExamAnswer & {
    question: Question;
  })[];
  user: {
    name: string;
  };
}

export async function generateExamReportPDF(attempt: ExamAttemptWithDetails): Promise<Blob> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set RTL direction
  doc.setR2L(true);

  // Title
  doc.setFontSize(20);
  doc.text("گزارش آزمون", 105, 20, { align: "center" });

  // Exam info
  doc.setFontSize(14);
  doc.text(`آزمون: ${attempt.exam.title}`, 20, 35);
  doc.text(`نام: ${attempt.user.name}`, 20, 42);
  doc.text(
    `تاریخ: ${new Date(attempt.submittedAt || attempt.startedAt).toLocaleDateString("fa-IR")}`,
    20,
    49
  );

  // Score summary
  doc.setFontSize(16);
  doc.text("خلاصه نتایج", 20, 60);
  doc.setFontSize(12);
  const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
  doc.text(`امتیاز: ${attempt.score} از ${attempt.totalQuestions}`, 20, 70);
  doc.text(`درصد: ${percentage}%`, 20, 77);
  doc.text(`پاسخ‌های صحیح: ${attempt.correctAnswers}`, 20, 84);
  doc.text(`پاسخ‌های غلط: ${attempt.wrongAnswers}`, 20, 91);
  doc.text(`بدون پاسخ: ${attempt.unanswered}`, 20, 98);

  // Questions and answers
  let yPos = 110;
  doc.setFontSize(14);
  doc.text("جزئیات پاسخ‌ها", 20, yPos);
  yPos += 10;

  doc.setFontSize(10);
  attempt.examAnswers.forEach((answer, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    const question = answer.question;
    const isCorrect = answer.isCorrect;
    const userAnswer = answer.selectedAnswer;

    // Question number and text
    doc.setFontSize(11);
    doc.text(`سوال ${index + 1}:`, 20, yPos);
    yPos += 7;

    // Question text (Arabic)
    doc.setFontSize(10);
    const questionLines = doc.splitTextToSize(question.questionText, 170);
    questionLines.forEach((line: string) => {
      doc.text(line, 25, yPos);
      yPos += 5;
    });

    // Options
    yPos += 2;
    doc.setFontSize(9);
    doc.text(`الف) ${question.optionA}`, 30, yPos);
    yPos += 5;
    doc.text(`ب) ${question.optionB}`, 30, yPos);
    yPos += 5;
    doc.text(`ج) ${question.optionC}`, 30, yPos);
    yPos += 5;
    doc.text(`د) ${question.optionD}`, 30, yPos);
    yPos += 5;

    // User answer and correct answer
    doc.setFontSize(10);
    const answerLabels: Record<string, string> = {
      A: "الف",
      B: "ب",
      C: "ج",
      D: "د",
    };

    if (isCorrect) {
      doc.setTextColor(0, 128, 0);
    } else {
      doc.setTextColor(255, 0, 0);
    }
    doc.text(
      `پاسخ شما: ${userAnswer ? answerLabels[userAnswer] : "بدون پاسخ"}`,
      30,
      yPos
    );
    yPos += 5;

    doc.setTextColor(0, 0, 255);
    doc.text(`پاسخ صحیح: ${answerLabels[question.correctAnswer]}`, 30, yPos);
    yPos += 5;

    if (question.explanation) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      const explanationLines = doc.splitTextToSize(`توضیح: ${question.explanation}`, 170);
      explanationLines.forEach((line: string) => {
        doc.text(line, 30, yPos);
        yPos += 4;
      });
    }

    yPos += 5;
    doc.setTextColor(0, 0, 0);
  });

  // Generate blob
  const pdfBlob = doc.output("blob");
  return pdfBlob;
}

