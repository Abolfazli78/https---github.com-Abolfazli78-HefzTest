import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { CorrectAnswer, Prisma } from "@/generated/client";

type SortDirection = "asc" | "desc";

interface SortConfig {
  column: string;
  direction: SortDirection;
}

interface QuestionsFilterDto {
  year?: number[] | string[];
  juz?: number[] | string[];
  topic?: string[];
  difficultyLevel?: string[];
  questionKind?: string[];
  isActive?: (boolean | string)[];
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER")) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const year = searchParams.get("year");
    const juz = searchParams.get("juz");
    const topic = searchParams.get("topic");
    const difficultyLevel = searchParams.get("difficultyLevel");
    const questionKind = searchParams.get("questionKind");
    const isActive = searchParams.get("isActive");

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    // Sort configuration (JSON encoded in query string)
    let sort: SortConfig | null = null;
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      try {
        sort = JSON.parse(sortParam) as SortConfig;
      } catch {
        sort = null;
      }
    }

    // Column filter configuration (JSON encoded in query string)
    let filters: QuestionsFilterDto | null = null;
    const filtersParam = searchParams.get("filters");
    if (filtersParam) {
      try {
        filters = JSON.parse(filtersParam) as QuestionsFilterDto;
      } catch {
        filters = null;
      }
    }

    const where: Prisma.QuestionWhereInput = {};

    // Simple query param filters (kept for backward compatibility)
    if (year) {
      where.year = parseInt(year);
    }

    if (juz) {
      where.juz = parseInt(juz);
    }

    if (topic) {
      where.topic = topic;
    }

    if (difficultyLevel) {
      where.difficultyLevel = difficultyLevel;
    }

    if (questionKind) {
      where.questionKind = questionKind as any;
    }

    if (isActive !== null && isActive !== undefined) {
      if (isActive === "true" || isActive === "1" || isActive === "ACTIVE") {
        where.isActive = true;
      } else if (isActive === "false" || isActive === "0" || isActive === "INACTIVE") {
        where.isActive = false;
      }
    }

    // Advanced column filters (multi-column AND)
    if (filters) {
      const andConditions: Prisma.QuestionWhereInput[] = [];

      if (filters.year && filters.year.length > 0) {
        const years = filters.year
          .map((y) => (typeof y === "string" ? parseInt(y) : y))
          .filter((y) => !Number.isNaN(y));
        if (years.length > 0) {
          andConditions.push({ year: { in: years } });
        }
      }

      if (filters.juz && filters.juz.length > 0) {
        const juzValues = filters.juz
          .map((j) => (typeof j === "string" ? parseInt(j) : j))
          .filter((j) => !Number.isNaN(j));
        if (juzValues.length > 0) {
          andConditions.push({ juz: { in: juzValues } });
        }
      }

      if (filters.topic && filters.topic.length > 0) {
        andConditions.push({ topic: { in: filters.topic } });
      }

      if (filters.difficultyLevel && filters.difficultyLevel.length > 0) {
        andConditions.push({ difficultyLevel: { in: filters.difficultyLevel } });
      }

      if (filters.questionKind && filters.questionKind.length > 0) {
        andConditions.push({ questionKind: { in: filters.questionKind as any[] } });
      }

      if (filters.isActive && filters.isActive.length > 0) {
        const activeValues = filters.isActive
          .map((v) => {
            if (typeof v === "boolean") return v;
            if (v === "true" || v === "1" || v === "ACTIVE") return true;
            if (v === "false" || v === "0" || v === "INACTIVE") return false;
            return null;
          })
          .filter((v): v is boolean => v !== null);

        if (activeValues.length === 1) {
          andConditions.push({ isActive: activeValues[0] });
        }
      }

      if (andConditions.length > 0) {
        if (Array.isArray(where.AND)) {
          where.AND = [...where.AND, ...andConditions];
        } else if (where.AND) {
          where.AND = [where.AND, ...andConditions];
        } else {
          where.AND = andConditions;
        }
      }
    }

    const skip = (page - 1) * pageSize;

    // Build orderBy from sort config, defaulting to createdAt desc
    const sortableColumns: Array<keyof Prisma.QuestionOrderByWithRelationInput> = [
      "createdAt",
      "year",
      "juz",
      "topic",
      "difficultyLevel",
      "questionKind",
      "isActive",
    ];

    let orderBy: Prisma.QuestionOrderByWithRelationInput = { createdAt: "desc" };

    if (
      sort &&
      typeof sort.column === "string" &&
      (sort.direction === "asc" || sort.direction === "desc") &&
      sortableColumns.includes(sort.column as keyof Prisma.QuestionOrderByWithRelationInput)
    ) {
      orderBy = {
        [sort.column]: sort.direction,
      } as Prisma.QuestionOrderByWithRelationInput;
    }

    const [questions, total] = await Promise.all([
      db.question.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      db.question.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سوالات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const {
      examId,
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
      difficultyLevel,
      questionKind,
    } = body;

    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return NextResponse.json(
        { error: "همه فیلدها الزامی است" },
        { status: 400 }
      );
    }

    const question = await db.question.create({
      data: {
        examId: examId || null,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer: correctAnswer as CorrectAnswer,
        explanation: explanation || null,
      year: year ? parseInt(year) : null,
      juz: juz ? parseInt(juz) : null,
      topic: topic || null,
        difficultyLevel: difficultyLevel || null,
        questionKind: questionKind ?? "CONCEPTS",
        isActive: true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد سوال" },
      { status: 500 }
    );
  }
}

