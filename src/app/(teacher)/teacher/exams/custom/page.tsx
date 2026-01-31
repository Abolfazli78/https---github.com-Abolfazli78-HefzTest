"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, BookOpen, Clock, Users, Target, Settings, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubscriptionLock } from "@/components/subscription/subscription-lock";
import { FEATURES } from "@/lib/subscription-constants";

export default function CustomExamPage() {
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [quranRange, setQuranRange] = useState({
    fromJuz: "1",
    toJuz: "30",
    fromSurah: "1",
    toSurah: "114"
  });
  const [rangeType, setRangeType] = useState<"juz" | "surah">("juz");
  const [yearRange, setYearRange] = useState({
    fromYear: "1385",
    toYear: "1404"
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [examSettings, setExamSettings] = useState({
    title: "",
    description: "",
    duration: "30",
    questionCount: "10",
    passingScore: "70",
    randomizeQuestions: true,
    showResults: true,
    allowRetake: false
  });

  const juzOptions = Array.from({ length: 30 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `جزء ${i + 1}`
  }));

  const surahOptions = [
    { value: "1", label: "سوره فاتحه" },
    { value: "2", label: "سوره بقره" },
    { value: "3", label: "سوره آل عمران" },
    { value: "4", label: "سوره نساء" },
    { value: "5", label: "سوره مائده" },
    { value: "6", label: "سوره انعام" },
    { value: "114", label: "سوره ناس" }
  ];

  const yearOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (1385 + i).toString(),
    label: `سال ${1385 + i}`
  }));

  const difficultyOptions = [
    { value: "all", label: "همه سطوح" },
    { value: "easy", label: "آسان" },
    { value: "medium", label: "متوسط" },
    { value: "hard", label: "سخت" }
  ];

  const topicOptions = [
    { value: "memorization", label: "حفظ" },
    { value: "concepts", label: "مفاهیم" }
  ];

  const handleTopicChange = (topic: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics([...selectedTopics, topic]);
    } else {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate Quran range based on selected type
      if (rangeType === "juz") {
        if (parseInt(quranRange.fromJuz) > parseInt(quranRange.toJuz)) {
          toast.error("جزء شروع نمی‌تواند بزرگتر از جزء پایان باشد");
          return;
        }
      } else {
        if (parseInt(quranRange.fromSurah) > parseInt(quranRange.toSurah)) {
          toast.error("سوره شروع نمی‌تواند بزرگتر از سوره پایان باشد");
          return;
        }
      }
    } else if (currentStep === 2) {
      // Validate year range
      if (parseInt(yearRange.fromYear) > parseInt(yearRange.toYear)) {
        toast.error("سال شروع نمی‌تواند بزرگتر از سال پایان باشد");
        return;
      }
    } else if (currentStep === 3) {
      // Validate difficulty - no validation needed for difficulty selection
      // Always valid since user must select one of the predefined options
    } else if (currentStep === 4) {
      // Validate topics
      if (selectedTopics.length === 0) {
        toast.error("حداقل یک موضوع را انتخاب کنید");
        return;
      }
    } else if (currentStep === 5) {
      // Validate question count and duration
      if (parseInt(examSettings.questionCount) < 1) {
        toast.error("تعداد سوالات باید حداقل 1 باشد");
        return;
      }
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

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const response = await fetch('/api/subscriptions/info');
        if (response.ok) {
          const data = await response.json();
          console.log('Subscription info:', data);
          setSubscriptionInfo(data);
        }
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, []);

  const handleSubmitExam = async () => {
    try {
      const examData = {
        title: examSettings.title,
        description: examSettings.description,
        duration: parseInt(examSettings.duration),
        questionCount: parseInt(examSettings.questionCount),
        passingScore: parseInt(examSettings.passingScore),
        randomizeQuestions: examSettings.randomizeQuestions,
        showResults: examSettings.showResults,
        allowRetake: examSettings.allowRetake,
        selectionMode: rangeType === "juz" ? "JUZ" : "SURAH",
        fromJuz: rangeType === "juz" ? parseInt(quranRange.fromJuz) : null,
        toJuz: rangeType === "juz" ? parseInt(quranRange.toJuz) : null,
        fromSurah: rangeType === "surah" ? parseInt(quranRange.fromSurah) : null,
        toSurah: rangeType === "surah" ? parseInt(quranRange.toSurah) : null,
        fromYear: parseInt(yearRange.fromYear),
        toYear: parseInt(yearRange.toYear),
        difficulty: selectedDifficulty,
        topics: selectedTopics,
        rangeType: rangeType
      };

      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (response.ok) {
        toast.success("آزمون با موفقیت ایجاد شد");
        router.push('/teacher/exams');
      } else {
        const error = await response.json();
        toast.error(error.error || error.message || "خطا در ایجاد آزمون");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="space-y-8">
      {/* Show lock if user doesn't have access */}
      {(loading || !subscriptionInfo?.hasActiveSubscription) ? (
        <SubscriptionLock 
          feature={FEATURES.CUSTOM_EXAMS}
          title="ساخت آزمون دلخواه"
          description="ایجاد آزمون‌های دلخواه با تنظیمات پیشرفته فقط برای کاربران با اشتراک فعال در دسترس است"
          icon={<Target className="h-8 w-8" />}
        />
      ) : (
        <>
          {/* Header */}
          <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ساخت آزمون دلخواه</h1>
        <p className="text-gray-600">آزمون خود را با دقت طراحی کنید</p>
      </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 1 ? "bg-blue-600 text-white" : 
                currentStep > 1 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 1 ? "✓" : "1"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 1 ? "text-blue-600" : 
                currentStep > 1 ? "text-green-600" : "text-gray-500"
              }`}>محدوده قرآن</span>
            </div>
            <div className={`w-4 h-0.5 ${currentStep > 1 ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2 ? "bg-blue-600 text-white" : 
                currentStep > 2 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 2 ? "✓" : "2"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 2 ? "text-blue-600" : 
                currentStep > 2 ? "text-green-600" : "text-gray-500"
              }`}>محدوده سال</span>
            </div>
            <div className={`w-4 h-0.5 ${currentStep > 2 ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 3 ? "bg-blue-600 text-white" : 
                currentStep > 3 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 3 ? "✓" : "3"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 3 ? "text-blue-600" : 
                currentStep > 3 ? "text-green-600" : "text-gray-500"
              }`}>سطح دشواری</span>
            </div>
            <div className={`w-4 h-0.5 ${currentStep > 3 ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 4 ? "bg-blue-600 text-white" : 
                currentStep > 4 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 4 ? "✓" : "4"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 4 ? "text-blue-600" : 
                currentStep > 4 ? "text-green-600" : "text-gray-500"
              }`}>موضوعات</span>
            </div>
            <div className={`w-4 h-0.5 ${currentStep > 4 ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 5 ? "bg-blue-600 text-white" : 
                currentStep > 5 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 5 ? "✓" : "5"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 5 ? "text-blue-600" : 
                currentStep > 5 ? "text-green-600" : "text-gray-500"
              }`}>تنظیمات آزمون</span>
            </div>
            <div className={`w-4 h-0.5 ${currentStep > 5 ? "bg-green-600" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 6 ? "bg-blue-600 text-white" : 
                currentStep > 6 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-500"
              }`}>
                {currentStep > 6 ? "✓" : "6"}
              </div>
              <span className={`mr-2 text-sm font-medium ${
                currentStep === 6 ? "text-blue-600" : 
                currentStep > 6 ? "text-green-600" : "text-gray-500"
              }`}>تایید نهایی</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
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
              {/* Step 1: Quran Range Selection */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">نوع محدوده قرآن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                           onClick={() => setRangeType("juz")}>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          rangeType === "juz" ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {rangeType === "juz" && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <Label className="cursor-pointer">انتخاب بر اساس اجزاء</Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                           onClick={() => setRangeType("surah")}>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          rangeType === "surah" ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {rangeType === "surah" && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <Label className="cursor-pointer">انتخاب بر اساس سوره‌ها</Label>
                      </div>
                    </div>
                  </div>

                  {rangeType === "juz" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">محدوده اجزاء</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>از جزء</Label>
                          <Select
                            value={quranRange.fromJuz}
                            onValueChange={(value) => setQuranRange(prev => ({ ...prev, fromJuz: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {juzOptions.map((juz) => (
                                <SelectItem key={juz.value} value={juz.value}>
                                  {juz.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>تا جزء</Label>
                          <Select
                            value={quranRange.toJuz}
                            onValueChange={(value) => setQuranRange(prev => ({ ...prev, toJuz: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {juzOptions.map((juz) => (
                                <SelectItem 
                                  key={juz.value} 
                                  value={juz.value}
                                  disabled={parseInt(juz.value) < parseInt(quranRange.fromJuz)}
                                >
                                  {juz.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {rangeType === "surah" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">محدوده سوره‌ها</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>از سوره</Label>
                          <Select
                            value={quranRange.fromSurah}
                            onValueChange={(value) => setQuranRange(prev => ({ ...prev, fromSurah: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {surahOptions.map((surah) => (
                                <SelectItem key={surah.value} value={surah.value}>
                                  {surah.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>تا سوره</Label>
                          <Select
                            value={quranRange.toSurah}
                            onValueChange={(value) => setQuranRange(prev => ({ ...prev, toSurah: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {surahOptions.map((surah) => (
                                <SelectItem 
                                  key={surah.value} 
                                  value={surah.value}
                                  disabled={parseInt(surah.value) < parseInt(quranRange.fromSurah)}
                                >
                                  {surah.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>محدوده انتخاب شده:</strong> 
                      {rangeType === "juz" 
                        ? ` از جزء ${quranRange.fromJuz} تا جزء ${quranRange.toJuz}`
                        : ` از سوره ${quranRange.fromSurah} تا سوره ${quranRange.toSurah}`
                      }
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Year Range Selection */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">محدوده سال آزمون</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>از سال</Label>
                        <Select
                          value={yearRange.fromYear}
                          onValueChange={(value) => setYearRange(prev => ({ ...prev, fromYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
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
                          onValueChange={(value) => setYearRange(prev => ({ ...prev, toYear: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem 
                                key={year.value} 
                                value={year.value}
                                disabled={parseInt(year.value) < parseInt(yearRange.fromYear)}
                              >
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>محدوده انتخاب شده:</strong> از سال {yearRange.fromYear} تا سال {yearRange.toYear}
                    </p>
                  </div>
                </>
              )}

              {/* Step 3: Difficulty Level */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">سطح دشواری سوالات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {difficultyOptions.map((difficulty) => (
                        <div key={difficulty.value} className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                             onClick={() => setSelectedDifficulty(difficulty.value)}>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedDifficulty === difficulty.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                          }`}>
                            {selectedDifficulty === difficulty.value && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <Label className="cursor-pointer">{difficulty.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>سطح انتخاب شده:</strong> {difficultyOptions.find(d => d.value === selectedDifficulty)?.label}
                    </p>
                  </div>
                </>
              )}

              {/* Step 4: Topics Selection */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">موضوعات آزمون</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topicOptions.map((topic) => (
                        <div key={topic.value} className="flex items-center space-x-3 space-x-reverse p-4 border rounded-lg">
                          <Checkbox
                            id={topic.value}
                            checked={selectedTopics.includes(topic.value)}
                            onCheckedChange={(checked) => handleTopicChange(topic.value, checked as boolean)}
                          />
                          <Label htmlFor={topic.value} className="cursor-pointer">{topic.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>موضوعات انتخاب شده:</strong> {selectedTopics.length > 0 ? selectedTopics.map(t => topicOptions.find(opt => opt.value === t)?.label).join('، ') : 'هیچ موضوعی انتخاب نشده'}
                    </p>
                  </div>
                </>
              )}

              {/* Step 5: Exam Settings */}
              {currentStep === 5 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">عنوان آزمون</Label>
                      <Input
                        id="title"
                        value={examSettings.title}
                        onChange={(e) => setExamSettings(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="مثال: آزمون حفظ قرآن - جزء اول"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">توضیحات (اختیاری)</Label>
                      <Textarea
                        id="description"
                        value={examSettings.description}
                        onChange={(e) => setExamSettings(prev => ({ ...prev, description: e.target.value }))}
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
                          min="1"
                          value={examSettings.questionCount}
                          onChange={(e) => setExamSettings(prev => ({ ...prev, questionCount: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="5"
                          value={examSettings.duration}
                          onChange={(e) => setExamSettings(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passingScore">نمره قبولی (%)</Label>
                        <Input
                          id="passingScore"
                          type="number"
                          min="0"
                          max="100"
                          value={examSettings.passingScore}
                          onChange={(e) => setExamSettings(prev => ({ ...prev, passingScore: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="randomizeQuestions"
                          checked={examSettings.randomizeQuestions}
                          onCheckedChange={(checked) => setExamSettings(prev => ({ ...prev, randomizeQuestions: checked as boolean }))}
                        />
                        <Label htmlFor="randomizeQuestions">ترتیب تصادفی سوالات</Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="showResults"
                          checked={examSettings.showResults}
                          onCheckedChange={(checked) => setExamSettings(prev => ({ ...prev, showResults: checked as boolean }))}
                        />
                        <Label htmlFor="showResults">نمایش نتایج به شرکت‌کننده</Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Checkbox
                          id="allowRetake"
                          checked={examSettings.allowRetake}
                          onCheckedChange={(checked) => setExamSettings(prev => ({ ...prev, allowRetake: checked as boolean }))}
                        />
                        <Label htmlFor="allowRetake">اجازه مجدد شرکت در آزمون</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 6: Final Confirmation */}
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
                            {rangeType === "juz" 
                              ? `از جزء ${quranRange.fromJuz} تا جزء ${quranRange.toJuz}`
                              : `از سوره ${quranRange.fromSurah} تا سوره ${quranRange.toSurah}`
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">محدوده سال</p>
                          <p className="font-medium">از سال {yearRange.fromYear} تا سال {yearRange.toYear}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">سطح دشواری</p>
                          <p className="font-medium">{difficultyOptions.find(d => d.value === selectedDifficulty)?.label}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">موضوعات</p>
                          <p className="font-medium">{selectedTopics.map(t => topicOptions.find(opt => opt.value === t)?.label).join('، ')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ترتیب سوالات</p>
                          <p className="font-medium">{examSettings.randomizeQuestions ? "تصادفی" : "ثابت"}</p>
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
                        <strong>توجه:</strong> پس از ایجاد آزمون، امکان ویرایش محدوده سوالات وجود نخواهد داشت. لطفاً اطلاعات را با دقت بررسی کنید.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                >
                  <ChevronRight className="ml-2 h-4 w-4" />
                  مرحله قبل
                </Button>
                <Button onClick={currentStep === 6 ? handleSubmitExam : handleNextStep}>
                  {currentStep === 6 ? "ایجاد آزمون" : "مرحله بعد"}
                  <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
      )}
    </div>
  );
}
