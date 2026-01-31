import { UserRole, AccessLevel, SelectionMode, CorrectAnswer, AttemptStatus, TicketStatus, ContentType } from "@/generated";

export type { UserRole, AccessLevel, SelectionMode, CorrectAnswer, AttemptStatus, TicketStatus, ContentType };

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
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
  updatedAt: Date;
}

export interface Question {
  id: string;
  examId?: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  year?: number;
  juz?: number;
  topic?: string;
  difficultyLevel?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  startedAt: Date;
  submittedAt?: Date;
  timeSpent?: number;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  status: AttemptStatus;
}

export interface ExamAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer?: CorrectAnswer;
  isCorrect?: boolean;
  answeredAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category?: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId?: string;
  message: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface HomepageContent {
  id: string;
  type: ContentType;
  title?: string;
  content?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  year?: number;
  juz?: number;
  topic?: string;
  difficultyLevel?: string;
}

