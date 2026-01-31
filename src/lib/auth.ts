import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { normalizePhone } from "./phone";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        console.log("🔐 AUTH DEBUG - Credentials received:", {
          phone: credentials?.phone,
          hasPassword: !!credentials?.password,
          hasOTP: !!credentials?.otp,
        });

        if (!credentials?.phone) {
          console.log("❌ AUTH DEBUG - No phone provided");
          return null;
        }

        const phone = normalizePhone(String(credentials.phone));
        const password = credentials.password ? String(credentials.password) : "";
        const otp = credentials.otp ? String(credentials.otp) : "";

        console.log("🔍 AUTH DEBUG - Looking for user with phone:", phone);
        console.log("🔍 AUTH DEBUG - Password/OTP values:", { 
          password: password ? "***" : "empty", 
          otp: otp ? "***" : "empty" 
        });

        const user = await db.user.findUnique({
          where: { phone },
        });

        if (!user || !user.isActive) {
          console.log("❌ AUTH DEBUG - User not found or inactive");
          return null;
        }

        console.log("✅ AUTH DEBUG - User found:", { id: user.id, name: user.name, role: user.role });

        // IF OTP PROVIDED - Skip password check
        if (otp) {
          console.log("🔐 AUTH DEBUG - Using OTP login flow");
          
          const record = await db.phoneOtp.findFirst({
            where: {
              phone,
              purpose: "LOGIN",
              consumedAt: null,
              expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
          });

          if (!record) {
            console.log("❌ AUTH DEBUG - No valid OTP record found");
            return null;
          }

          const isOtpValid = await bcrypt.compare(otp, record.codeHash);
          if (!isOtpValid) {
            console.log("❌ AUTH DEBUG - OTP mismatch");
            return null;
          }

          console.log("✅ AUTH DEBUG - OTP valid, consuming record");
          
          await db.phoneOtp.update({
            where: { id: record.id },
            data: { consumedAt: new Date() },
          });
        } 
        // IF PASSWORD PROVIDED - Skip OTP check
        else if (password) {
          console.log("🔐 AUTH DEBUG - Using password login flow");
          
          if (!user.password) {
            console.log("❌ AUTH DEBUG - User has no password set");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.log("❌ AUTH DEBUG - Password mismatch");
            return null;
          }

          console.log("✅ AUTH DEBUG - Password valid");
        } 
        // NEITHER PROVIDED
        else {
          console.log("❌ AUTH DEBUG - Neither password nor OTP provided");
          return null;
        }

        console.log("🎉 AUTH DEBUG - Login successful for user:", user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role: string }).role;
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

