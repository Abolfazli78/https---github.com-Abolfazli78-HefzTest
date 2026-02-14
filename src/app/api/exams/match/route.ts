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

        if (Array.isArray(juz) && juz.length > 0) {
            const juzIds = juz
                .map((j: any) => Number(j))
                .filter((j) => Number.isInteger(j) && j >= 1 && j <= 30);
            if (juzIds.length > 0) {
                whereClause.juz = { in: juzIds };
            }
        }

        if (Array.isArray(surah) && surah.length > 0) {
            const surahIds = surah
                .map((s: any) => Number(s))
                .filter((s) => Number.isInteger(s) && s >= 1 && s <= 114);
            if (surahIds.length > 0) {
                // Convert Surah IDs to names and filter by topic
                const { SURAHS, normalizeText } = await import("@/lib/surahs");
                const selectedSurahs = SURAHS.filter((s) => surahIds.includes(s.id));
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

        if (typeof year === "number" && Number.isInteger(year)) {
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
