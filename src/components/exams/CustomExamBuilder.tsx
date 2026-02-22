"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, BookOpen, Target, Settings, Calendar, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubscriptionLock } from "@/components/subscription/subscription-lock";
import { FEATURES } from "@/lib/subscription-constants";
import { CreateCustomExamInput } from "@/lib/examValidation";
import {
  QuranSelectionStep,
  initialQuranSelectionState,
  type QuranSelectionState,
} from "@/components/custom-exam/quran-selection-step";
import { quranSelectionToApiPayload, getQuranSelectionSummary } from "@/lib/quranSelectionToApi";

/** Minimum questions = sum of active selections (surahs when useSurah + juz when useJuz). */
function getMinQuestionLimit(state: QuranSelectionState): number {
  let surahCount = 0;
  if (state.useSurahFilter) {
    if (state.surahSelectionMode === "range" && state.fromSurah != null && state.toSurah != null) {
      const from = Math.min(state.fromSurah, state.toSurah);
      const to = Math.max(state.fromSurah, state.toSurah);
      surahCount = to - from + 1;
    } else if (state.surahSelectionMode === "multiple" && state.selectedSurahs.length > 0) {
      surahCount = state.selectedSurahs.length;
    }
  }
  let juzCount = 0;
  if (state.useJuzFilter) {
    if (state.juzSelectionMode === "range" && state.fromJuz != null && state.toJuz != null) {
      const from = Math.min(state.fromJuz, state.toJuz);
      const to = Math.max(state.fromJuz, state.toJuz);
      juzCount = to - from + 1;
    } else if (state.juzSelectionMode === "multiple" && state.selectedJuz.length > 0) {
      juzCount = state.selectedJuz.length;
    }
  }
  return surahCount + juzCount || 1;
}

export type CustomExamRole = "USER" | "TEACHER" | "INSTITUTE";

export interface AssignableStudent {
  id: string;
  name?: string;
  email?: string;
}

export interface CustomExamBuilderProps {
  role: CustomExamRole;
  assignableStudents?: AssignableStudent[];
  demoMode?: boolean;
  demoConfig?: {
    juzRange: [number, number];
    year: string;
    questionCount: number;
  };
}

const YEAR_OPTIONS = Array.from({ length: 20 }, (_, i) => ({
  value: (1385 + i).toString(),
  label: `سال ${1385 + i}`,
}));

const DIFFICULTY_OPTIONS = [
  { value: "Easy", label: "آسان" },
  { value: "Medium", label: "متوسط" },
  { value: "Hard", label: "سخت" },
];

const TOPIC_OPTIONS = [
  { value: "memorization", label: "حفظ" },
  { value: "concepts", label: "مفاهیم" },
];

function getSuccessRedirect(role: CustomExamRole): string {
  switch (role) {
    case "TEACHER":
      return "/teacher/exams";
    case "INSTITUTE":
      return "/institute/exams";
    default:
      return "/exams";
  }
}

export function CustomExamBuilder({ role, assignableStudents, demoMode = false, demoConfig }: CustomExamBuilderProps) {
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [quranSelection, setQuranSelection] = useState<QuranSelectionState>(
    initialQuranSelectionState
  );
  const [surahSearch, setSurahSearch] = useState("");
  const [yearRange, setYearRange] = useState({
    fromYear: "1385",
    toYear: "1404",
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [topic, setTopic] = useState<string[]>([]);
  const [questionCountError, setQuestionCountError] = useState("");
  const [examSettings, setExamSettings] = useState({
    title: "",
    description: "",
    duration: "30",
    questionCount: "10",
    passingScore: "70",
    randomizeQuestions: true,
    showResults: true,
    allowRetake: false,
  });

  const isQuickDemo = demoMode && !demoConfig;

  const minQuestionLimit = useMemo(() => getMinQuestionLimit(quranSelection), [quranSelection]);

  useEffect(() => {
    setQuestionCountError("");
  }, [currentStep]);

  // Demo mode: set defaults and jump to final step
  useEffect(() => {
    if (!demoMode) return;
    const isQuickDemo = demoMode && !demoConfig;
    if (isQuickDemo) {
      setQuranSelection({
        ...initialQuranSelectionState,
        useSurahFilter: false,
        useJuzFilter: true,
        surahSelectionMode: "range",
        juzSelectionMode: "multiple",
        selectedJuz: [1, 2, 3, 4, 5, 6],
      });
      setYearRange({ fromYear: "1404", toYear: "1404" });
      setSelectedDifficulty("Medium");
      setExamSettings((prev) => ({
        ...prev,
        title: prev.title || "آزمون دمو جزء ۱ تا ۶",
        duration: "20",
        questionCount: "30",
      }));
      setCurrentStep(6);
      return;
    }
    if (demoConfig) {
      setQuranSelection({
        ...initialQuranSelectionState,
        useSurahFilter: false,
        useJuzFilter: true,
        surahSelectionMode: "range",
        juzSelectionMode: "multiple",
        selectedJuz: [],
        fromJuz: demoConfig.juzRange[0],
        toJuz: demoConfig.juzRange[1],
      });
      setYearRange({ fromYear: demoConfig.year, toYear: demoConfig.year });
      setSelectedDifficulty("Medium");
      setExamSettings((prev) => ({
        ...prev,
        duration: "20",
        questionCount: String(demoConfig.questionCount),
      }));
      setCurrentStep(1);
    }
  }, [demoMode, demoConfig]);

  const handleTopicChange = (value: string, checked: boolean) => {
    if (checked) {
      setTopic((prev) => (prev.includes(value) ? prev : [...prev, value]));
    } else {
      setTopic((prev) => prev.filter((t) => t !== value));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!quranSelection.useSurahFilter && !quranSelection.useJuzFilter) {
        toast.error("حداقل یکی از سوره یا جزء باید انتخاب شود");
        return;
      }
      const hasSurah =
        (quranSelection.surahSelectionMode === "range" &&
          quranSelection.fromSurah != null &&
          quranSelection.toSurah != null) ||
        (quranSelection.surahSelectionMode === "multiple" &&
          quranSelection.selectedSurahs.length > 0);
      const hasJuz =
        (quranSelection.juzSelectionMode === "range" &&
          quranSelection.fromJuz != null &&
          quranSelection.toJuz != null) ||
        (quranSelection.juzSelectionMode === "multiple" &&
          quranSelection.selectedJuz.length > 0);
      if (quranSelection.useSurahFilter && !hasSurah) {
        toast.error("لطفاً محدوده یا سوره‌های مورد نظر را انتخاب کنید");
        return;
      }
      if (quranSelection.useJuzFilter && !hasJuz) {
        toast.error("لطفاً محدوده یا اجزای مورد نظر را انتخاب کنید");
        return;
      }
      if (
        quranSelection.surahSelectionMode === "range" &&
        quranSelection.fromSurah != null &&
        quranSelection.toSurah != null &&
        quranSelection.fromSurah > quranSelection.toSurah
      ) {
        toast.error("سوره شروع نمی‌تواند بزرگتر از سوره پایان باشد");
        return;
      }
      if (
        quranSelection.juzSelectionMode === "range" &&
        quranSelection.fromJuz != null &&
        quranSelection.toJuz != null &&
        quranSelection.fromJuz > quranSelection.toJuz
      ) {
        toast.error("جزء شروع نمی‌تواند بزرگتر از جزء پایان باشد");
        return;
      }
    } else if (currentStep === 2) {
      if (parseInt(yearRange.fromYear) > parseInt(yearRange.toYear)) {
        toast.error("سال شروع نمی‌تواند بزرگتر از سال پایان باشد");
        return;
      }
    } else if (currentStep === 5) {
      const qCount = parseInt(examSettings.questionCount, 10);
      if (!Number.isFinite(qCount) || qCount < minQuestionLimit) {
        setQuestionCountError(`حداقل باید ${minQuestionLimit} سوال انتخاب کنید.`);
        return;
      }
      setQuestionCountError("");
      if (parseInt(examSettings.duration) < 5) {
        toast.error("مدت زمان آزمون باید حداقل 5 دقیقه باشد");
        return;
      }
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      if (!quranSelection.useSurahFilter && !quranSelection.useJuzFilter) {
        toast.error("حداقل یکی از سوره یا جزء باید انتخاب شود");
        return;
      }
      if (!examSettings.title.trim()) {
        toast.error("لطفاً عنوان آزمون را وارد کنید");
        return;
      }
      const questionCount = parseInt(examSettings.questionCount, 10);
      if (!Number.isFinite(questionCount) || questionCount < minQuestionLimit || questionCount > 200) {
        toast.error(`تعداد سوالات باید بین ${minQuestionLimit} تا 200 باشد`);
        return;
      }
      const duration = parseInt(examSettings.duration);
      if (duration < 5) {
        toast.error("مدت زمان آزمون باید حداقل 5 دقیقه باشد");
        return;
      }

      if (demoMode && demoConfig) {
        const params = new URLSearchParams();
        params.set("take", "1");
        params.set("year", demoConfig.year);
        const demoJuzValues = Array.from(
          { length: demoConfig.juzRange[1] - demoConfig.juzRange[0] + 1 },
          (_, i) => String(demoConfig.juzRange[0] + i)
        );
        params.set("juz", demoJuzValues.join(","));
        params.set("count", String(questionCount));
        if (examSettings.title) params.set("title", examSettings.title);
        router.push(`/demo?${params.toString()}`);
        return;
      }

      const quranPayload = quranSelectionToApiPayload(quranSelection);

      const topicPayload =
        topic.length === 0 ? "ALL" : topic.length === 1 ? topic[0] : topic;
      const examData: CreateCustomExamInput = {
        title: examSettings.title || undefined,
        description: examSettings.description || undefined,
        duration: parseInt(examSettings.duration) || undefined,
        questionCount: parseInt(examSettings.questionCount),
        passingScore: parseInt(examSettings.passingScore) || undefined,
        randomizeQuestions: examSettings.randomizeQuestions,
        showResults: examSettings.showResults,
        allowRetake: examSettings.allowRetake,
        ...quranPayload,
        yearStart: parseInt(yearRange.fromYear),
        yearEnd: parseInt(yearRange.toYear),
        difficulty: selectedDifficulty as "Easy" | "Medium" | "Hard",
        topic: topicPayload as any,
        isWholeQuran: false,
        excludePreviouslyUsed: false,
      };

      const cleanExamData = Object.fromEntries(
        Object.entries(examData).filter(([, value]) => value !== undefined)
      );

      console.log("CustomExam DEBUG - payload:", cleanExamData);

      const response = await fetch("/api/exams/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanExamData),
      });

      if (response.ok) {
        toast.success("آزمون با موفقیت ایجاد شد");
        router.push(getSuccessRedirect(role));
      } else {
        const error = await response.json();
        toast.error(error.error || error.message || "خطا در ایجاد آزمون");
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("خطا در ارتباط با سرور");
    }
  };

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const response = await fetch("/api/subscriptions/info");
        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data);
        }
      } catch (error) {
        console.error("Error fetching subscription info:", error);
      } finally {
        setLoading(false);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment") === "success";

    if (paymentSuccess) {
      window.history.replaceState({}, "", window.location.pathname);
      toast.success("پرداخت با موفقیت انجام شد! اشتراک شما فعال شد.");
      setTimeout(() => fetchSubscriptionInfo(), 1000);
    } else {
      fetchSubscriptionInfo();
    }
  }, []);

  const showLock = demoMode ? false : (loading || !subscriptionInfo?.hasActiveSubscription);

  return (
    <div className="space-y-8">
      {showLock ? (
        <SubscriptionLock
          feature={FEATURES.CUSTOM_EXAMS}
          title="ساخت آزمون دلخواه"
          description="ایجاد آزمون‌های دلخواه با تنظیمات پیشرفته فقط برای کاربران با اشتراک فعال در دسترس است"
          icon={<Target className="h-8 w-8" />}
        />
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ساخت آزمون دلخواه</h1>
            <p className="text-gray-600">آزمون خود را با دقت طراحی کنید</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto">
              {[
                { step: 1, label: "محدوده قرآن" },
                { step: 2, label: "محدوده سال" },
                { step: 3, label: "سطح دشواری" },
                { step: 4, label: "موضوعات" },
                { step: 5, label: "تنظیمات آزمون" },
                { step: 6, label: "تایید نهایی" },
              ].map(({ step, label }, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? "bg-accent text-accent-foreground"
                        : currentStep > step
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? "✓" : step}
                  </div>
                  <span
                    className={`mr-2 text-sm font-medium ${
                      currentStep === step
                        ? "text-accent"
                        : currentStep > step
                          ? "text-green-600"
                          : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                  {i < 5 && (
                    <div
                      className={`w-4 h-0.5 ml-1 ${currentStep > step ? "bg-green-600" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 1 && <BookOpen className="h-5 w-5" />}
                  {currentStep === 2 && <Calendar className="h-5 w-5" />}
                  {currentStep === 3 && <TrendingUp className="h-5 w-5" />}
                  {currentStep === 4 && <Target className="h-5 w-5" />}
                  {currentStep === 5 && <Settings className="h-5 w-5" />}
                  {currentStep === 6 && <Target className="h-5 w-5" />}
                  {currentStep === 1 && "محدوده قرآن"}
                  {currentStep === 2 && "محدوده سال"}
                  {currentStep === 3 && "سطح دشواری"}
                  {currentStep === 4 && "موضوعات آزمون"}
                  {currentStep === 5 && "تنظیمات آزمون"}
                  {currentStep === 6 && "تایید نهایی"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentStep === 1 && (
                  <QuranSelectionStep
                    state={quranSelection}
                    onChange={setQuranSelection}
                    surahSearch={surahSearch}
                    onSurahSearchChange={setSurahSearch}
                    allowSurahFilter={demoConfig ? false : true}
                    allowedJuz={
                      demoConfig
                        ? Array.from(
                            { length: demoConfig.juzRange[1] - demoConfig.juzRange[0] + 1 },
                            (_, i) => demoConfig.juzRange[0] + i
                          )
                        : undefined
                    }
                  />
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">محدوده سال آزمون</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>از سال</Label>
                          <Select
                            value={yearRange.fromYear}
                            onValueChange={(value) =>
                              setYearRange((prev) => ({ ...prev, fromYear: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {YEAR_OPTIONS.map((year) => (
                                <SelectItem
                                  key={year.value}
                                  value={year.value}
                                  disabled={!!demoConfig && year.value !== demoConfig.year}
                                >
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>تا سال</Label>
                          <Select
                            value={yearRange.toYear}
                            onValueChange={(value) =>
                              setYearRange((prev) => ({ ...prev, toYear: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {YEAR_OPTIONS.map((year) => (
                                <SelectItem
                                  key={year.value}
                                  value={year.value}
                                  disabled={
                                    parseInt(year.value) < parseInt(yearRange.fromYear) ||
                                    (!!demoConfig && year.value !== demoConfig.year)
                                  }
                                >
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-primary">
                        <strong>محدوده انتخاب شده:</strong> از سال {yearRange.fromYear} تا سال{" "}
                        {yearRange.toYear}
                      </p>
                    </div>
                  </>
                )}

{currentStep === 3 && (
  <>
    <div className="space-y-4">
      <h3 className="text-lg font-medium">سطح دشواری سوالات</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DIFFICULTY_OPTIONS.map((difficulty) => {
          const isMedium = difficulty.value === "MEDIUM";
          const isSelected = selectedDifficulty === "MEDIUM";

          return (
            <div
              key={difficulty.value}
              className={`flex items-center space-x-3 space-x-reverse p-4 border rounded-lg
                ${
                  isMedium
                    ? "cursor-pointer hover:bg-gray-50 border-primary"
                    : "opacity-40 cursor-not-allowed bg-gray-100"
                }`}
              onClick={() => {
                if (isMedium) {
                  setSelectedDifficulty("MEDIUM");
                }
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  isSelected
                    ? "bg-accent border-accent"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>

              <Label className={isMedium ? "cursor-pointer" : "cursor-not-allowed"}>
                {difficulty.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>

    <div className="p-3 bg-primary/10 rounded-lg">
      <p className="text-sm text-primary">
        <strong>
          موقتا فقط سطح متوسط در دسترس است. سطح انتخاب شده:
        </strong>{" "}
        متوسط
      </p>
    </div>
  </>
)}





                {currentStep === 4 && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">موضوعات آزمون</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TOPIC_OPTIONS.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg"
                          >
                            <Checkbox
                              id={option.value}
                              checked={topic.includes(option.value)}
                              onCheckedChange={(checked) =>
                                handleTopicChange(option.value, checked as boolean)
                              }
                            />
                            <Label htmlFor={option.value} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>موضوعات انتخاب شده:</strong>{" "}
                        {topic.length > 0
                          ? topic
                              .map((t) => TOPIC_OPTIONS.find((opt) => opt.value === t)?.label)
                              .join("، ")
                          : "هیچ موضوعی انتخاب نشده"}
                      </p>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان آزمون</Label>
                        <Input
                          id="title"
                          value={examSettings.title}
                          onChange={(e) =>
                            setExamSettings((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="مثال: آزمون حفظ قرآن - جزء اول"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">توضیحات (اختیاری)</Label>
                        <Textarea
                          id="description"
                          value={examSettings.description}
                          onChange={(e) =>
                            setExamSettings((prev) => ({ ...prev, description: e.target.value }))
                          }
                          placeholder="توضیحات کوتاه درباره آزمون"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="questionCount">تعداد سوالات</Label>
                          <Input
                            id="questionCount"
                            type="number"
                            value={examSettings.questionCount}
                            onChange={(e) => {
                              setExamSettings((prev) => ({ ...prev, questionCount: e.target.value }));
                            }}
                            disabled={!!demoConfig}
                          />
                          {questionCountError && (
                            <p className="text-xs text-red-600 mt-1">{questionCountError}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            تعداد سوالات بر اساس تعداد انتخاب‌های شما محاسبه شده است. حداقل مجاز: {minQuestionLimit}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min={5}
                            value={examSettings.duration}
                            onChange={(e) =>
                              setExamSettings((prev) => ({ ...prev, duration: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="passingScore">نمره قبولی (%)</Label>
                          <Input
                            id="passingScore"
                            type="number"
                            min={0}
                            max={100}
                            value={examSettings.passingScore}
                            onChange={(e) =>
                              setExamSettings((prev) => ({ ...prev, passingScore: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Checkbox
                            id="randomizeQuestions"
                            checked={examSettings.randomizeQuestions}
                            onCheckedChange={(checked) =>
                              setExamSettings((prev) => ({
                                ...prev,
                                randomizeQuestions: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="randomizeQuestions">ترتیب تصادفی سوالات</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Checkbox
                            id="showResults"
                            checked={examSettings.showResults}
                            onCheckedChange={(checked) =>
                              setExamSettings((prev) => ({
                                ...prev,
                                showResults: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="showResults">نمایش نتایج به شرکت‌کننده</Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Checkbox
                            id="allowRetake"
                            checked={examSettings.allowRetake}
                            onCheckedChange={(checked) =>
                              setExamSettings((prev) => ({
                                ...prev,
                                allowRetake: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="allowRetake">اجازه مجدد شرکت در آزمون</Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">خلاصه آزمون</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">عنوان آزمون</p>
                            <p className="font-medium">{examSettings.title || "بدون عنوان"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">مدت زمان</p>
                            <p className="font-medium">{examSettings.duration} دقیقه</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">تعداد سوالات</p>
                            <p className="font-medium">{examSettings.questionCount} سوال</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">نمره قبولی</p>
                            <p className="font-medium">{examSettings.passingScore}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">محدوده قرآن</p>
                            <p className="font-medium">
                              {getQuranSelectionSummary(quranSelection)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">محدوده سال</p>
                            <p className="font-medium">
                              از سال {yearRange.fromYear} تا سال {yearRange.toYear}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">سطح دشواری</p>
                            <p className="font-medium">
                              {DIFFICULTY_OPTIONS.find((d) => d.value === selectedDifficulty)?.label}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">موضوعات</p>
                            <p className="font-medium">
                              {topic
                                .map((t) => TOPIC_OPTIONS.find((opt) => opt.value === t)?.label)
                                .join("، ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ترتیب سوالات</p>
                            <p className="font-medium">
                              {examSettings.randomizeQuestions ? "تصادفی" : "ثابت"}
                            </p>
                          </div>
                        </div>
                        {examSettings.description && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">توضیحات</p>
                            <p className="font-medium">{examSettings.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>توجه:</strong> پس از ایجاد آزمون، امکان ویرایش محدوده سوالات
                          وجود نخواهد داشت. لطفاً اطلاعات را با دقت بررسی کنید.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    <ChevronRight className="ml-2 h-4 w-4" />
                    مرحله قبل
                  </Button>
                  {isQuickDemo ? (
                    <Button onClick={() => router.push("/demo?take=1&year=1404&juz=1,2,3,4,5&count=25&topic=memorization,concepts")}> 
                      شروع دمو
                      <ChevronLeft className="mr-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={currentStep === 6 ? handleSubmitExam : handleNextStep}>
                      {currentStep === 6 ? "ایجاد آزمون" : "مرحله بعد"}
                      <ChevronLeft className="mr-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
