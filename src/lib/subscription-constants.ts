// Feature constants for client-side use - no server imports
export const FEATURES = {
  // Student features
  BASIC_EXAMS: "basic_exams",
  PERFORMANCE_TRACKING: "performance_tracking",
  LEADERBOARD_ACCESS: "leaderboard_access",
  UNLIMITED_EXAMS: "unlimited_exams",
  ADVANCED_ANALYTICS: "advanced_analytics",
  
  // Teacher features
  EXAM_CREATION: "exam_creation",
  STUDENT_MANAGEMENT: "student_management",
  QUESTION_BANK_ACCESS: "question_bank_access",
  CUSTOM_EXAMS: "custom_exams",
  TICKET_SUPPORT: "ticket_support",
  CUSTOM_THEMES: "custom_themes",
  
  // Institute features
  TEACHER_MANAGEMENT: "teacher_management",
  WHITE_LABEL: "white_label",
  BULK_OPERATIONS: "bulk_operations",
  PRIORITY_SUPPORT: "priority_support",
  UNLIMITED_EVERYTHING: "unlimited_everything",
  DEDICATED_SUPPORT: "dedicated_support",
} as const;

// Quota constants for client-side use
export const QUOTAS = {
  MAX_EXAMS_PER_MONTH: "maxExamsPerMonth",
  MAX_QUESTIONS_PER_MONTH: "maxQuestionsPerMonth",
  MAX_STUDENTS_ALLOWED: "maxStudentsAllowed",
  MAX_TEACHERS_ALLOWED: "maxTeachersAllowed",
  MAX_CLASSES_ALLOWED: "maxClassesAllowed",
} as const;
