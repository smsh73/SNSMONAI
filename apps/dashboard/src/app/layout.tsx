import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "SNSMON-AI | Social Media Monitoring",
    template: "%s | SNSMON-AI",
  },
  description:
    "AI-powered Social Media Monitoring System for Indonesian Government Agencies",
  keywords: [
    "social media monitoring",
    "crisis management",
    "sentiment analysis",
    "Indonesia",
    "government",
  ],
  authors: [{ name: "SNSMON-AI Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <I18nProvider>
              {children}
              <Toaster />
            </I18nProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
