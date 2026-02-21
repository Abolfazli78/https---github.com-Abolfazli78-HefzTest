 import { NextResponse } from "next/server";
 import { z } from "zod";
 import { getServerSession } from "@/lib/session";
 import { db } from "@/lib/db";
 
 const schema = z.object({
   name: z.string().min(3),
   phone: z.string().optional(),
   email: z.string().email(),
   subject: z.enum(["support", "exam", "suggestion", "other"]),
   message: z.string().min(10),
 });
 
 export async function POST(req: Request) {
   try {
     const body = await req.json();
     const parsed = schema.safeParse(body);
     if (!parsed.success) {
       return NextResponse.json(
         { error: "اطلاعات ارسالی نامعتبر است" },
         { status: 400 }
       );
     }
 
     const { name, phone, email, subject, message } = parsed.data;
 
     // If user is logged-in, create a support ticket for better tracking
     const session = await getServerSession();
     if (session?.user?.id) {
       const ticket = await db.supportTicket.create({
         data: {
           userId: session.user.id,
           subject:
             subject === "support"
               ? "پشتیبانی فنی"
               : subject === "exam"
               ? "سوال درباره آزمون"
               : subject === "suggestion"
               ? "پیشنهاد"
               : "سایر",
           category: "CONTACT",
           messages: {
             create: [
               {
                 userId: session.user.id,
                 message: `نام: ${name}\nایمیل: ${email}\n${
                   phone ? `تلفن: ${phone}\n` : ""
                 }موضوع: ${subject}\n\n${message}`,
                 isAdmin: false,
               },
             ],
           },
         },
       });
 
       return NextResponse.json({
         ok: true,
         ticketId: ticket.id,
       });
     }
 
     // Otherwise, just accept and return success (without DB persistence)
     return NextResponse.json({ ok: true });
   } catch (error) {
     console.error("Contact form error:", error);
     return NextResponse.json(
       { error: "خطا در ثبت پیام" },
       { status: 500 }
     );
   }
 }
 
