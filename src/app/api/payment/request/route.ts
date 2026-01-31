import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { zarinpal } from '@/lib/zarinpal';
import { getServerSession } from "@/lib/session";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
        }

        const body = await req.json();
        const { planId, discountCode } = body;
        const userId = session.user.id;

        if (!planId) {
            return NextResponse.json({ error: 'Missing planId' }, { status: 400 });
        }

        const plan = await db.subscriptionPlan.findUnique({
            where: { id: planId },
        });

        if (!plan || !plan.isActive) {
            return NextResponse.json({ error: 'پلن مورد نظر یافت نشد یا غیرفعال است' }, { status: 404 });
        }

        const requiredRole = plan.targetRole;
        if (requiredRole && session.user.role !== requiredRole) {
            return NextResponse.json(
                { error: 'این پلن برای نقش کاربری شما قابل خرید نیست' },
                { status: 403 }
            );
        }

        // Check if user already has an active subscription
        const activeSubscription = await db.subscription.findFirst({
            where: {
                userId: userId,
                status: 'ACTIVE',
                endDate: {
                    gt: new Date(),
                },
            },
        });

        if (activeSubscription) {
            return NextResponse.json({ error: 'شما در حال حاضر یک اشتراک فعال دارید' }, { status: 400 });
        }

        // Calculate discount
        let finalAmount = plan.price;
        let discountApplied = 0;
        if (discountCode) {
            const discount = await db.discountCode.findFirst({
                where: {
                    code: discountCode.toUpperCase(),
                    isActive: true,
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gt: new Date() } },
                    ],
                },
            });

            if (!discount) {
                return NextResponse.json({ error: 'کد تخفیف معتبر نیست' }, { status: 400 });
            }

            if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
                return NextResponse.json({ error: 'محدودیت استفاده از این کد تخفیف به پایان رسیده است' }, { status: 400 });
            }

            discountApplied = Math.round(plan.price * (discount.percent / 100));
            finalAmount = plan.price - discountApplied;

            // Increment usage count
            await db.discountCode.update({
                where: { id: discount.id },
                data: { usedCount: { increment: 1 } },
            });
        }

        // Create Subscription (Pending)
        const subscription = await db.subscription.create({
            data: {
                userId,
                planId,
                status: 'PENDING',
                startDate: new Date(),
                // endDate will be set upon activation
            },
        });

        // Create Payment (Pending) with final amount
        const payment = await db.payment.create({
            data: {
                subscriptionId: subscription.id,
                amount: finalAmount,
                status: 'PENDING',
            },
        });

        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/verify?paymentId=${payment.id}`;

        const response = await zarinpal.payments.create({
            amount: Math.round(finalAmount),
            callback_url: callbackUrl,
            description: `Payment for ${plan.name}${discountApplied ? ` (with ${discountCode} discount)` : ''}`,
            currency: 'IRT',
        });

        if (response.data && response.data.authority) {
            await db.payment.update({
                where: { id: payment.id },
                data: { transactionId: response.data.authority }
            });

            const isSandbox = process.env.NODE_ENV !== 'production';
            const gatewayUrl = isSandbox
                ? `https://sandbox.zarinpal.com/pg/StartPay/${response.data.authority}`
                : `https://payment.zarinpal.com/pg/StartPay/${response.data.authority}`;

            return NextResponse.json({
                url: gatewayUrl,
                authority: response.data.authority,
                discountApplied,
                finalAmount,
            });
        } else {
            return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
        }

    } catch (error) {
        console.error('Payment Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
