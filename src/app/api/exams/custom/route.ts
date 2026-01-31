import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { Prisma } from "@/generated/client";
import { checkAccess } from "@/lib/access";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role === "TEACHER" || session.user.role === "INSTITUTE") {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const examsCreatedThisMonth = await prisma.exam.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    createdById: session.user.id,
                },
            });

            const bodyForQuota: { questionCount?: unknown } = await req
                .clone()
                .json()
                .catch(() => ({} as { questionCount?: unknown }));

            const requestedQuestionCount =
                typeof bodyForQuota.questionCount === "number"
                    ? bodyForQuota.questionCount
                    : parseInt(String(bodyForQuota.questionCount ?? "20"));

            const used = await prisma.exam.aggregate({
                where: {
                    createdAt: { gte: startOfMonth },
                    createdById: session.user.id,
                },
                _sum: { questionCount: true },
            });

            const usedQuestions = used._sum.questionCount || 0;

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
                requested: requestedQuestionCount,
            });
            if (!accessQuestions.allowed) {
                return NextResponse.json({ error: accessQuestions.message }, { status: 403 });
            }
        }

        const body = await req.json();
        const {
            juz, // Array of specific juz (legacy)
            juzStart,
            juzEnd,
            surah,
            year, // Specific year (legacy)
            yearStart,
            yearEnd,
            questionCount = 20,
            difficulty,
            topic,
            isWholeQuran
        } = body;

        // 1. Build Filter Criteria
        const whereClause: Prisma.QuestionWhereInput = {
            isActive: true,
        };

        // Juz Filter
        if (!isWholeQuran) {
            if (juzStart && juzEnd) {
                whereClause.juz = {
                    gte: parseInt(juzStart),
                    lte: parseInt(juzEnd),
                };
            } else if (juz && juz.length > 0) {
                whereClause.juz = { in: juz };
            }
        }

        // Surah Filter
        if (surah && surah.length > 0) {
            // Assuming 'topic' field in Question model stores Surah name for now, 
            // or we need to check if there's a separate surah field. 
            // The schema has 'topic' and 'juz'. It doesn't have 'surah'. 
            // User request implies 'surah' filter. 
            // If 'topic' is used for Surah, then:
            whereClause.topic = { in: surah };
        }

        // Year Filter
        if (yearStart && yearEnd) {
            whereClause.year = {
                gte: parseInt(yearStart),
                lte: parseInt(yearEnd),
            };
        } else if (year) {
            whereClause.year = year;
        }

        // Difficulty Filter
        if (difficulty && difficulty !== "ALL") {
            whereClause.difficultyLevel = difficulty;
        }

        // Topic/Concept Filter (Memorization vs Concepts)
        // If the user selects "Memorization" or "Concepts", we need to filter by that.
        // The schema has 'topic' string. 
        // If 'topic' is used for Surah, we might have a conflict.
        // However, the user request says "surah, juz, hefz, mafahim".
        // "hefz" and "mafahim" might be stored in 'topic' or another field.
        // Let's assume for now 'topic' might contain "Memorization" or "Concepts" OR Surah names.
        // Or maybe we need to check the schema again. 
        // Schema: topic String?
        // If the user wants to filter by "Memorization" (Hefz) vs "Concepts" (Mafahim), 
        // we might need to look at the 'questionText' or a specific tag.
        // For now, if 'topic' is passed and it's NOT a surah list, we use it.
        if (topic && topic !== "ALL" && (!surah || surah.length === 0)) {
            whereClause.topic = topic;
        }

        // 2. Find Questions
        const questions = await prisma.question.findMany({
            where: whereClause,
            take: questionCount, // Limit questions
            orderBy: {
                // Randomize if possible, or just take first N
                id: 'asc',
            }
        });

        if (questions.length === 0) {
            return NextResponse.json({ error: "No questions found matching criteria" }, { status: 404 });
        }

        // 3. Create a "Custom Exam" record
        // We create a temporary or permanent Exam record for this session
        let description = "آزمون سفارشی";
        if (isWholeQuran) {
            description = "آزمون از کل قرآن کریم";
        } else if (juzStart && juzEnd) {
            description = `شامل اجزاء ${juzStart} تا ${juzEnd}`;
        } else if (juz && juz.length > 0) {
            description = `شامل جزء: ${juz.join(', ')}`;
        }

        const exam = await prisma.exam.create({
            data: {
                title: `آزمون سفارشی - ${new Date().toLocaleDateString('fa-IR')}`,
                description,
                duration: questions.length, // 1 min per question
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

        return NextResponse.json({
            examId: exam.id,
            message: "Custom exam created successfully"
        });

    } catch (error) {
        console.error("Create Custom Exam Error:", error);
        if (error instanceof Error) {
            console.error("Error stack:", error.stack);
            console.error("Error message:", error.message);
        }
        return NextResponse.json(
            { error: "Failed to create custom exam.", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
