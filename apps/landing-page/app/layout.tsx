import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import ThemeWrapper from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cypher — Developer-first Video Infrastructure",
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
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
        >
          <ThemeWrapper>{children}</ThemeWrapper>

          {/* Iconify for icons */}
          <Script
            src="https://code.iconify.design/3/3.1.0/iconify.min.js"
            strategy="lazyOnload"
          />

          {/* Scroll animation observer */}
          <Script id="scroll-observer" strategy="lazyOnload">
            {`
            (function () {
              const once = true;
              if (!window.__inViewIO) {
                window.__inViewIO = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add("animate");
                      if (once) window.__inViewIO.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
              }
              window.initInViewAnimations = function (selector = ".animate-on-scroll") {
                document.querySelectorAll(selector).forEach((el) => {
                  window.__inViewIO.observe(el);
                });
              };
              document.addEventListener("DOMContentLoaded", () => window.initInViewAnimations());
            })();
          `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}
