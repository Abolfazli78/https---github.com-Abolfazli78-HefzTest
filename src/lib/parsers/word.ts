import mammoth from "mammoth";
import { ParsedQuestion } from "@/types";
import { CorrectAnswer } from "@prisma/client";

export async function parseWordFile(file: File): Promise<ParsedQuestion[]> {
  const arrayBuffer = await file.arrayBuffer();

  // Map highlights to classes we can detect
  const options = {
    styleMap: [
      "highlight:green => span.correct-answer-green",
      "highlight:lime => span.correct-answer-green",
      "highlight:yellow => span.highlight-yellow",
      "highlight:red => span.highlight-red",
      "highlight:cyan => span.highlight-cyan",
      "highlight:magenta => span.highlight-magenta",
      "highlight:blue => span.highlight-blue",
    ]
  };

  const result = await mammoth.convertToHtml({ arrayBuffer }, options);
  const html = result.value;

  // Split into blocks based on paragraphs
  // Mammoth outputs <p>...</p> for paragraphs
  const paragraphs = html.match(/<p>.*?<\/p>/g) || [];

  const questions: ParsedQuestion[] = [];
  let currentQuestion: Partial<ParsedQuestion> & { options?: string[], correctOptionIndex?: number } = {};
  let collectingOptions = false;

  // Helper to clean HTML tags
  const cleanText = (htmlStr: string) => {
    return htmlStr.replace(/<[^>]+>/g, "").trim();
  };

  // Helper to check if a string contains the correct answer marker
  const hasGreenHighlight = (htmlStr: string) => {
    return htmlStr.includes('class="correct-answer-green"');
  };

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const text = cleanText(p);

    if (!text) continue;

    // Detect if this is a new question (starts with number)
    const isNewQuestion = /^\d+[\.\)\-]/.test(text) || /^سوال\s*\d+/.test(text);

    if (isNewQuestion) {
      // Save previous question if valid
      if (currentQuestion.questionText && currentQuestion.options && currentQuestion.options.length >= 4) {
        questions.push(finalizeQuestion(currentQuestion));
      }

      // Start new question
      currentQuestion = {
        questionText: text.replace(/^\d+[\.\)\-]\s*/, "").trim(),
        options: [],
        correctOptionIndex: -1
      };
      collectingOptions = true;
    } else if (collectingOptions) {
      // Check if it's an option
      const isOption = /^[أإا-دA-D][\.\)\-]/.test(text) || /^گزینه/.test(text);

      if (isOption || (currentQuestion.options && currentQuestion.options.length < 4)) {
        // It's likely an option
        const isCorrect = hasGreenHighlight(p);
        if (isCorrect) {
          currentQuestion.correctOptionIndex = currentQuestion.options!.length;
        }

        // Clean option text (remove A) B) etc)
        const cleanOption = text.replace(/^[أإا-دA-D][\.\)\-]\s*/, "").trim();
        if (!currentQuestion.options) currentQuestion.options = [];
        currentQuestion.options.push(cleanOption);
      } else {
        // Maybe explanation or extra text
        if (!currentQuestion.explanation) {
          currentQuestion.explanation = text;
        } else {
          currentQuestion.explanation += "\n" + text;
        }
      }
    }
  }

  // Add last question
  if (currentQuestion.questionText && currentQuestion.options && currentQuestion.options.length >= 4) {
    questions.push(finalizeQuestion(currentQuestion));
  }

  return questions;
}

function finalizeQuestion(q: { questionText?: string; options?: string[]; correctOptionIndex?: number; explanation?: string }): ParsedQuestion {
  const options = q.options || [];
  let correctAnswer: CorrectAnswer = CorrectAnswer.A;

  if (q.correctOptionIndex !== -1) {
    switch (q.correctOptionIndex) {
      case 0: correctAnswer = CorrectAnswer.A; break;
      case 1: correctAnswer = CorrectAnswer.B; break;
      case 2: correctAnswer = CorrectAnswer.C; break;
      case 3: correctAnswer = CorrectAnswer.D; break;
    }
  }

  return {
    questionText: q.questionText || "",
    optionA: options[0] || "",
    optionB: options[1] || "",
    optionC: options[2] || "",
    optionD: options[3] || "",
    correctAnswer,
    explanation: q.explanation
  };
}
