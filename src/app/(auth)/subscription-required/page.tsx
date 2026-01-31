import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubscriptionRequiredPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
                <CardHeader className="pt-10">
                    <div className="mx-auto w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                        <Crown className="h-10 w-10 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">نیاز به اشتراک ویژه</CardTitle>
                    <CardDescription className="text-lg mt-2">
                        برای دسترسی به امکانات پنل پیشرفته، نیاز به تهیه اشتراک ویژه دارید.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-10">
                    <p className="text-muted-foreground">
                        با تهیه اشتراک می‌توانید دانش‌آموزان خود را مدیریت کنید، آزمون‌های اختصاصی طراحی کنید و گزارش‌های پیشرفته دریافت کنید.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link href="/subscriptions">
                            <Button className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700 text-white">
                                مشاهده و خرید اشتراک
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="w-full h-12">
                                <ArrowLeft className="ml-2 h-4 w-4" />
                                بازگشت به داشبورد معمولی
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
