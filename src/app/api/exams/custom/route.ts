import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { checkAccess } from "@/lib/access";
import { CreateCustomExamSchema, CreateCustomExamInput } from "@/lib/examValidation";
import { buildQuestionFilters } from "@/lib/examFilters";
import {
  fetchQuestionsBalanced,
  extractSelectedCategories,
} from "@/lib/questionFetcher";
import { SURAHS } from "@/lib/surahs";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Input validation with defensive parsing
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate body is an object
    if (!body || typeof body !== 'object') {
      console.error("Invalid body type:", typeof body);
      return NextResponse.json(
        { error: "Request body must be a valid object" },
        { status: 400 }
      );
    }

    console.log("CustomExam DEBUG - raw request body:", body);

    const validationResult = CreateCustomExamSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.issues);
      console.error("Received body:", body);
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const input = validationResult.data;
    console.log("CustomExam DEBUG - validated input:", input);

    // Transaction-safe exam creation
    const result = await prisma.$transaction(async (tx) => {
      // Check quotas and permissions
      await validateUserQuotas(session, input.questionCount, tx);

      // Build filters (Surah OR Juz)
      const filters = buildQuestionFilters(input, session.user.id);
      const { surahIds, juzNumbers } = extractSelectedCategories(input);
      const minCategories = surahIds.length + juzNumbers.length;

      const totalCount = await tx.question.count({ where: filters });
      if (totalCount < input.questionCount) {
        throw new Error(
          `Only ${totalCount} questions found in your selected range, but you requested ${input.questionCount}.`
        );
      }
      if (minCategories > 0 && minCategories > input.questionCount) {
        throw new Error(
          `You selected ${minCategories} categories but requested only ${input.questionCount} questions. Minimum required is ${minCategories}.`
        );
      }

      const questions = await fetchQuestionsBalanced(
        filters,
        surahIds,
        juzNumbers,
        input.questionCount,
        input.randomizeQuestions ?? true,
        tx
      );

      // Create exam description
      const examDescription = buildExamDescription(input.description, {
        isWholeQuran: input.isWholeQuran,
        juzStart: input.juzStart?.toString(),
        juzEnd: input.juzEnd?.toString(),
        juz: input.juz,
        surah: input.surah,
        surahStart: input.surahStart,
        surahEnd: input.surahEnd,
      });

      // Store custom settings
      const finalDescription = addCustomSettings(examDescription, {
        passingScore: input.passingScore,
        randomizeQuestions: input.randomizeQuestions,
        showResults: input.showResults,
        allowRetake: input.allowRetake
      });

      // Create exam
      const exam = await tx.exam.create({
        data: {
          title: input.title || `آزمون سفارشی - ${new Date().toLocaleDateString('fa-IR')}`,
          description: finalDescription,
          duration: input.duration || questions.length,
          questionCount: questions.length,
          accessLevel: "FREE",
          selectionMode: "RANDOM",
          isActive: true,
          createdById: session.user.id,
          questions: {
            connect: questions.map(q => ({ id: q.id }))
          }
        }
      });

      return {
        examId: exam.id,
        questionsUsed: questions.length,
        totalAvailable: totalCount
      };
    });

    return NextResponse.json({
      ...result,
      message: "Custom exam created successfully"
    });

  } catch (error) {
    console.error("Create Custom Exam Error:", error);
    
    // Structured error handling
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error message:", error.message);
      
      // Validation errors (count, categories, etc.)
      if (
        error.message.includes("Not enough questions") ||
        error.message.includes("Only ") ||
        error.message.includes("You selected ") ||
        error.message.includes("No questions found")
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      // Quota errors
      if (error.message.includes("quota") || error.message.includes("subscription")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      
      // Conflict errors
      if (error.message.includes("conflict")) {
        return NextResponse.json(
          { error: "Resource conflict. Please try again." },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create custom exam.", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Validates user quotas and permissions for exam creation
 */
async function validateUserQuotas(
  session: any, 
  requestedQuestionCount: number,
  tx: Prisma.TransactionClient
) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const examsCreatedThisMonth = await tx.exam.count({
    where: {
      createdAt: { gte: startOfMonth },
      createdById: session.user.id,
    },
  });

  const used = await tx.exam.aggregate({
    where: {
      createdAt: { gte: startOfMonth },
      createdById: session.user.id,
    },
    _sum: { questionCount: true },
  });

  const usedQuestions = used._sum.questionCount || 0;

  // Check exam count quota
  const access = await checkAccess(session.user.id, "exam_creation", {
    key: "maxExamsPerMonth",
    used: examsCreatedThisMonth,
    requested: 1,
  });
  if (!access.allowed) {
    throw new Error(access.message);
  }

  // Check question count quota
  const accessQuestions = await checkAccess(session.user.id, "exam_creation", {
    key: "maxQuestionsPerMonth",
    used: usedQuestions,
    requested: requestedQuestionCount,
  });
  if (!accessQuestions.allowed) {
    throw new Error(accessQuestions.message);
  }

  // For regular users, check subscription
  if (session.user.role === "USER" || session.user.role === "STUDENT") {
    const activeSub = await tx.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        OR: [
          { endDate: null },
          { endDate: { gt: new Date() } },
        ],
      },
    });
    
    if (!activeSub) {
      throw new Error("برای ساخت آزمون دلخواه، نیاز به اشتراک فعال دارید");
    }
  }
}

/**
 * Builds exam description based on filters
 */
function buildExamDescription(userDescription: string | undefined, filters: {
  isWholeQuran?: boolean;
  juzStart?: string;
  juzEnd?: string;
  juz?: number[];
  surah?: number[];
  surahStart?: number;
  surahEnd?: number;
}): string {
  let description = userDescription || "آزمون سفارشی";

  if (filters.isWholeQuran) {
    description = "آزمون از کل قرآن کریم";
  } else {
    const parts: string[] = [];

    // Surah part
    if (filters.surahStart != null && filters.surahEnd != null) {
      const fromName = SURAHS.find((s) => s.id === filters.surahStart)?.name ?? String(filters.surahStart);
      const toName = SURAHS.find((s) => s.id === filters.surahEnd)?.name ?? String(filters.surahEnd);
      parts.push(`از ${fromName} تا ${toName}`);
    } else if (filters.surah && filters.surah.length > 0) {
      const surahMap = new Map(SURAHS.map((s) => [s.id, s.name]));
      const surahNames = filters.surah
        .map((id) => surahMap.get(Number(id)))
        .filter((name): name is string => name !== undefined);
      if (surahNames.length > 0) {
        const text = surahNames.length <= 5
          ? surahNames.join("، ")
          : `${surahNames.slice(0, 3).join("، ")} و ${surahNames.length - 3} مورد دیگر`;
        parts.push(`سوره: ${text}`);
      }
    }

    // Juz part
    if (filters.juzStart && filters.juzEnd) {
      parts.push(`اجزاء ${filters.juzStart} تا ${filters.juzEnd}`);
    } else if (filters.juz && filters.juz.length > 0) {
      const text = filters.juz.length <= 5
        ? filters.juz.join(", ")
        : `${filters.juz.slice(0, 3).join(", ")} و ${filters.juz.length - 3} مورد دیگر`;
      parts.push(`جزء: ${text}`);
    }

    if (parts.length > 0) {
      description = `شامل ${parts.join(" | ")}`;
    }
  }

  return description;
}

/**
 * Adds custom settings to exam description
 */
function addCustomSettings(description: string, settings: {
  passingScore?: number;
  randomizeQuestions?: boolean;
  showResults?: boolean;
  allowRetake?: boolean;
}): string {
  const customSettings = {
    passingScore: settings.passingScore || 70,
    randomizeQuestions: settings.randomizeQuestions !== undefined ? settings.randomizeQuestions : true,
    showResults: settings.showResults !== undefined ? settings.showResults : true,
    allowRetake: settings.allowRetake !== undefined ? settings.allowRetake : false,
  };
  
  const customSettingsJson = JSON.stringify(customSettings);
  return description ? `${description}\n\n${customSettingsJson}` : customSettingsJson;
}
