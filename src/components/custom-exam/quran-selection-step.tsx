"use client";

import { useMemo, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SURAHS } from "@/lib/surahs";

const JUZ_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: `جزء ${i + 1}`,
}));

const SURAH_OPTIONS = SURAHS.map((s) => ({ id: s.id, name: s.name }));

export type SelectionMode = "range" | "multiple";

export interface QuranSelectionState {
  useSurahFilter: boolean;
  useJuzFilter: boolean;
  surahSelectionMode: SelectionMode;
  juzSelectionMode: SelectionMode;
  fromSurah: number | null;
  toSurah: number | null;
  selectedSurahs: number[];
  fromJuz: number | null;
  toJuz: number | null;
  selectedJuz: number[];
}

export const initialQuranSelectionState: QuranSelectionState = {
  useSurahFilter: false,
  useJuzFilter: false,
  surahSelectionMode: "range",
  juzSelectionMode: "range",
  fromSurah: 1,
  toSurah: 114,
  selectedSurahs: [],
  fromJuz: 1,
  toJuz: 30,
  selectedJuz: [],
};

export interface QuranSelectionStepProps {
  state: QuranSelectionState;
  onChange: (state: QuranSelectionState) => void;
  surahSearch?: string;
  onSurahSearchChange?: (value: string) => void;
}

function formatSurahPreview(ids: number[], maxShow = 5): string {
  if (ids.length === 0) return "";
  const names = ids
    .slice(0, maxShow)
    .map((id) => SURAHS.find((s) => s.id === id)?.name ?? String(id));
  if (ids.length <= maxShow) {
    return names.join("، ");
  }
  return `${names.slice(0, 3).join("، ")} و ${ids.length - 3} مورد دیگر`;
}

function formatRangePreview(from: number, to: number, names: { (id: number): string }): string {
  const fromName = names(from);
  const toName = names(to);
  return `از ${fromName} تا ${toName}`;
}

export function QuranSelectionStep({
  state,
  onChange,
  surahSearch = "",
  onSurahSearchChange,
}: QuranSelectionStepProps) {
  const updateState = useCallback(
    (partial: Partial<QuranSelectionState>) => {
      const next = { ...state, ...partial };
      if (partial.useSurahFilter === false) {
        next.fromSurah = null;
        next.toSurah = null;
        next.selectedSurahs = [];
      }
      if (partial.useJuzFilter === false) {
        next.fromJuz = null;
        next.toJuz = null;
        next.selectedJuz = [];
      }
      onChange(next);
    },
    [state, onChange]
  );

  const setUseSurahFilter = useCallback(
    (checked: boolean) => {
      if (!checked && !state.useJuzFilter) return;
      updateState({ useSurahFilter: checked });
    },
    [state.useJuzFilter, updateState]
  );

  const setUseJuzFilter = useCallback(
    (checked: boolean) => {
      if (!checked && !state.useSurahFilter) return;
      updateState({ useJuzFilter: checked });
    },
    [state.useSurahFilter, updateState]
  );

  const setSurahMode = useCallback(
    (mode: SelectionMode) => {
      updateState({
        surahSelectionMode: mode,
        fromSurah: mode === "range" ? 1 : null,
        toSurah: mode === "range" ? 114 : null,
        selectedSurahs: mode === "multiple" ? [] : [],
      });
    },
    [updateState]
  );

  const setJuzMode = useCallback(
    (mode: SelectionMode) => {
      updateState({
        juzSelectionMode: mode,
        fromJuz: mode === "range" ? 1 : null,
        toJuz: mode === "range" ? 30 : null,
        selectedJuz: mode === "multiple" ? [] : [],
      });
    },
    [updateState]
  );

  const filteredSurahOptions = useMemo(() => {
    const q = surahSearch.trim();
    if (!q) return SURAH_OPTIONS;
    return SURAH_OPTIONS.filter(
      (s) => s.name.includes(q) || String(s.id).includes(q)
    );
  }, [surahSearch]);

  const surahMap = useMemo(() => new Map(SURAHS.map((s) => [s.id, s.name])), []);

  const toggleSurah = useCallback(
    (id: number) => {
      const next = state.selectedSurahs.includes(id)
        ? state.selectedSurahs.filter((x) => x !== id)
        : [...state.selectedSurahs, id].sort((a, b) => a - b);
      updateState({ selectedSurahs: next });
    },
    [state.selectedSurahs, updateState]
  );

  const toggleJuz = useCallback(
    (id: number) => {
      const next = state.selectedJuz.includes(id)
        ? state.selectedJuz.filter((x) => x !== id)
        : [...state.selectedJuz, id].sort((a, b) => a - b);
      updateState({ selectedJuz: next });
    },
    [state.selectedJuz, updateState]
  );

  const selectAllSurahs = useCallback(() => {
    updateState({ selectedSurahs: SURAHS.map((s) => s.id) });
  }, [updateState]);

  const clearAllSurahs = useCallback(() => {
    updateState({ selectedSurahs: [] });
  }, [updateState]);

  const selectAllJuz = useCallback(() => {
    updateState({ selectedJuz: Array.from({ length: 30 }, (_, i) => i + 1) });
  }, [updateState]);

  const clearAllJuz = useCallback(() => {
    updateState({ selectedJuz: [] });
  }, [updateState]);

  const surahSummary =
    state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null
      ? formatRangePreview(state.fromSurah, state.toSurah, (id) => surahMap.get(id) ?? String(id))
      : formatSurahPreview(state.selectedSurahs);

  const juzSummary =
    state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null
      ? `از جزء ${state.fromJuz} تا جزء ${state.toJuz}`
      : state.selectedJuz.length > 0
        ? state.selectedJuz.length <= 5
          ? state.selectedJuz.map((j) => `جزء ${j}`).join("، ")
          : `${state.selectedJuz.slice(0, 3).map((j) => `جزء ${j}`).join("، ")} و ${state.selectedJuz.length - 3} مورد دیگر`
        : "";

  const hasSurah =
    (state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null) ||
    (state.surahSelectionMode === "multiple" && state.selectedSurahs.length > 0);

  const hasJuz =
    (state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null) ||
    (state.juzSelectionMode === "multiple" && state.selectedJuz.length > 0);

  const hasAny = (state.useSurahFilter && hasSurah) || (state.useJuzFilter && hasJuz);

  return (
    <div className="space-y-6">
      {/* Filter toggles: at least one must be selected */}
      <div className="flex flex-wrap items-center gap-6 p-3 border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <Checkbox
            id="use-surah-filter"
            checked={state.useSurahFilter}
            onCheckedChange={(checked) => setUseSurahFilter(checked === true)}
          />
          <Label htmlFor="use-surah-filter" className="cursor-pointer font-medium">
            استفاده از فیلتر سوره
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="use-juz-filter"
            checked={state.useJuzFilter}
            onCheckedChange={(checked) => setUseJuzFilter(checked === true)}
          />
          <Label htmlFor="use-juz-filter" className="cursor-pointer font-medium">
            استفاده از فیلتر جزء
          </Label>
        </div>
        {!state.useSurahFilter && !state.useJuzFilter && (
          <span className="text-sm text-amber-700">حداقل یکی از سوره یا جزء باید انتخاب شود</span>
        )}
      </div>

      {/* Surah Section */}
      {state.useSurahFilter && (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">انتخاب سوره</h3>
        <div className="flex gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSurahMode("range")}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                state.surahSelectionMode === "range"
                  ? "bg-accent border-accent"
                  : "border-gray-300"
              }`}
            />
            <Label className="cursor-pointer">بازه پیوسته</Label>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSurahMode("multiple")}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                state.surahSelectionMode === "multiple"
                  ? "bg-accent border-accent"
                  : "border-gray-300"
              }`}
            />
            <Label className="cursor-pointer">چند انتخابی</Label>
          </div>
        </div>

        {state.surahSelectionMode === "range" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>از سوره</Label>
              <Select
                value={state.fromSurah != null ? String(state.fromSurah) : ""}
                onValueChange={(v) =>
                  updateState({ fromSurah: Number(v), toSurah: state.toSurah ?? 114 })
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {onSurahSearchChange && (
                    <div className="px-2 py-1.5">
                      <Input
                        placeholder="جستجوی سوره..."
                        value={surahSearch}
                        onChange={(e) => onSurahSearchChange(e.target.value)}
                        className="h-8 text-xs"
                        dir="rtl"
                      />
                    </div>
                  )}
                  {filteredSurahOptions.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>تا سوره</Label>
              <Select
                value={state.toSurah != null ? String(state.toSurah) : ""}
                onValueChange={(v) =>
                  updateState({ toSurah: Number(v), fromSurah: state.fromSurah ?? 1 })
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {onSurahSearchChange && (
                    <div className="px-2 py-1.5">
                      <Input
                        placeholder="جستجوی سوره..."
                        value={surahSearch}
                        onChange={(e) => onSurahSearchChange(e.target.value)}
                        className="h-8 text-xs"
                        dir="rtl"
                      />
                    </div>
                  )}
                  {filteredSurahOptions.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={String(s.id)}
                      disabled={
                        state.fromSurah != null && s.id < state.fromSurah
                      }
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllSurahs}
              >
                انتخاب همه
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllSurahs}
              >
                پاک کردن
              </Button>
              {state.selectedSurahs.length > 0 && (
                <span className="text-sm text-gray-600">
                  {state.selectedSurahs.length} سوره انتخاب شده
                </span>
              )}
            </div>
            <div
              className="border rounded-lg p-3 max-h-[200px] overflow-y-auto"
              dir="rtl"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SURAH_OPTIONS.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`surah-${s.id}`}
                      checked={state.selectedSurahs.includes(s.id)}
                      onCheckedChange={() => toggleSurah(s.id)}
                    />
                    <Label
                      htmlFor={`surah-${s.id}`}
                      className="cursor-pointer text-sm"
                    >
                      {s.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Juz Section */}
      {state.useJuzFilter && (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">انتخاب جزء</h3>
        <div className="flex gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setJuzMode("range")}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                state.juzSelectionMode === "range"
                  ? "bg-accent border-accent"
                  : "border-gray-300"
              }`}
            />
            <Label className="cursor-pointer">بازه پیوسته</Label>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setJuzMode("multiple")}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                state.juzSelectionMode === "multiple"
                  ? "bg-accent border-accent"
                  : "border-gray-300"
              }`}
            />
            <Label className="cursor-pointer">چند انتخابی</Label>
          </div>
        </div>

        {state.juzSelectionMode === "range" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>از جزء</Label>
              <Select
                value={state.fromJuz != null ? String(state.fromJuz) : ""}
                onValueChange={(v) =>
                  updateState({ fromJuz: Number(v), toJuz: state.toJuz ?? 30 })
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JUZ_OPTIONS.map((j) => (
                    <SelectItem key={j.value} value={String(j.value)}>
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>تا جزء</Label>
              <Select
                value={state.toJuz != null ? String(state.toJuz) : ""}
                onValueChange={(v) =>
                  updateState({ toJuz: Number(v), fromJuz: state.fromJuz ?? 1 })
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JUZ_OPTIONS.map((j) => (
                    <SelectItem
                      key={j.value}
                      value={String(j.value)}
                      disabled={
                        state.fromJuz != null && j.value < state.fromJuz
                      }
                    >
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllJuz}
              >
                انتخاب همه
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAllJuz}
              >
                پاک کردن
              </Button>
              {state.selectedJuz.length > 0 && (
                <span className="text-sm text-gray-600">
                  {state.selectedJuz.length} جزء انتخاب شده
                </span>
              )}
            </div>
            <div
              className="border rounded-lg p-3 max-h-[200px] overflow-y-auto"
              dir="rtl"
            >
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {JUZ_OPTIONS.map((j) => (
                  <div key={j.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`juz-${j.value}`}
                      checked={state.selectedJuz.includes(j.value)}
                      onCheckedChange={() => toggleJuz(j.value)}
                    />
                    <Label
                      htmlFor={`juz-${j.value}`}
                      className="cursor-pointer text-sm"
                    >
                      {j.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Summary */}
      <div className="p-3 bg-primary/10 rounded-lg">
        <p className="text-sm text-primary">
          <strong>خلاصه انتخاب:</strong>
          {hasAny ? (
            <span className="block mt-1">
              {state.useSurahFilter && hasSurah && <span>سوره: {surahSummary}</span>}
              {state.useSurahFilter && hasSurah && state.useJuzFilter && hasJuz && " | "}
              {state.useJuzFilter && hasJuz && <span>جزء: {juzSummary}</span>}
            </span>
          ) : (
            <span className="text-amber-700">حداقل یکی از سوره یا جزء را انتخاب کنید</span>
          )}
        </p>
      </div>
    </div>
  );
}
