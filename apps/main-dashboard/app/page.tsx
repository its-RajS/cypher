"use client";

import { useMemo } from "react";
import { BookText, GraduationCap } from "@/components/common/icons";
import GeographicalMap from "../components/charts/geoMap";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user, isLoaded } = useUser();
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const topURLs = [
    { pathname: "/portfolio", requests: 21 },
    { pathname: "/projects", requests: 19 },
    { pathname: "/course/javascript", requests: 18 },
    { pathname: "/blog/how-to-host-video", requests: 12 },
    { pathname: "/", requests: 10 },
  ];

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="text-foreground">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          {greeting},{" "}
          {user?.fullName?.split(" ")[0] ||
            user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
            "User"}{" "}
          👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your video infrastructure
          today.
        </p>

        {/* Onboarding Panel - Only shown when stats are zero */}
        {/* <div className="mt-6 rounded-2xl border border-border bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-muted-foreground dark:text-foreground mb-2 flex items-center gap-2">
            🚀 Getting Started
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Complete these steps to get started with Cypher.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary bg-secondary text-[var(--brand-primary-readable)] dark:border-primary/50 dark:bg-secondary/20 dark:text-[var(--brand-primary-readable)] font-semibold text-sm transition-colors group-hover:border-primary group-hover:text-[var(--brand-primary-readable)]">
                1
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground dark:text-foreground group-hover:text-[var(--brand-primary-readable)] dark:group-hover:text-[var(--brand-primary-readable)] transition-colors">
                  Upload your first video
                </span>
                <span className="text-xs text-muted-foreground">
                  Drag and drop a video file to get started
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-muted dark:bg-muted ml-4 hidden md:block" />

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground dark:border-border dark:bg-card dark:text-muted-foreground font-semibold text-sm transition-colors group-hover:border-secondary group-hover:text-[var(--brand-primary-readable)]">
                2
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground dark:text-foreground group-hover:text-[var(--brand-primary-readable)] dark:group-hover:text-[var(--brand-primary-readable)] transition-colors">
                  Copy embed code
                </span>
                <span className="text-xs text-muted-foreground">
                  Paste the snippet into your application
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-muted dark:bg-muted ml-4 hidden md:block" />

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground dark:border-border dark:bg-card dark:text-muted-foreground font-semibold text-sm transition-colors group-hover:border-tertiary group-hover:text-[var(--brand-primary-readable)]">
                3
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground dark:text-foreground group-hover:text-[var(--brand-primary-readable)] dark:group-hover:text-[var(--brand-primary-readable)] transition-colors">
                  Watch analytics update in real-time
                </span>
                <span className="text-xs text-muted-foreground">
                  Monitor views and engagement instantly
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Bandwidth Card */}
        <div className="metric-card-violet rounded-xl bg-card border border-border p-5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Minutes Streamed
              </p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#276a8f] text-white">
                Monthly
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              129{" "}
              <span className="text-lg text-muted-foreground font-normal">/ 1K</span>
            </h2>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Usage</span>
              <span>12.9%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: "12.9%" }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>• 871 mins remaining</span>
            </div>
          </div>
        </div>

        {/* Requests Card */}
        <div className="metric-card-yellow rounded-xl bg-card border border-border p-5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Requests
              </p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#ff7444] text-[#3d170c]">
                Real-time
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              129
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Total times your videos were requested or played across all
              regions.
            </p>
            <div className="border-t border-border pt-2 flex gap-6 text-xs text-muted-foreground">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  96
                </span>
                <span>Avg / Day</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-tertiary">+12%</span>
                <span>Growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="metric-card-silver rounded-xl bg-card border border-border p-5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Storage Used
              </p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#b7bdf7] text-[#252b55]">
                Allocated
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              3.2 <span className="text-lg text-muted-foreground font-normal">GB</span>
            </h2>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>64% Used</span>
              <span>5 GB Total</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-tertiary rounded-full"
                style={{ width: "64%" }}
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>• 2 Videos</span>
              <span>• 1.8 GB Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Geo map */}
      <div className="mt-10 w-full flex items-center justify-between flex-wrap">
        <div className="md:w-[60%]">
          <h2 className="text-lg font-semibold mb-1">Top Visitor Countries</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Based on requests served in the last 28 days.
          </p>
          <div className="w-full max-w-full overflow-hidden p-4">
            <GeographicalMap />
          </div>
        </div>

        {/* Top URLs Table */}
        <div className="md:w-[40%]">
          <h2 className="text-lg font-semibold mb-1">Top Requested URLs</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Pathnames where your videos were most frequently requested in the
            last 28 days.
          </p>
          <div className="rounded! border border-border bg-card shadow-sm">
            <table className="min-w-full min-h-75 divide-y divide-gray-100 dark:divide-gray-800">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    #
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    Pathname
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    Requests
                  </th>
                </tr>
              </thead>
              <tbody>
                {topURLs?.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No requests yet
                    </td>
                  </tr>
                )}

                {topURLs?.map((row, index) => (
                  <tr
                    key={index}
                    className="group hover:bg-primary/10 transition-colors"
                  >
                    {/* Rank */}
                    <td className="px-5 py-3 text-sm font-bold text-muted-foreground">
                      {["🥇", "🥈", "🥉"][index] || `${index + 1}`}
                    </td>

                    {/* Path with icon */}
                    <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-secondary dark:bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {row.pathname.charAt(1).toUpperCase() || "/"}
                      </div>
                      <span className="truncate">{row.pathname}</span>
                    </td>

                    {/* Requests */}
                    <td className="px-5 py-3 text-right font-semibold text-[var(--brand-primary-readable)]">
                      {row.requests.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Learn Cards Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Docs Card */}
        <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-3 text-[var(--brand-primary-readable)]">
            <BookText size={20} />
            <h3 className="text-lg font-semibold text-foreground">
              Documentation
            </h3>
          </div>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>
              <a href="/docs" className="hover:underline">
                Documentation ↗
              </a>
            </li>
            <li>
              <a href="/api" className="hover:underline">
                API Reference ↗
              </a>
            </li>
            <li>
              <a href="/kb" className="hover:underline">
                Knowledge Base ↗
              </a>
            </li>
            <li>
              <a href="/status" className="hover:underline">
                Service Status ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Tutorials Card */}
        <div className="rounded-xl bg-card border border-border p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-3 text-destructive">
            <GraduationCap size={20} />
            <h3 className="text-lg font-semibold text-foreground">
              Tutorials / Guides
            </h3>
          </div>
          <ul className="mt-2 text-sm text-muted-foreground space-y-1">
            <li>
              <a href="/tutorials/first-upload" className="hover:underline">
                How to upload your first video ↗
              </a>
            </li>
            <li>
              <a href="/tutorials/embed" className="hover:underline">
                How to embed videos in your app ↗
              </a>
            </li>
            <li>
              <a href="/tutorials/analytics" className="hover:underline">
                Understanding analytics ↗
              </a>
            </li>
            <li>
              <a
                href="/tutorials/player-customization"
                className="hover:underline"
              >
                Player customization tips ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
