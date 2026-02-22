import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/session-provider";
import { Navbar } from "@/components/common/navbar";
import { InvitationBanner } from "@/components/organization/invitation-banner";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "سیستم تست حفظ - Online Memorization Test",
  description: "سیستم پیشرفته تست حفظ با پشتیبانی کامل از زبان فارسی و عربی",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://hefztest.ir"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "حفظ تست",
    url: "https://hefztest.ir/",
    logo: "https://hefztest.ir/LOGO.jpg",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "حفظ تست",
    url: "https://hefztest.ir/",
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className="font-persian antialiased"
      >
        <Providers>
          <Navbar />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
          {children}
          <InvitationBanner />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
