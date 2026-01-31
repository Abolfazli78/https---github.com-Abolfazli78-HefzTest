import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ContentType } from "@/generated";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await db.homepageContent.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json({ error: "محتوا موجود نیست" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "خطا در دریافت محتوا" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { type, title, content, imageUrl, order, isActive } = body;

    const homepageContent = await db.homepageContent.update({
      where: { id },
      data: {
        type: type as ContentType,
        title: title || null,
        content: content || null,
        imageUrl: imageUrl || null,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive,
      },
    });

    return NextResponse.json(homepageContent);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی محتوا" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    await db.homepageContent.delete({
      where: { id },
    });

    return NextResponse.json({ message: "محتوا با موفقیت حذف شد" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json(
      { error: "خطا در حذف محتوا" },
      { status: 500 }
    );
  }
}

