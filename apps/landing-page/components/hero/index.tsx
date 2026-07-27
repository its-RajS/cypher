import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import HeroThreads from "@/components/hero/hero-threads";

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-y-0 right-0 w-full opacity-40 dark:opacity-80 sm:w-[68%]"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 28%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 28%, black 100%)",
          }}
        >
          <HeroThreads />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--background) 0%, color-mix(in srgb, var(--background) 94%, transparent) 42%, transparent 74%)",
          }}
        />
      </div>

      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-24 sm:py-28">
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-10">
          {/* Left Column - High Information Density */}
          <div className="hero-copy-enter flex max-w-2xl flex-col justify-center">
            {/* Version Badge */}
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-tertiary)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-tertiary)]" />
              </span>
              <span className="font-mono font-medium text-foreground">
                Production API
              </span>
              <span className="text-muted-foreground">v1.0 live</span>
            </div>

            {/* Headline with the brand palette in the key phrase */}
            <h1 className="mt-7 max-w-[14ch] text-[clamp(3.25rem,6vw,5.75rem)] font-light leading-[0.96] tracking-[-0.04em] [text-wrap:balance]">
              Developer-first
              <span className="mt-2 block font-semibold text-foreground">
                video{" "}
                <span className="underline decoration-[var(--brand-tertiary)] decoration-[0.08em] underline-offset-[0.12em]">
                  infrastructure
                </span>
                .
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Video hosting built for SaaS teams and startups. Upload,
              transcode, and stream with a lightweight SDK — with transparent
              pricing and no hidden playback or transcoding surprises.
            </p>

            {/* Capability Bullets */}
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-foreground/75">
              {["Upload once", "Adaptive HLS", "Predictable pricing"].map(
                (item, index) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          index === 0
                            ? "var(--brand-tertiary)"
                            : index === 1
                              ? "var(--brand-primary-readable)"
                              : "var(--brand-secondary)",
                      }}
                    />
                    {item}
                  </li>
                ),
              )}
            </ul>

            {/* CTAs - Professional & Restrained */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Primary CTA - Solid, minimal */}
              <Link
                href="#get-started"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--brand-tertiary)] px-6 text-sm font-semibold text-[#2e1108] shadow-sm transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                Start Free
              </Link>

              {/* Secondary CTA - Ghost style */}
              <Link
                href="#docs"
                className="group inline-flex min-h-12 items-center justify-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground sm:justify-start"
              >
                View API docs
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  color="currentColor"
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Right Column - Visual Space for Animation */}
          <div aria-hidden="true" className="hidden min-h-[520px] lg:block" />
        </div>
      </section>
    </div>
  );
};

export default Hero;
