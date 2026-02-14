import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { getAccessibleExams } from "@/lib/exam-access";
import { db } from "@/lib/db";
import { AccessLevel, SelectionMode, CorrectAnswer, UserRole, QuestionKind } from "@/generated/client";
import { checkAccess } from "@/lib/access";
import type { Prisma } from "@/generated/client";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const exams = await getAccessibleExams(session.user.id, session.user.role as UserRole);

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json(
      { error: "خطا در دریافت آزمون‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER" && session.user.role !== "INSTITUTE")) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      duration,
      questionCount,
      accessLevel = AccessLevel.FREE,
      selectionMode,
      year,
      juz,
      isActive,
      endAt,
      // Custom exam fields
      passingScore,
      randomizeQuestions,
      showResults,
      allowRetake,
      fromJuz,
      toJuz,
      fromSurah,
      toSurah,
      topics,
    } = body;

    // Validate required fields
    if (!title || !duration || !questionCount) {
      return NextResponse.json(
        { error: "عنوان، مدت زمان و تعداد سوالات الزامی است" },
        { status: 400 }
      );
    }

    // Enforce plan feature + quotas for non-admin creators
    if (session.user.role !== "ADMIN") {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const examsCreatedThisMonth = await db.exam.count({
        where: {
          createdAt: { gte: startOfMonth },
          createdById: session.user.id,
        },
      });

      const used = await db.exam.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          createdById: session.user.id,
        },
        _sum: { questionCount: true },
      });

      const usedQuestions = used._sum.questionCount || 0;
      const requestedQuestions = parseInt(questionCount);

      const access = await checkAccess(session.user.id, "exam_creation", {
        key: "maxExamsPerMonth",
        used: examsCreatedThisMonth,
        requested: 1,
      });
      if (!access.allowed) {
        return NextResponse.json({ error: access.message }, { status: 403 });
      }

      const accessQuestions = await checkAccess(session.user.id, "exam_creation", {
        key: "maxQuestionsPerMonth",
        used: usedQuestions,
        requested: requestedQuestions,
      });
      if (!accessQuestions.allowed) {
        return NextResponse.json({ error: accessQuestions.message }, { status: 403 });
      }
    }

    // Validate selection mode requirements
    if (selectionMode === SelectionMode.YEAR && !year) {
      return NextResponse.json(
        { error: "سال الزامی است هنگام انتخاب نوع انتخاب بر اساس سال" },
        { status: 400 }
      );
    }

    if (selectionMode === SelectionMode.JUZ && !juz && !fromJuz) {
      return NextResponse.json(
        { error: "جزء یا محدوده اجزاء الزامی است هنگام انتخاب نوع انتخاب بر اساس جزء" },
        { status: 400 }
      );
    }

    // Validate custom exam range
    if (fromJuz && toJuz && parseInt(fromJuz) > parseInt(toJuz)) {
      return NextResponse.json(
        { error: "جزء شروع نمی‌تواند بزرگتر از جزء پایان باشد" },
        { status: 400 }
      );
    }

    // Validate endAt (optional). If provided: must be a valid future date, and non-admin creators must have active subscription
    let endAtDate: Date | null = null;
    if (endAt) {
      const parsed = new Date(endAt);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "فرمت تاریخ پایان معتبر نیست" }, { status: 400 });
      }
      if (parsed <= new Date()) {
        return NextResponse.json({ error: "تاریخ پایان باید در آینده باشد" }, { status: 400 });
      }
      // Subscription check for non-admins
      if (session.user.role !== "ADMIN") {
        const activeSub = await db.subscription.findFirst({
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
          return NextResponse.json({ error: "برای تعیین مهلت پایان آزمون، نیاز به اشتراک فعال دارید" }, { status: 402 });
        }
      }
      endAtDate = parsed;
    }

    // Generate questions from question bank based on selection mode
    const whereClause: Prisma.QuestionWhereInput = { isActive: true };
    
    if (selectionMode === SelectionMode.YEAR && year) {
      whereClause.year = parseInt(year);
    } else if (selectionMode === SelectionMode.JUZ) {
      if (fromJuz && toJuz) {
        // Custom range: from part to part
        const from = parseInt(fromJuz);
        const to = parseInt(toJuz);
        const [start, end] = from <= to ? [from, to] : [to, from];
        whereClause.juz = {
          gte: start,
          lte: end,
        };
      } else if (juz) {
        // Single juz (old format)
        whereClause.juz = parseInt(juz);
      }
    } else if (selectionMode === SelectionMode.SURAH) {
      if (fromSurah && toSurah) {
        const from = Number(fromSurah);
        const to = Number(toSurah);
        if (Number.isFinite(from) && Number.isFinite(to)) {
          // Import helper functions
          const { SURAHS, normalizeText } = await import("@/lib/surahs");
          const selectedSurahs = SURAHS.filter((s) => s.id >= start && s.id <= end);
          const normalizedNames = selectedSurahs.map((s) => normalizeText(s.name));
          const originalNames = selectedSurahs.map((s) => s.name);
          
          // Combine all possible name variations
          const allNames = [...new Set([...normalizedNames, ...originalNames])];
          
          if (allNames.length > 0) {
            // Use OR with multiple topic matches to handle variations
            const topicConditions: Prisma.QuestionWhereInput[] = allNames.map((name) => ({
              topic: name,
            }));
            
            if (topicConditions.length === 1) {
              whereClause.topic = topicConditions[0].topic;
            } else {
              whereClause.OR = topicConditions;
            }
          }
        }
      }
    }
    // RANDOM mode doesn't filter by specific criteria when no explicit selection range

    // Filter by question kind (memorization/concepts)
    if (Array.isArray(topics) && topics.length > 0) {
      const hasMemorization = topics.includes("memorization");
      const hasConcepts = topics.includes("concepts");

      if (hasMemorization && !hasConcepts) {
        whereClause.questionKind = { in: [QuestionKind.MEMORIZATION] };
      } else if (hasConcepts && !hasMemorization) {
        whereClause.questionKind = { in: [QuestionKind.CONCEPTS] };
      } else if (hasConcepts && hasMemorization) {
        whereClause.questionKind = { in: [QuestionKind.CONCEPTS, QuestionKind.MEMORIZATION] };
      }
    }

    // Get random questions from the question bank
    const questions = await db.question.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, // Get latest questions first
    });

    console.log("CustomExam (admin/institute/teacher) DEBUG - whereClause:", whereClause);
    console.log("CustomExam (admin/institute/teacher) DEBUG - matched questions:", questions.length);

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "هیچ سوالی در بانک سوالات با معیارهای مشخص شده یافت نشد" },
        { status: 400 }
      );
    }

    // Randomly select the required number of questions
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(parseInt(questionCount), questions.length));

    if (selectedQuestions.length === 0) {
      return NextResponse.json(
        { error: "نمی‌توان سوالاتی را برای این آزمون انتخاب کرد" },
        { status: 400 }
      );
    }

    // Prepare exam data with custom fields
    let examDescription = description;
    
    // Store custom exam settings in description as JSON if they exist
    if (passingScore || randomizeQuestions !== undefined || showResults !== undefined || allowRetake !== undefined) {
      const customSettings = {
        passingScore: passingScore ? parseInt(passingScore) : 70,
        randomizeQuestions: randomizeQuestions !== undefined ? randomizeQuestions : true,
        showResults: showResults !== undefined ? showResults : true,
        allowRetake: allowRetake !== undefined ? allowRetake : false,
      };
      
      const customSettingsJson = JSON.stringify(customSettings);
      examDescription = examDescription ? `${examDescription}\n\n${customSettingsJson}` : customSettingsJson;
    }

    const exam = await db.exam.create({
      data: {
        title,
        description: examDescription,
        duration: parseInt(duration),
        questionCount: parseInt(questionCount),
        accessLevel: accessLevel as AccessLevel,
        selectionMode: selectionMode as SelectionMode,
        year: year ? parseInt(year) : null,
        juz: juz ? parseInt(juz) : (fromJuz ? parseInt(fromJuz) : null), // Store fromJuz for range tracking
        isActive: isActive !== false,
        createdById: session.user.id,
        endAt: endAtDate,
        questions: {
          create: selectedQuestions.map((q: any) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            year: q.year,
            juz: q.juz,
            topic: q.topic,
            difficultyLevel: q.difficultyLevel,
            isActive: true,
          }))
        }
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد آزمون" },
      { status: 500 }
    );
  }
}

