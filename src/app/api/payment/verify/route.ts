import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { zarinpal } from '@/lib/zarinpal';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const paymentId = searchParams.get('paymentId');
    const redirectUrl = searchParams.get('redirect_url');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (status !== 'OK') {
        const failedUrl = redirectUrl ? `${baseUrl}${redirectUrl}?payment=failed&status=${status}` : `${baseUrl}/subscriptions?payment=failed&status=${status}`;
        return NextResponse.redirect(failedUrl);
    }

    if (!authority) {
        return NextResponse.json({ error: 'Missing authority' }, { status: 400 });
    }

    try {
        let payment;
        if (paymentId) {
            payment = await db.payment.findUnique({
                where: { id: paymentId },
                include: { subscription: { include: { plan: true } } },
            });
        } else {
            payment = await db.payment.findFirst({
                where: { transactionId: authority },
                include: { subscription: { include: { plan: true } } },
            });
        }

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Verify with ZarinPal
        const response = await zarinpal.verifications.verify({
            amount: Math.round(payment.amount),
            authority: authority,
        });

        if (response.data.code === 100 || response.data.code === 101) {
            // Success - Use transaction for atomicity
            const planDuration = payment.subscription.plan.duration;
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + planDuration);

            // Check for pending invitation
            const userId = payment.subscription.userId;
            const user = await db.user.findUnique({ where: { id: userId } });

            const pendingInvite = user
                ? await db.invitation.findFirst({
                      where: {
                          status: "PENDING",
                          OR: [
                              { phone: user.phone },
                              ...(user.email ? [{ phone: user.email }] : []),
                          ],
                      },
                      orderBy: { createdAt: "desc" },
                  })
                : null;

            await db.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'COMPLETED',
                        paidAt: new Date(),
                    },
                });

                await tx.subscription.update({
                    where: { id: payment.subscriptionId },
                    data: {
                        status: 'ACTIVE',
                        startDate: startDate,
                        endDate: endDate,
                    },
                });

                if (pendingInvite && user) {
                    await tx.user.update({
                        where: { id: user.id },
                        data: {
                            parentId: pendingInvite.senderId,
                            // Also update legacy fields
                            teacherId: pendingInvite.role === "STUDENT" ? pendingInvite.senderId : undefined,
                            instituteId: pendingInvite.role === "TEACHER" ? pendingInvite.senderId : undefined,
                        }
                    });

                    await tx.invitation.update({
                        where: { id: pendingInvite.id },
                        data: {
                            status: "ACCEPTED",
                            receiverId: user.id
                        }
                    });
                }
            });

            const successUrl = redirectUrl || `${baseUrl}/subscriptions`;
            return NextResponse.redirect(`${successUrl}?payment=success&refId=${response.data.ref_id}`);
        } else {
            return NextResponse.redirect(`${baseUrl}/subscriptions?payment=failed&code=${response.data.code}`);
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.redirect(`${baseUrl}/subscriptions?payment=failed&error=verification_failed`);
    }
}
