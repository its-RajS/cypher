"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/svgs/logo";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { DASHBOARD_URL } from "@/lib/routes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-primary/25 bg-card/92 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#story" className="text-foreground hover:text-primary transition-colors">
            Why us?
          </Link>
          <Link href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-foreground hover:text-primary transition-colors"
          >
            How it works
          </Link>
          <Link href="#pricing" className="text-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-foreground hover:text-primary transition-colors">
            Docs
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon icon={isDark ? Sun02Icon : Moon02Icon} size={16} />
          </button>
          {!isLoaded ? (
            <Button
              size="sm"
              className="rounded-full cursor-pointer bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              ...
            </Button>
          ) : isSignedIn ? (
            <Link href={DASHBOARD_URL}>
              <Button
                size="sm"
                className="rounded-full cursor-pointer bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-full cursor-pointer bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
