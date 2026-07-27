import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import ThemeWrapper from "@/providers/theme-provider";
import { Toaster } from "sonner";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard - Cypher",
  description:
    "Modern APIs for ingesting, transcoding, and streaming video at scale. Ship upload flows, on-demand playback, and live pipelines without building your own media stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeWrapper>
            <QueryProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-w-0 overflow-y-auto bg-background px-4 pb-6 pt-16 text-foreground md:p-6">
                  <div aria-hidden="true" className="mb-6 grid h-1.5 w-full grid-cols-5 overflow-hidden rounded-full">
                    <span className="bg-[var(--brand-primary)]" />
                    <span className="bg-[var(--brand-secondary)]" />
                    <span className="bg-[var(--brand-highlight)]" />
                    <span className="bg-[var(--brand-tertiary)]" />
                    <span className="bg-[var(--brand-neutral)]" />
                  </div>
                  <div className="dashboard-surface">{children}</div>
                </main>
              </div>
              <Toaster
                position="top-right"
                theme="system"
                toastOptions={{
                  className:
                    "bg-card text-foreground border-border",
                  closeButton: true,
                }}
              />
            </QueryProvider>
          </ThemeWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
