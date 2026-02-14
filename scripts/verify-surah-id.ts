/**
 * Verify: no Question has topic NOT null but surahId IS null.
 */
import { db } from "./db-script";

async function main() {
  const count = await db.question.count({
    where: {
      topic: { not: null },
      surahId: null,
    },
  });

  if (count > 0) {
    console.warn(`\nWARNING: ${count} question(s) have topic set but surahId is null.`);
    console.warn("These could not be matched to a Surah. Consider manual review.\n");
    process.exit(1);
  }

  console.log("\nAll questions successfully mapped to surahId.\n");
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
