import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    console.log('Fixing subscription plans...');

    // Update teacher plan
    const teacherPlan = await db.subscriptionPlan.update({
      where: { 
        id: "cb114038-0b4c-4a88-8026-fff0222ead57" 
      },
      data: { 
        targetRole: "TEACHER" 
      }
    });
    console.log('Updated teacher plan:', teacherPlan.name);

    // Update institute plan
    const institutePlan = await db.subscriptionPlan.update({
      where: { 
        id: "9f93ede6-1cb9-4263-8db6-4f1bca4bf419" 
      },
      data: { 
        targetRole: "INSTITUTE" 
      }
    });
    console.log('Updated institute plan:', institutePlan.name);

    return NextResponse.json({ 
      success: true,
      message: "پلن‌ها با موفقیت اصلاح شدند",
      updated: [
        { name: teacherPlan.name, targetRole: teacherPlan.targetRole },
        { name: institutePlan.name, targetRole: institutePlan.targetRole }
      ]
    });
  } catch (error) {
    console.error("Error fixing plans:", error);
    return NextResponse.json(
      { error: "خطا در اصلاح پلن‌ها" },
      { status: 500 }
    );
  }
}
