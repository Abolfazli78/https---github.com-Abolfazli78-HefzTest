import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { PlanTargetRole } from "@/generated";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    const url = new URL(request.url);
    const targetRoleParam = url.searchParams.get("targetRole");

    console.log('API called with targetRoleParam:', targetRoleParam);
    console.log('Session user role:', session?.user?.role);

    const resolvedTargetRole =
      targetRoleParam ??
      (session?.user?.role === "TEACHER"
        ? "TEACHER"
        : session?.user?.role === "INSTITUTE"
          ? "INSTITUTE"
          : "STUDENT");

    console.log('Resolved targetRole:', resolvedTargetRole);

    const targetRole = (Object.values(PlanTargetRole) as string[]).includes(resolvedTargetRole)
      ? (resolvedTargetRole as (typeof PlanTargetRole)[keyof typeof PlanTargetRole])
      : PlanTargetRole.STUDENT;

    let plans = await db.subscriptionPlan.findMany({
      where:
        session?.user?.role === "ADMIN" && !targetRoleParam
          ? { isActive: true }
          : { isActive: true, targetRole },
      orderBy: { price: "asc" },
    });

    console.log('Found plans count:', plans.length);
    console.log('Plans targetRoles:', plans.map(p => p.targetRole));

    // TEMPORARY FIX: If we're looking for STUDENT plans but get non-STUDENT plans, fix them
    if (resolvedTargetRole === "STUDENT" && plans.length > 2) {
      console.log('Detected incorrect targetRoles, fixing...');
      
      // Fix teacher plan
      await db.subscriptionPlan.update({
        where: { id: "cb114038-0b4c-4a88-8026-fff0222ead57" },
        data: { targetRole: "TEACHER" }
      });
      
      // Fix institute plan  
      await db.subscriptionPlan.update({
        where: { id: "9f93ede6-1cb9-4263-8db6-4f1bca4bf419" },
        data: { targetRole: "INSTITUTE" }
      });
      
      console.log('Fixed incorrect targetRoles, refetching...');
      
      // Refetch plans
      plans = await db.subscriptionPlan.findMany({
        where: { isActive: true, targetRole },
        orderBy: { price: "asc" },
      });
      
      console.log('After fix - Found plans count:', plans.length);
      console.log('After fix - Plans targetRoles:', plans.map(p => p.targetRole));
    }

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "خطا در دریافت پلن‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      duration,
      features,
      isActive,
      targetRole,
      maxQuestionsPerMonth,
      maxStudentsAllowed,
      maxExamsPerMonth,
      maxTeachersAllowed,
      maxClassesAllowed,
    } = body;

    if (!name || !price || !duration) {
      return NextResponse.json(
        { error: "نام، قیمت و مدت زمان الزامی است" },
        { status: 400 }
      );
    }

    const plan = await db.subscriptionPlan.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        features: features ? JSON.stringify(features) : null,
        isActive: isActive !== false,
        targetRole: targetRole || "STUDENT",
        maxQuestionsPerMonth:
          maxQuestionsPerMonth !== undefined && maxQuestionsPerMonth !== null
            ? parseInt(maxQuestionsPerMonth)
            : 0,
        maxStudentsAllowed:
          maxStudentsAllowed !== undefined && maxStudentsAllowed !== null
            ? parseInt(maxStudentsAllowed)
            : 0,
        maxExamsPerMonth:
          maxExamsPerMonth !== undefined && maxExamsPerMonth !== null
            ? parseInt(maxExamsPerMonth)
            : 0,
        maxTeachersAllowed:
          maxTeachersAllowed !== undefined && maxTeachersAllowed !== null
            ? parseInt(maxTeachersAllowed)
            : 0,
        maxClassesAllowed:
          maxClassesAllowed !== undefined && maxClassesAllowed !== null
            ? parseInt(maxClassesAllowed)
            : 0,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد پلن" },
      { status: 500 }
    );
  }
}

