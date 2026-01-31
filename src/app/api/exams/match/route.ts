import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { Prisma } from "@/generated/client";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { juz, surah, year } = body;

        const whereClause: Prisma.QuestionWhereInput = {
            isActive: true,
        };

        if (juz && juz.length > 0) {
            whereClause.juz = { in: juz };
        }

        if (surah && surah.length > 0) {
            whereClause.topic = { in: surah };
        }

        if (year) {
            whereClause.year = year;
        }

        const count = await prisma.question.count({
            where: whereClause,
        });

        // Estimate time: 1 minute per question (example logic)
        const estimatedMinutes = count * 1;

        return NextResponse.json({
            count,
            estimatedMinutes,
            message: `Found ${count} questions matching your criteria.`,
        });
    } catch (error) {
        console.error("Match Engine Error:", error);
        return NextResponse.json(
            { error: "Failed to calculate match." },
            { status: 500 }
        );
    }
}
