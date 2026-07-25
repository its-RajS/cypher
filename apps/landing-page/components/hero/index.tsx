import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

const Hero = () => {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-16 z-20 grid h-1 grid-cols-5"
      >
        <span className="bg-[var(--brand-primary)]" />
        <span className="bg-[var(--brand-secondary)]" />
        <span className="bg-[var(--brand-highlight)]" />
        <span className="bg-[var(--brand-tertiary)]" />
        <span className="bg-[var(--brand-neutral)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-[var(--brand-secondary)] opacity-35 blur-3xl" />
        <div className="absolute left-[38%] top-12 h-48 w-48 rounded-full bg-[var(--brand-highlight)] opacity-45 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-[var(--brand-tertiary)] opacity-20 blur-3xl" />
      </div>
      <div className="hidden md:block pointer-events-none min-h-[60vh] sm:min-h-[85vh] absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 80% at 70% 50%, black 0%, black 35%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 70% 50%, black 0%, black 35%, transparent 75%)",
          }}
        >
          <div
            data-us-project="3eLGLP7pmQS4ozfklmrX"
            className="absolute inset-0"
            style={{ transform: "translateX(20%)" }}
          ></div>
        </div>
      </div>

      <section className="relative flex min-h-[60vh] sm:min-h-[85vh] items-center overflow-hidden pt-20 pb-10 sm:pt-24">
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 sm:px-6 md:grid-cols-2 lg:gap-16">
          {/* Left Column - High Information Density */}
          <div className="flex flex-col justify-center space-y-5 sm:space-y-8 animate-fadeSlideIn animation-delay-100">
            {/* Version Badge */}
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-highlight)] border border-[var(--brand-tertiary)] text-[#443a13] text-xs font-medium mb-2 sm:mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-tertiary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-tertiary)]"></span>
              </span>
              v1.0.0 is now live
            </Badge>

            {/* Headline with the brand palette in the key phrase */}
            <h1 className="text-3xl leading-[1.15] tracking-tight font-light sm:text-5xl lg:text-6xl">
              Developer-first{" "}
              <span className="font-semibold text-foreground underline decoration-[var(--brand-tertiary)] decoration-4 underline-offset-8">
                video infrastructure
              </span>
              .
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-foreground/70 max-w-lg">
              Video hosting built for SaaS teams and startups. Upload,
              transcode, and stream with a lightweight SDK — with transparent
              pricing and no hidden playback or transcoding surprises.
            </p>

            {/* Capability Bullets */}
            <ul className="space-y-2.5 sm:space-y-3 text-sm text-foreground/60">
              <li className="flex items-center gap-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="var(--brand-tertiary)" strokeWidth={1.8} className="shrink-0" />

                <span>One SDK to upload, encode, and stream globally</span>
              </li>
              <li className="flex items-center gap-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="var(--brand-primary)" strokeWidth={1.8} className="shrink-0" />
                <span>Adaptive HLS playback optimized for performance</span>
              </li>
              <li className="flex items-center gap-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="var(--brand-secondary)" strokeWidth={1.8} className="shrink-0" />
                <span>Built-in analytics, watermarking, and protection </span>
              </li>

              <li className="flex items-center gap-3">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="var(--brand-neutral)" strokeWidth={1.8} className="shrink-0" />
                <span>
                  Transparent pricing — storage is yours, playback resets
                  monthly
                </span>
              </li>
            </ul>

            {/* CTAs - Professional & Restrained */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
              {/* Primary CTA - Solid, minimal */}
              <Link
                href="#get-started"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                Start Free
              </Link>

              {/* Secondary CTA - Ghost style */}
              <Link
                href="#docs"
                className="inline-flex justify-center md:justify-start items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                View API docs
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          {/* Right Column - Visual Space for Animation */}
          <div className="relative hidden md:flex items-center justify-center animate-fadeSlideIn animation-delay-200"></div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
