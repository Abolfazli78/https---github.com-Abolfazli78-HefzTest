"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  User,
  Inbox,
  MessageSquare,
  ShieldCheck,
  SendHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "لطفاً نام و نام خانوادگی را وارد کنید"),
  phone: z.string().optional(),
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("فرمت ایمیل معتبر نیست"),
  subject: z.enum(["support", "exam", "suggestion", "other"]),
  message: z.string().min(10, "متن پیام باید حداقل ۱۰ کاراکتر باشد"),
  website: z.string().optional(), // honeypot
});

export default function ContactClient() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "support",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const validateField = (field: keyof typeof values, value: string) => {
    const parsed = schema.safeParse({ ...values, [field]: value });
    const newErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        // @ts-ignore zod path indexes
        const key = issue.path[0] as string;
        newErrors[key] = issue.message;
      }
    }
    setErrors(newErrors);
  };

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setValues((prev) => ({ ...prev, [field]: v }));
      validateField(field, v);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmittedOnce(true);

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        // @ts-ignore
        const key = issue.path[0] as string;
        newErrors[key] = issue.message;
      }
      setErrors(newErrors);
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    // Honeypot
    if (values.website && values.website.trim().length > 0) {
      toast.error("ارسال نامعتبر");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone || undefined,
          email: values.email,
          subject: values.subject,
          message: values.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "خطا در ارسال پیام");
      }

      toast.success(
        "پیام شما با موفقیت ثبت شد. در اسرع وقت پاسخ داده خواهد شد."
      );
      setValues({
        name: "",
        phone: "",
        email: "",
        subject: "support",
        message: "",
        website: "",
      });
      setErrors({});
    } catch (err: any) {
      toast.error(err?.message || "خطا در ارسال پیام");
    } finally {
      setSubmitting(false);
    }
  };

  const brandBtn =
    "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400/50 shadow-md hover:shadow-lg transition-all rounded-xl";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Intro */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            تماس با ما
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-8">
            در صورت وجود هرگونه سوال، پیشنهاد یا مشکل در استفاده از سامانه تست
            حفظ، از طریق فرم زیر با ما در ارتباط باشید. تیم پشتیبانی در
            کوتاه‌ترین زمان پاسخ‌گو خواهد بود.
          </p>
        </section>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact info card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-indigo-600" />
                اطلاعات تماس
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Mail className="h-5 w-5 text-indigo-600" />}
                  label="ایمیل پشتیبانی"
                  value="support@hefztest.ir"
                />
                <InfoItem
                  icon={<Phone className="h-5 w-5 text-indigo-600" />}
                  label="شماره تماس"
                  value="0939 361 5821"
                />
                <InfoItem
                  icon={<Clock className="h-5 w-5 text-indigo-600" />}
                  label="ساعات پاسخ‌گویی"
                  value="همه روزه ۹ تا ۱۸"
                />
                <InfoItem
                  icon={<MapPin className="h-5 w-5 text-indigo-600" />}
                  label="آدرس"
                  value="— در صورت نیاز —"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form card */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                فرم تماس
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <div className="hidden">
                  <Label htmlFor="website">وب‌سایت</Label>
                  <Input
                    id="website"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={values.website}
                    onChange={handleChange("website")}
                  />
                </div>

                <Field
                  id="name"
                  label="نام و نام خانوادگی"
                  required
                  icon={<User className="h-4 w-4 text-muted-foreground" />}
                  error={submittedOnce ? errors.name : undefined}
                >
                  <Input
                    id="name"
                    placeholder="مثلاً: علی رضایی"
                    value={values.name}
                    onChange={handleChange("name")}
                    disabled={submitting}
                    className="pr-9"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="phone"
                    label="شماره تماس (اختیاری)"
                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                    error={submittedOnce ? errors.phone : undefined}
                  >
                    <Input
                      id="phone"
                      placeholder="09xx xxx xxxx"
                      value={values.phone}
                      onChange={handleChange("phone")}
                      disabled={submitting}
                      className="pr-9"
                    />
                  </Field>

                  <Field
                    id="email"
                    label="ایمیل"
                    required
                    icon={<Mail className="h-4 w-4 text-muted-foreground" />}
                    error={submittedOnce ? errors.email : undefined}
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={values.email}
                      onChange={handleChange("email")}
                      disabled={submitting}
                      className="pr-9"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      موضوع پیام<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.subject}
                      onValueChange={(v) => {
                        setValues((p) => ({ ...p, subject: v as any }));
                        validateField("subject", v);
                      }}
                      disabled={submitting}
                    >
                      <SelectTrigger id="subject" className="rounded-xl">
                        <SelectValue placeholder="انتخاب موضوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="support">پشتیبانی فنی</SelectItem>
                        <SelectItem value="exam">سوال درباره آزمون</SelectItem>
                        <SelectItem value="suggestion">پیشنهاد</SelectItem>
                        <SelectItem value="other">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                    {submittedOnce && errors.subject && (
                      <p className="text-xs text-red-600">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <Field
                  id="message"
                  label="متن پیام"
                  required
                  icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
                  error={submittedOnce ? errors.message : undefined}
                >
                  <Textarea
                    id="message"
                    placeholder="پیام خود را با جزئیات بنویسید..."
                    value={values.message}
                    onChange={handleChange("message")}
                    disabled={submitting}
                    className="min-h-36 pr-9"
                  />
                </Field>

                <Button
                  type="submit"
                  className={brandBtn + " w-full sm:w-auto px-6 h-11 gap-2"}
                  disabled={submitting}
                >
                  <SendHorizontal className="h-4 w-4" />
                  {submitting ? "در حال ارسال..." : "ارسال پیام"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Confidentiality box */}
        <div className="rounded-2xl border bg-card p-4 md:p-5 flex items-start gap-3">
          <div className="mt-1">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-sm text-muted-foreground leading-7">
            تمامی اطلاعات ارسالی کاربران محرمانه بوده و صرفاً جهت پاسخ‌گویی مورد
            استفاده قرار می‌گیرد.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className="shrink-0">{icon}</div>
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  icon,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {children}
        {icon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
