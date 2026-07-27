import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "For side projects and experiments.",
    features: [
      "5GB storage",
      "only HD (720p) streaming",
      "1,000 playback minutes / month",
      "720p resolution encoding",
      "API access",
      "Advanced analytics",
      "Cypher watermark",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$14.99",
    desc: "For growing apps that need room.",
    features: [
      "250GB storage",
      "10,000 playback minutes / month",
      "Multi-bitrate adaptive streaming (360p–1080p)",
      "API access",
      "Advanced analytics",
      "Custom watermark",
      "Automatic Subtitle Generations",
      "Piracy protection",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29.99",
    desc: "For growing SaaS products.",
    badge: "Most Popular",
    features: [
      "600GB storage",
      "22,000 playback minutes / month",
      "Multi-bitrate adaptive streaming (360p–1080p)",
      "API access",
      "Advanced analytics",
      "Custom watermark",
      "Automatic Subtitle Generations",
      "Piracy protection",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$69.99",
    desc: "For high-volume video platforms.",
    features: [
      "2TB storage",
      "50,000 playback minutes / month",
      "Multi-bitrate adaptive streaming (360p–1080p)",
      "API access",
      "Advanced analytics",
      "Custom watermark",
      "Automatic Subtitle Generations",
      "Piracy protection",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="py-16 sm:py-24 overflow-hidden border-y border-border bg-secondary/45"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-semibold text-[var(--brand-primary-readable)] mb-3">
            Pricing
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
            Simple. Predictable. Transparent.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Storage stays. Playback minutes reset every billing cycle.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-6 flex flex-col transition-colors ${plan.highlighted
                ? "border-2 border-[var(--brand-tertiary)] bg-card"
                : "border border-primary bg-card hover:border-primary"
                }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--brand-tertiary)] text-[#3d170c] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-5">
                <div
                  className={`text-xs font-medium tracking-wide uppercase mb-2 ${plan.highlighted ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {plan.name}
                </div>
                <div className="text-3xl font-semibold text-foreground tracking-tight">
                  {plan.price}
                  <span className="text-sm text-muted-foreground font-normal">
                    {" "}
                    / month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => {
                  const storageMatch = feature.match(
                    /^(\d+(?:\.\d+)?)\s*(GB|TB)\s+storage$/i,
                  );

                  return (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground group"
                    >
                      <HugeiconsIcon icon={CheckIcon} size={16} color={plan.highlighted ? "var(--foreground)" : "var(--brand-primary)"} strokeWidth={1.8} className="shrink-0 mt-0.5" />
                      <span className="flex-1 flex items-center gap-1.5 flex-wrap">
                        {feature}
                        {storageMatch && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <HugeiconsIcon icon={InformationCircleIcon} size={16} color="var(--foreground)" className="opacity-70 hover:opacity-100 transition-colors cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="max-w-70 p-4 bg-card border border-primary shadow-xl"
                            >
                              <div className="space-y-2">
                                <p className="font-semibold text-foreground text-sm">
                                  Estimated Capacity
                                </p>
                                <p className="text-foreground/75 text-xs leading-relaxed">
                                  Based on this{" "}
                                  <span className="text-foreground font-medium">
                                    {storageMatch[0]}
                                  </span>{" "}
                                  limit, you can upload and process
                                  approximately{" "}
                                  <span className="text-foreground font-medium">
                                    {plan.name === "Free"
                                      ? "30"
                                      : Math.round(
                                        parseFloat(storageMatch[1]) *
                                        (storageMatch[2].toUpperCase() ===
                                          "TB"
                                          ? 1024
                                          : 1) *
                                        3,
                                      ).toLocaleString()}{" "}
                                    minutes
                                  </span>{" "}
                                  of HD video content.
                                </p>
                                {plan.name !== "Free" && (
                                  <p className="text-muted-foreground text-[10px] leading-relaxed italic border-t border-primary pt-2 mt-2">
                                    This is an estimated capacity based on
                                    adaptive streaming (master file + 360p,
                                    480p, 720p, and 1080p renditions). Actual
                                    capacity may vary depending on your source
                                    bitrate and selected output resolutions.
                                  </p>
                                )}
                                {plan.name === "Free" && (
                                  <p className="text-muted-foreground text-[10px] leading-relaxed italic border-t border-primary pt-2 mt-2">
                                    This is an estimated capacity based on
                                    adaptive streaming (master file + 720p
                                    encoding). Actual capacity may vary
                                    depending on your source bitrate.
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="#get-started"
                className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition-colors ${plan.highlighted
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-primary bg-card text-foreground/75 hover:bg-[var(--popover)]"
                  }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Microcopy */}
        <p className="text-center text-xs text-muted-foreground font-semibold">
          Storage is persistent and does not reset. Playback minutes reset
          monthly with your billing cycle.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
