import type { Metadata } from "next";
import { Providers } from "@/components/providers/session-provider";
import { Navbar } from "@/components/common/navbar";
import { InvitationBanner } from "@/components/organization/invitation-banner";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "سیستم تست حفظ - Online Memorization Test",
  description: "سیستم پیشرفته تست حفظ با پشتیبانی کامل از زبان فارسی و عربی",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className="font-persian antialiased"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            {children}
            <InvitationBanner />
            <Toaster position="top-center" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
