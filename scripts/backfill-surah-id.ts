/**
 * Backfill Question.surahId from topic.
 * Normalizes topic and matches against SURAHS; sets surahId when matched.
 * Run once after adding surahId column: npx tsx scripts/backfill-surah-id.ts
 */
import { db } from "./db-script";
import { SURAHS, normalizeText } from "@/lib/surahs";

function normalizeTopic(topic: string | null): string {
  if (!topic || !topic.trim()) return "";
  const t = topic.trim();
  const withoutPrefix = t.replace(/^سوره\s*/i, "").trim();
  return normalizeText(withoutPrefix);
}

function matchSurahId(normalizedTopic: string): number | null {
  if (!normalizedTopic) return null;
  for (const surah of SURAHS) {
    const nameNorm = normalizeText(surah.name);
    const withAl = surah.name.startsWith("ال") ? nameNorm : normalizeText("ال" + surah.name);
    if (nameNorm === normalizedTopic || withAl === normalizedTopic) return surah.id;
  }
  return null;
}

async function main() {
  const questions = await db.question.findMany({
    select: { id: true, topic: true, surahId: true },
  });

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;

  for (const q of questions) {
    if (q.surahId != null) {
      skipped++;
      continue;
    }
    const normalized = normalizeTopic(q.topic);
    if (!normalized) {
      noMatch++;
      continue;
    }
    const surahId = matchSurahId(normalized);
    if (surahId == null) {
      noMatch++;
      continue;
    }
    await db.question.update({
      where: { id: q.id },
      data: { surahId },
    });
    updated++;
  }

  console.log("Backfill surahId: updated=%d, skipped (already set)=%d, no match=%d", updated, skipped, noMatch);
}

main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
