"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
} from "@/components/common/icons";
import Link from "next/link";
import PaymentCard from "../../components/cards/payment.card";
import AddOnCard from "../../components/cards/addon.card";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { isLoaded } = useUser();

  const transactions = [
    {
      date: "Apr 14, 2025",
      amount: "$12.00",
      status: "Paid",
      plan: "Pro Plan",
    },
    {
      date: "Mar 14, 2025",
      amount: "$12.00",
      status: "Paid",
      plan: "Pro Plan",
    },
  ];

  const nextBillingDate = "May 15, 2025";

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="text-foreground dark:dark:text-foreground">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-foreground font-medium">Billing</span>
      </nav>

      {/* Title */}
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold">Billing Settings</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Track your current plan and manage subscription settings.
        </p>
      </div>

      {/* Manage Billing Card */}
      <div className="flex items-center justify-between rounded-md p-5 mb-6 border border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="palette-info flex items-center justify-center w-10 h-10 rounded-full">
            <CreditCard
              size={20}
              className="text-[var(--brand-primary-readable)]"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Manage Billing</h3>
            <p className="text-xs text-muted-foreground">
              Manage your payment methods and billing details through Stripe.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            // TODO: redirect to Stripe customer portal
          }}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-muted dark:hover:bg-secondary/50 transition-colors"
        >
          <ExternalLink size={14} />
          Open Stripe Portal
        </button>
      </div>

      {/* Current Plan */}
      <div className="bg-card rounded-md p-5 mb-6 border border-border">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Choose the Plan That Fits Your Needs
          </h2>
          <p className="text-sm text-muted-foreground">
            Upgrade to unlock more bandwidth, storage, and premium features like{" "}
            <br />
            custom watermark, ad-free player, and real-time support.
          </p>
        </div>

        <div className="flex items-center gap-6 mb-8 border-b border-border">
          {["monthly", "yearly"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle as "monthly" | "yearly")}
              className={`relative pb-2 text-sm font-medium transition-all ${
                billingCycle === cycle
                  ? "text-[var(--brand-primary-readable)] after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-[var(--brand-tertiary)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cycle === "monthly" ? "Monthly" : "Yearly"}
              {cycle === "yearly" && (
                <span className="palette-live ml-2 rounded-full px-2 py-0.5 text-xs">
                  Save 10%
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="w-full grid md:grid-cols-4 gap-5 mb-1">
          <PaymentCard
            name="Free Plan"
            price="$0"
            isCurrent
            isFree
            features={[
              "5GB storage",
              "Streaming up to 720p",
              "1,000 playback minutes / month",
              "1 API key",
              "Core dashboard analytics",
              { label: "Custom watermark", available: false },
              {
                label: "Caption credits available as an add-on",
                available: false,
              },
              {
                label: "Multi-bitrate adaptive streaming (360p–1080p)",
                available: false,
              },
              { label: "Full branding", available: false },
            ]}
          />
          <PaymentCard
            name="Starter Plan"
            price={billingCycle === "monthly" ? "$15" : "$13.50"}
            features={[
              "250GB storage",
              "10,000 playback minutes / month",
              "Core dashboard analytics",
              "3 API keys and 10 playlists",
              "Multi-bitrate adaptive streaming (360p–1080p)",
              "Private embeds and domain controls",
              "Caption credits available as an add-on",
              "Email support",
            ]}
          />
          <PaymentCard
            name="Pro Plan"
            price={billingCycle === "monthly" ? "$39" : "$35.10"}
            features={[
              "600GB storage",
              "30,000 playback minutes / month",
              "Per-video analytics",
              "10 API keys and 50 playlists",
              "Multi-bitrate adaptive streaming (360p–1080p)",
              "Custom watermark and player branding",
              "Caption credits available as an add-on",
              "Priority email support",
            ]}
          />
          <PaymentCard
            name="Business Plan"
            price={billingCycle === "monthly" ? "$99" : "$89.10"}
            features={[
              "1TB storage",
              "75,000 playback minutes / month",
              "Analytics exports",
              "20 API keys and 100 playlists",
              "Multi-bitrate adaptive streaming (360p–1080p)",
              "Custom branding and private playback",
              "Caption credits available as an add-on",
              "Priority support",
            ]}
          />
        </div>
      </div>

      <div className="bg-card rounded-md mb-6 p-5 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-1">Add-ons</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Extend your bandwidth and storage as your needs grow. Add flexibility
          with custom top-ups.
        </p>

        <div className="grid md:grid-cols-4 gap-5">
          <AddOnCard
            title="100GB Bandwidth"
            price="$5"
            description="Extend your bandwidth limit"
          />
          <AddOnCard
            title="200GB Bandwidth"
            price="$10"
            description="Extend your bandwidth limit"
          />
          <AddOnCard
            title="300GB Bandwidth"
            price="$15"
            description="Extend your bandwidth limit"
          />

          {/* Custom Add-on Card */}
          <div className="rounded-md border border-border p-4 bg-card dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Extra Playback Minutes
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              $5 = 10,000 Minutes Playback Add as many Playback Minutes as you
              want.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                min={5}
                step={5}
                placeholder="Enter $ amount"
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-card dark:bg-muted text-foreground"
              />
              <button className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-md transition">
                Add Playback Minutes
              </button>
            </div>
          </div>
        </div>
        <br />
        <div className="grid md:grid-cols-4 gap-5">
          <AddOnCard
            title="100GB Storage"
            price="$5"
            description="Extend your storage limit"
          />
          <AddOnCard
            title="200GB Storage"
            price="$10"
            description="Extend your storage limit"
          />
          <AddOnCard
            title="300GB Storage"
            price="$15"
            description="Extend your storage limit"
          />

          {/* Custom Add-on Card */}
          <div className="rounded-md border border-border p-4 bg-card dark:bg-card">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Custom Storage
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              $5 = 100GB. Add as much storage as you want.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                min={5}
                step={5}
                placeholder="Enter $ amount"
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-card dark:bg-muted text-foreground"
              />
              <button className="cursor-pointer bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-md transition">
                Add Storage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card rounded-md p-5 border border-border">
        <h3 className="text-sm font-medium dark:text-foreground mb-4">
          Transaction History
        </h3>
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-muted-foreground border-b border-border">
            <tr>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Plan</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr
                key={idx}
                className="border-b border-border hover:bg-muted dark:hover:bg-primary/10 text-foreground"
              >
                <td className="py-3">{txn.date}</td>
                <td className="py-3">{txn.plan}</td>
                <td className="py-3">{txn.amount}</td>
                <td
                  className={`py-3 font-medium ${
                    txn.status.toLowerCase() === "paid"
                      ? "palette-live px-2 py-1"
                      : "text-destructive"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="py-3">
                  <button
                    onClick={() => alert("TODO: Download invoice")}
                    className="inline-flex cursor-pointer items-center gap-1 text-[var(--brand-primary-readable)] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
