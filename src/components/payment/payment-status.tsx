'use client';

import { useSearchParams } from 'next/navigation';

import { CheckCircle2, XCircle, ArrowRight, Receipt, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PaymentStatus() {
    const searchParams = useSearchParams();
    const paymentStatus = searchParams?.get('payment');
    const refId = searchParams?.get('refId');
    const code = searchParams?.get('code');
    const status = paymentStatus === 'success' ? 'success' : paymentStatus === 'failed' ? 'failed' : null;

    if (!status) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                {status === 'success' ? (
                    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CheckCircle2 className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                            <div className="h-20 w-20 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 shrink-0">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>

                            <div className="flex-1 text-center md:text-right space-y-2">
                                <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-400">پرداخت با موفقیت انجام شد</h3>
                                <p className="text-emerald-700/80 dark:text-emerald-400/70 font-medium max-w-lg">
                                    تبریک! اشتراک شما اکنون فعال است و می‌توانید از تمامی امکانات سیستم بدون محدودیت استفاده کنید.
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-emerald-500/10">
                                        <Receipt className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">شماره پیگیری:</span>
                                        <span className="text-sm font-black text-emerald-900 dark:text-emerald-200 tracking-wider" dir="ltr">{refId}</span>
                                    </div>

                                    <Link href="/dashboard">
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-bold">
                                            ورود به داشبورد
                                            <ArrowRight className="mr-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/10 backdrop-blur-xl p-8 shadow-2xl shadow-red-500/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <XCircle className="w-32 h-32 text-red-500" />
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                            <div className="h-20 w-20 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/40 shrink-0">
                                <XCircle className="w-10 h-10 text-white" />
                            </div>

                            <div className="flex-1 text-center md:text-right space-y-2">
                                <h3 className="text-2xl font-black text-red-900 dark:text-red-400">پرداخت ناموفق بود</h3>
                                <p className="text-red-700/80 dark:text-red-400/70 font-medium max-w-lg">
                                    متأسفانه در فرآیند پرداخت خطایی رخ داد. مبلغی از حساب شما کسر نشده است. در صورت کسر وجه، تا ۷۲ ساعت آینده به حساب شما بازگردانده می‌شود.
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-red-500/10">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-sm font-bold text-red-800 dark:text-red-300">کد خطا:</span>
                                        <span className="text-sm font-black text-red-900 dark:text-red-200 tracking-wider" dir="ltr">{code || 'N/A'}</span>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="rounded-xl h-10 px-6 font-bold border-red-500/20 hover:bg-red-500/10"
                                        onClick={() => window.location.href = '/subscriptions'}
                                    >
                                        تلاش مجدد
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
