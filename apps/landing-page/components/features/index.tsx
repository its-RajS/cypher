import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics02Icon,
  CloudUploadIcon,
  FileCheckIcon,
  GlobeIcon,
  Search01Icon,
  SubtitleIcon,
} from "@hugeicons/core-free-icons";
import React from "react";

const features = [
  {
    icon: CloudUploadIcon,
    color: "var(--brand-primary)",
    ink: "#ffffff",
    title: "Upload & Transcode",
    desc: "Upload once. Vidmox handles encoding, adaptive HLS, and optimization for fast global playback.",
  },
  {
    icon: Search01Icon,
    color: "var(--brand-secondary)",
    ink: "#252b55",
    title: "Customizable Player",
    desc: "Match your brand. Control UI, colors, watermark, and playback behavior.",
  },
  {
    icon: Analytics02Icon,
    color: "var(--brand-tertiary)",
    ink: "#3d170c",
    title: "Advanced Analytics",
    desc: "Understand watch time, drop-offs, viewer engagement, and performance trends.",
  },
  {
    icon: FileCheckIcon,
    color: "var(--brand-highlight)",
    ink: "#443a13",
    title: "Built-in Protection",
    desc: "Custom watermark, piracy protection, OTP security — no extra setup.",
  },
  {
    icon: GlobeIcon,
    color: "var(--brand-neutral)",
    ink: "#17303a",
    title: "Global CDN Delivery",
    desc: "Stream from edge servers worldwide with low latency and adaptive bitrate.",
  },
  {
    icon: SubtitleIcon,
    color: "var(--brand-primary)",
    ink: "#ffffff",
    title: "AI-Powered Captions",
    desc: "Auto-generate accurate subtitles and transcriptions for every video.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-semibold text-[var(--brand-primary-readable)] mb-3">
            Features
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Powerful video infrastructure without the infrastructure overhead.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-xl border border-primary/30 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: f.color }} />
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: f.color, color: f.ink }}
              >
                <HugeiconsIcon icon={f.icon} size={18} color="currentColor" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
