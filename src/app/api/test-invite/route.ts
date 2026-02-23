import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Test API called");
    const body = await request.json();
    console.log("Test body:", body);
    
    return NextResponse.json({ 
      message: "تست با موفقیت انجام شد",
      received: body
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json({ error: "تست ناموفق بود" }, { status: 500 });
  }
}
