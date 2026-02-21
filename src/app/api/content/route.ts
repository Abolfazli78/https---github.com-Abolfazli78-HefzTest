import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ContentType } from "@prisma/client";

export async function GET() {
  try {
    const content = await db.homepageContent.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "خطا در دریافت محتوا" },
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
    const { type, title, content, imageUrl, order, isActive } = body;

    if (!type) {
      return NextResponse.json(
        { error: "نوع محتوا الزامی است" },
        { status: 400 }
      );
    }

    const homepageContent = await db.homepageContent.create({
      data: {
        type: type as ContentType,
        title: title || null,
        content: content || null,
        imageUrl: imageUrl || null,
        order: order || 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(homepageContent, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد محتوا" },
      { status: 500 }
    );
  }
}

