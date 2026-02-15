"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "30",
    targetRole: "STUDENT" as "STUDENT" | "TEACHER" | "INSTITUTE",
    features: [] as string[],
    examSimulatorEnabled: false,
    isActive: true,
    maxQuestionsPerMonth: "",
    maxStudentsAllowed: "",
    maxExamsPerMonth: "",
    maxTeachersAllowed: "",
    maxClassesAllowed: "",
  });

  const featureOptions = [
    { id: "unlimited_exams", label: "آزمون نامحدود" },
    { id: "advanced_analytics", label: "تحلیل پیشرفته" },
    { id: "custom_questions", label: "سوالات دلخواه" },
    { id: "priority_support", label: "پشتیبانی اولویت‌دار" },
    { id: "ticket_support", label: "پشتیبانی تیکتی" },
    { id: "white_label", label: "برند سفید" },
    { id: "export_data", label: "خروجی داده‌ها" },
    { id: "advanced_reports", label: "گزارشات پیشرفته" }
  ];

  const visibleFeatures = featureOptions.filter((f) => {
    if (formData.targetRole !== "INSTITUTE" && f.id === "white_label") return false;
    return true;
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/subscriptions/plans/${id}`);
        if (response.ok) {
          const plan = await response.json();
          // Parse features if it's a string, otherwise use as array
          const parsedFeatures = typeof plan.features === 'string' 
            ? JSON.parse(plan.features) 
            : plan.features || [];
          
          setFormData({
            name: plan.name || "",
            description: plan.description || "",
            price: plan.price?.toString() || "",
            duration: plan.duration?.toString() || "30",
            targetRole: (plan.targetRole as any) || "STUDENT",
            features: parsedFeatures,
            examSimulatorEnabled: plan.examSimulatorEnabled === true,
            isActive: plan.isActive !== false,
            maxQuestionsPerMonth: plan.maxQuestionsPerMonth?.toString?.() || "",
            maxStudentsAllowed: plan.maxStudentsAllowed?.toString?.() || "",
            maxExamsPerMonth: plan.maxExamsPerMonth?.toString?.() || "",
            maxTeachersAllowed: plan.maxTeachersAllowed?.toString?.() || "",
            maxClassesAllowed: plan.maxClassesAllowed?.toString?.() || "",
          });
        } else {
          toast.error("پلن یافت نشد");
          router.push('/admin/subscriptions');
        }
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات پلن");
        router.push('/admin/subscriptions');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id, router]);

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter(f => f !== featureId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/subscriptions/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          features: formData.features, // Send as array, API will handle JSON.stringify
          examSimulatorEnabled: formData.examSimulatorEnabled,
          maxExamsPerMonth: formData.maxExamsPerMonth ? parseInt(formData.maxExamsPerMonth) : 0,
          maxStudentsAllowed: formData.maxStudentsAllowed ? parseInt(formData.maxStudentsAllowed) : 0,
          maxQuestionsPerMonth: formData.maxQuestionsPerMonth ? parseInt(formData.maxQuestionsPerMonth) : 0,
          maxTeachersAllowed: formData.maxTeachersAllowed ? parseInt(formData.maxTeachersAllowed) : 0,
          maxClassesAllowed: formData.maxClassesAllowed ? parseInt(formData.maxClassesAllowed) : 0,
        }),
      });

      if (response.ok) {
        toast.success("پلن با موفقیت ویرایش شد");
        router.push('/admin/subscriptions');
      } else {
        const error = await response.json();
        toast.error(error.error || error.message || "خطا در ویرایش پلن");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("آیا از حذف این پلن اطمینان دارید؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/subscriptions/plans/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("پلن با موفقیت حذف شد");
        router.push('/admin/subscriptions');
      } else {
        const error = await response.json();
        toast.error(error.error || error.message || "خطا در حذف پلن");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            بازگشت
          </Button>
          <div>
            <h1 className="text-2xl font-bold">ویرایش پلن</h1>
            <p className="text-gray-600">اطلاعات پلن اشتراک را ویرایش کنید</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          حذف پلن
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات پلن</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">نام پلن *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: پلن طلایی"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">قیمت (تومان) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="50000"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="توضیحات کامل پلن و ویژگی‌های آن"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>نقش هدف</Label>
                <Select
                  value={formData.targetRole}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetRole: value as "STUDENT" | "TEACHER" | "INSTITUTE",
                      features: value === "INSTITUTE" ? prev.features : prev.features.filter((f) => f !== "white_label"),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
                    <SelectItem value="TEACHER">معلم</SelectItem>
                    <SelectItem value="INSTITUTE">موسسه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">مدت زمان (روز) *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 روز</SelectItem>
                    <SelectItem value="60">60 روز</SelectItem>
                    <SelectItem value="90">90 روز</SelectItem>
                    <SelectItem value="180">180 روز</SelectItem>
                    <SelectItem value="365">365 روز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxExamsPerMonth">حداکثر آزمون در ماه</Label>
                <Input
                  id="maxExamsPerMonth"
                  type="number"
                  min="0"
                  value={formData.maxExamsPerMonth}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxExamsPerMonth: e.target.value }))}
                  placeholder="نامحدود"
                />
              </div>
              <div>
                <Label htmlFor="maxStudentsAllowed">حداکثر دانش‌آموزان</Label>
                <Input
                  id="maxStudentsAllowed"
                  type="number"
                  min="0"
                  value={formData.maxStudentsAllowed}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStudentsAllowed: e.target.value }))}
                  placeholder="نامحدود"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxQuestionsPerMonth">حداکثر سوالات در ماه</Label>
                <Input
                  id="maxQuestionsPerMonth"
                  type="number"
                  min="0"
                  value={formData.maxQuestionsPerMonth}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxQuestionsPerMonth: e.target.value }))}
                  placeholder="نامحدود"
                />
              </div>
              {(formData.targetRole === "TEACHER" || formData.targetRole === "INSTITUTE") && (
                <div>
                  <Label htmlFor="maxClassesAllowed">حداکثر کلاس‌ها</Label>
                  <Input
                    id="maxClassesAllowed"
                    type="number"
                    min="0"
                    value={formData.maxClassesAllowed}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxClassesAllowed: e.target.value }))}
                    placeholder="نامحدود"
                  />
                </div>
              )}
              {formData.targetRole === "INSTITUTE" && (
                <div>
                  <Label htmlFor="maxTeachersAllowed">حداکثر معلم‌ها</Label>
                  <Input
                    id="maxTeachersAllowed"
                    type="number"
                    min="0"
                    value={formData.maxTeachersAllowed}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxTeachersAllowed: e.target.value }))}
                    placeholder="نامحدود"
                  />
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <Label>ویژگی‌های پلن</Label>
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  id="examSimulatorEnabled"
                  checked={formData.examSimulatorEnabled}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, examSimulatorEnabled: checked === true }))
                  }
                />
                <Label htmlFor="examSimulatorEnabled" className="cursor-pointer font-normal">
                  شبیه ساز آزمون
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {visibleFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={feature.id}
                      checked={formData.features.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked as boolean)}
                    />
                    <Label htmlFor={feature.id} className="cursor-pointer">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                پلن فعال باشد
              </Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "در حال ویرایش..." : "ویرایش پلن"}
                <Edit className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
