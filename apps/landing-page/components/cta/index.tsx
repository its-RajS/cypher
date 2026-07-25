import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function CTASection() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden bg-[var(--brand-highlight)] text-[#332c0f] border-y border-[var(--brand-tertiary)]">
            {/* Subtle radial glow */}
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[var(--brand-secondary)] opacity-65 pointer-events-none" />
            <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[var(--brand-tertiary)] opacity-65 pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-[#332c0f] sm:text-5xl mb-6">
                    Ready to streamline your video workflow?
                </h2>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-[#5d5120] mb-10">
                    Join thousands of developers building the next generation of video
                    applications with Vidmox. Start for free, upgrade as you grow.
                </p>

                <div className="flex items-center justify-center gap-x-6">
                    <Link
                        href="/signup"
                        className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-[var(--brand-primary)]/25 hover:bg-primary/90 hover:shadow-[var(--brand-primary)]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)] transition-all hover:scale-105"
                    >
                        Get started for free
                    </Link>
                    <Link
                        href="#pricing"
                        className="group text-sm font-semibold leading-6 text-[#332c0f] hover:text-[#276a8f] flex items-center gap-2 transition-colors"
                    >
                        View pricing{" "}<HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section >
    );
}
