import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plan = await db.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json({ error: 'پلن یافت نشد' }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ error: 'خطا در دریافت اطلاعات پلن' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      price,
      duration,
      features,
      isActive,
      targetRole,
      examSimulatorEnabled,
      maxQuestionsPerMonth,
      maxStudentsAllowed,
      maxExamsPerMonth,
      maxTeachersAllowed,
      maxClassesAllowed,
    } = body;

    const plan = await db.subscriptionPlan.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined && price !== null ? parseFloat(price) : undefined,
        duration: duration !== undefined && duration !== null ? parseInt(duration) : undefined,
        features: features ? JSON.stringify(features) : null,
        isActive,
        targetRole: targetRole ?? undefined,
        examSimulatorEnabled: examSimulatorEnabled !== undefined ? Boolean(examSimulatorEnabled) : undefined,
        maxQuestionsPerMonth:
          maxQuestionsPerMonth !== undefined && maxQuestionsPerMonth !== null
            ? parseInt(maxQuestionsPerMonth)
            : undefined,
        maxStudentsAllowed:
          maxStudentsAllowed !== undefined && maxStudentsAllowed !== null
            ? parseInt(maxStudentsAllowed)
            : undefined,
        maxExamsPerMonth:
          maxExamsPerMonth !== undefined && maxExamsPerMonth !== null
            ? parseInt(maxExamsPerMonth)
            : undefined,
        maxTeachersAllowed:
          maxTeachersAllowed !== undefined && maxTeachersAllowed !== null
            ? parseInt(maxTeachersAllowed)
            : undefined,
        maxClassesAllowed:
          maxClassesAllowed !== undefined && maxClassesAllowed !== null
            ? parseInt(maxClassesAllowed)
            : undefined,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json({ error: 'خطا در ویرایش پلن' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    // Check if plan has active subscriptions
    const activeSubscriptions = await db.subscription.count({
      where: {
        planId: id,
        status: 'ACTIVE',
      },
    });

    if (activeSubscriptions > 0) {
      return NextResponse.json({ 
        error: 'این پلن دارای اشتراک‌های فعال است. ابتدا اشتراک‌ها را غیرفعال کنید.' 
      }, { status: 400 });
    }

    await db.subscriptionPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'پلن با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return NextResponse.json({ error: 'خطا در حذف پلن' }, { status: 500 });
  }
}
