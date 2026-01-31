"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddTeacherPage() {
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;

        setIsLoading(true);
        setStatus(null);

        try {
            const response = await fetch("/api/institute/teachers/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ type: "success", message: "معلم با موفقیت به موسسه شما اضافه شد." });
                setPhone("");
            } else {
                setStatus({ type: "error", message: result.error || "خطا در افزودن معلم" });
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
                <h1 className="text-3xl font-bold mb-2">افزودن معلم به موسسه</h1>
                <p className="text-muted-foreground">با وارد کردن شماره تلفن معلم، او را به کادر آموزشی موسسه خود اضافه کنید.</p>
            </div>

            <Card className="border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-indigo-500" />
                        جستجو و افزودن معلم
                    </CardTitle>
                    <CardDescription>معلم باید قبلاً با نقش &quot;معلم&quot; در سامانه ثبت‌نام کرده باشد.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="space-y-6">
                        {status && (
                            <Alert variant={status.type === "success" ? "default" : "destructive"} className={status.type === "success" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : ""}>
                                {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertDescription>{status.message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="phone">شماره تلفن معلم</Label>
                            <div className="relative">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="09123456789"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pr-10 h-12"
                                    dir="ltr"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                            {isLoading ? "در حال بررسی..." : "افزودن به موسسه"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-slate-600" />
                        <div className="text-sm text-slate-800 dark:text-slate-200 space-y-2">
                            <p className="font-bold">نکات مدیریتی:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>فقط کاربرانی که نقش &quot;معلم&quot; دارند قابل افزودن به موسسه هستند.</li>
                                <li>هر معلم فقط می‌تواند عضو یک موسسه باشد.</li>
                                <li>شما می‌توانید عملکرد تمامی معلمان و دانش‌آموزان آن‌ها را رصد کنید.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
