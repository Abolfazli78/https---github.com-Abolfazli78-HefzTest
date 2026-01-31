import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { AccessLevel, SelectionMode } from "@/generated";
import { checkAccess } from "@/lib/access";
import type { Prisma } from "@/generated/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "TEACHER" && session.user.role !== "INSTITUTE")) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    // Redirect to the correct exams API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: await request.text(),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد آزمون" },
      { status: 500 }
    );
  }
}
