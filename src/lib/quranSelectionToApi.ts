import { SURAHS } from "@/lib/surahs";
import type { CreateCustomExamInput } from "@/lib/examValidation";
import type { QuranSelectionState } from "@/components/custom-exam/quran-selection-step";

/** Returns human-readable summary of quran selection for confirmation step */
export function getQuranSelectionSummary(state: QuranSelectionState): string {
  const parts: string[] = [];
  const surahMap = new Map(SURAHS.map((s) => [s.id, s.name]));

  const hasSurah =
    (state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null) ||
    (state.surahSelectionMode === "multiple" && state.selectedSurahs.length > 0);

  const hasJuz =
    (state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null) ||
    (state.juzSelectionMode === "multiple" && state.selectedJuz.length > 0);

  if (hasSurah) {
    if (state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null) {
      const from = surahMap.get(state.fromSurah) ?? String(state.fromSurah);
      const to = surahMap.get(state.toSurah) ?? String(state.toSurah);
      parts.push(`سوره: از ${from} تا ${to}`);
    } else if (state.selectedSurahs.length > 0) {
      const names = state.selectedSurahs
        .slice(0, 5)
        .map((id) => surahMap.get(id) ?? String(id));
      parts.push(
        state.selectedSurahs.length <= 5
          ? `سوره: ${names.join("، ")}`
          : `سوره: ${names.slice(0, 3).join("، ")} و ${state.selectedSurahs.length - 3} مورد دیگر`
      );
    }
  }

  if (hasJuz) {
    if (state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null) {
      parts.push(`جزء: از ${state.fromJuz} تا ${state.toJuz}`);
    } else if (state.selectedJuz.length > 0) {
      parts.push(
        state.selectedJuz.length <= 5
          ? `جزء: ${state.selectedJuz.map((j) => `جزء ${j}`).join("، ")}`
          : `جزء: ${state.selectedJuz.slice(0, 3).map((j) => `جزء ${j}`).join("، ")} و ${state.selectedJuz.length - 3} مورد دیگر`
      );
    }
  }

  return parts.length > 0 ? parts.join(" | ") : "—";
}

/**
 * Converts QuranSelectionState to API payload fields for CreateCustomExamInput.
 * Only includes surah/juz fields that are active based on selection mode.
 */
export function quranSelectionToApiPayload(
  state: QuranSelectionState
): Pick<
  CreateCustomExamInput,
  "surah" | "surahStart" | "surahEnd" | "juz" | "juzStart" | "juzEnd"
> {
  const result: Record<string, unknown> = {};

  // Surah
  if (state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null) {
    result.surahStart = Math.min(state.fromSurah, state.toSurah);
    result.surahEnd = Math.max(state.fromSurah, state.toSurah);
  } else if (
    state.surahSelectionMode === "multiple" &&
    state.selectedSurahs.length > 0
  ) {
    result.surah = [...state.selectedSurahs].sort((a, b) => a - b);
  }

  // Juz
  if (state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null) {
    result.juzStart = Math.min(state.fromJuz, state.toJuz);
    result.juzEnd = Math.max(state.fromJuz, state.toJuz);
  } else if (
    state.juzSelectionMode === "multiple" &&
    state.selectedJuz.length > 0
  ) {
    result.juz = [...state.selectedJuz].sort((a, b) => a - b);
  }

  return result as Pick<
    CreateCustomExamInput,
    "surah" | "surahStart" | "surahEnd" | "juz" | "juzStart" | "juzEnd"
  >;
}
