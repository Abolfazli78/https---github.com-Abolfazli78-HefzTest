import * as XLSX from "xlsx";
import { ParsedQuestion } from "@/types";
import { CorrectAnswer } from "@/generated";

// Normalize Persian characters (Kaf/Yeh)
function normalizePersianText(text: string): string {
  if (!text) return "";
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .trim();
}

interface ExcelRow {
  A?: string | number;
  B?: string | number;
  C?: string | number;
  D?: string | number;
  E?: string | number;
  F?: string | number;
  G?: string | number;
  H?: string | number;
  I?: string | number;
  J?: string | number;
}

export async function parseExcelFile(file: File): Promise<ParsedQuestion[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Expecting data from Row 3+ (Index 2), utilizing A-J columns
  const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { header: "A", range: 2 });

  const questions: ParsedQuestion[] = [];
  const seenQuestions = new Set<string>();

  for (const row of data) {
    try {
      // Validate row has essential data
      if (!row["E"] || !row["F"] || !row["G"] || !row["H"] || !row["I"] || !row["J"]) {
        continue;
      }

      const questionText = normalizePersianText(row["E"].toString());

      // Prevent duplicates
      if (seenQuestions.has(questionText)) {
        console.warn(`Duplicate question found: ${questionText}`);
        continue;
      }
      seenQuestions.add(questionText);

      const optionA = normalizePersianText(row["F"].toString());
      const optionB = normalizePersianText(row["G"].toString());
      const optionC = normalizePersianText(row["H"].toString());
      const optionD = normalizePersianText(row["I"].toString());

      // Column J: 1-4 mapping to Enum
      let correctAnswer: CorrectAnswer;
      const answerRaw = row["J"].toString().trim();

      switch (answerRaw) {
        case "1":
          correctAnswer = CorrectAnswer.A;
          break;
        case "2":
          correctAnswer = CorrectAnswer.B;
          break;
        case "3":
          correctAnswer = CorrectAnswer.C;
          break;
        case "4":
          correctAnswer = CorrectAnswer.D;
          break;
        default:
          // Fallback or skip if invalid answer
          console.warn(`Invalid answer format for question: ${questionText}`);
          continue;
      }

      // Column A: Year
      const year = row["A"] ? parseInt(row["A"].toString()) : undefined;

      // Column B: Juz
      const juz = row["B"] ? parseInt(row["B"].toString()) : undefined;

      // Column C: Topic (Surah)
      const topic = row["C"] ? normalizePersianText(row["C"].toString()) : undefined;

      // Column D: Ayah Number -> Explanation context
      const ayahNumber = row["D"] ? row["D"].toString() : "";
      const explanation = ayahNumber ? `شماره آیه: ${ayahNumber}` : undefined;

      questions.push({
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        year,
        juz,
        topic,
        difficultyLevel: "Medium", // Default
      });

    } catch (error) {
      console.error("Error parsing Excel row:", error);
    }
  }

  return questions;
}

