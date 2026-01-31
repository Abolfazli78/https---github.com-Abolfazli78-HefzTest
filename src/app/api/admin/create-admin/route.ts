import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists",
        phone: existingAdmin.phone,
        email: existingAdmin.email,
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await db.user.create({
      data: {
        name: "Admin",
        phone: "+989999999999",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
        phoneVerifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Admin created successfully",
      phone: admin.phone,
      email: admin.email,
      password: "admin123",
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
