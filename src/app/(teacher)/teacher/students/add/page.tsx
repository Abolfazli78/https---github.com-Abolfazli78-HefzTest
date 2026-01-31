"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddStudentPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setStatus(null);

        try {
            const response = await fetch("/api/teacher/students/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: "دانش‌آموز با موفقیت به لیست شما اضافه شد." });
                setEmail("");
            } else {
                setStatus({ type: "error", message: result.error || "خطا در افزودن دانش‌آموز" });
            }
        } catch (error) {
            setStatus({ type: "error", message: "خطا در برقراری ارتباط با سرور" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">افزودن دانش‌آموز</h1>
                <p className="text-muted-foreground">با وارد کردن ایمیل دانش‌آموز، او را به گروه خود اضافه کنید.</p>
            </div>

            <Card className="border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-emerald-500" />
                        جستجو و افزودن
                    </CardTitle>
                    <CardDescription>دانش‌آموز باید قبلاً در سامانه ثبت‌نام کرده باشد.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-6">
                        {status && (
                            <Alert variant={status.type === "success" ? "default" : "destructive"} className={status.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                                {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertDescription>{status.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">آدرس ایمیل دانش‌آموز</Label>
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pr-10 h-12"
                                    dir="ltr"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                            {isLoading ? "در حال بررسی..." : "افزودن به لیست من"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <p className="font-bold">نکات مهم:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>فقط کاربرانی که نقش &quot;دانش‌آموز&quot; دارند قابل افزودن هستند.</li>
                                <li>هر دانش‌آموز در هر زمان فقط می‌تواند تحت نظر یک معلم باشد.</li>
                                <li>پس از افزودن، شما می‌توانید نتایج آزمون‌های دانش‌آموز را مشاهده کنید.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
