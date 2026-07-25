"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  AlertTriangle,
  Activity,
  Mail,
  Plus,
  X,
  Check,
  Copy,
} from "@/components/common/icons";
import Link from "next/link";
import SecuritySection from "@/components/security";
import DeleteAccountModal from "@/components/modals/delete-account.modal";
import { useUser } from "@clerk/nextjs";
import { useAuth } from '@clerk/nextjs';
import { useQuery, useQueryClient } from "@tanstack/react-query";

const tabs = ["General", "Developer Access", "Security"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [usageThreshold, setUsageThreshold] = useState(80);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastUsed, setLastUsed] = useState<Date | string>("Never used");
  const { user, isLoaded } = useUser();
  const { getToken, isSignedIn } = useAuth()
  const queryClient = useQueryClient();

  const {data: apiKeys, isLoading: isLoadingApiKeys} = useQuery({ 
    queryKey: ["api-keys"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-keys`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch API keys: ${res.status}`);
      }
      const data = await res.json();
      return data;
    },
    enabled: isLoaded && isSignedIn,
  }) 
 

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateSecretKey = async () => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-keys`, {
      method: "POST", 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to generate API key: ${res.status}`);
    }
    const data = await res.json(); 
    setSecretKey(data.key);
    setShowKeyModal(!showKeyModal);
    queryClient.invalidateQueries({
      queryKey: ['api-keys'],
    });
  };

  const handleRegenerateSecretKey = async (keyId: string) => {
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-keys/${keyId}/regenerate`, {
      method: "PUT", 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to regenerate API key: ${res.status}`);
    }
    const data = await res.json(); 
    setSecretKey(data.key);
    setShowKeyModal(!showKeyModal);
    queryClient.invalidateQueries({
      queryKey: ['api-keys'],
    });
  }

  const handleLastUsedKey = async (keyId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api-keys/${keyId}`, {
        method: "GET", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to get last used of API key: ${res.status}`);
      }
      const data = await res.json();   
      setLastUsed(data.last_used_at);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (apiKeys) {
      apiKeys.forEach((key: { id: string; }) => {
        handleLastUsedKey(key.id);
      });
    }
  }, [apiKeys]);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const coolDownOver = apiKeys && apiKeys?.[0]?.createdAt ? 
    (new Date().getTime() - new Date(apiKeys[0]?.createdAt).getTime()) > 5 * 60 * 1000 
    : true;

  if (!isLoaded) {
    return null; 
  }
  console.log(coolDownOver)
  console.log(apiKeys)

  return (
    <div className="text-foreground">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-foreground font-medium">
          Settings
        </span>
      </nav>

      {/* Title */}
      <div className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Manage your account preferences, access control, and security options.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition ${
                activeTab === tab
                  ? "border-b-2 border-[var(--brand-tertiary)] text-[var(--brand-primary-readable)]"
                  : "text-muted-foreground hover:text-[var(--brand-primary-readable)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-md space-y-6">
        {activeTab === "General" && (
          <>
            {/* Plan Usage Alert */}
            <div className="md:w-[60%]">
              <div className="flex items-center justify-between px-3 pb-1">
                <div className="flex items-start gap-3">
                  <Activity size={22} className="text-[var(--brand-primary-readable)] mt-1" />
                  <div>
                    <div className="text-base font-medium">
                      Plan Usage Alert
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Get notified when usage exceeds your set threshold
                      (default: 80%).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleDropdown("usage")}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:bg-muted dark:hover:bg-secondary transition cursor-pointer"
                >
                  {openDropdown === "usage" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>

              {openDropdown === "usage" && (
                <div className="px-5 py-3">
                  <label className="text-sm mb-1 block">
                    Alert Threshold (%):
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={80}
                    value={usageThreshold}
                    onChange={(e) =>
                      setUsageThreshold(parseInt(e.target.value))
                    }
                    className="w-24 px-2 py-1 rounded border border-border bg-card dark:bg-muted text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be between 20% and 80%.
                  </p>
                </div>
              )}
            </div>

            {/* Video Upload Email Alert */}
            <div className="md:w-[60%]">
              <div className="flex items-center justify-between px-3 pb-1">
                <div className="flex items-start gap-3">
                  <Mail size={22} className="text-[var(--brand-primary-readable)] mt-1" />
                  <div>
                    <div className="text-base font-medium">
                      Upload Completion Email
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Email{" "}
                      <span className="font-medium text-[var(--brand-primary-readable)]">
                        {user?.emailAddresses[0]?.emailAddress}
                      </span>{" "}
                      when a video processing is completed.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleDropdown("upload")}
                  className="w-7 h-7 flex items-center justify-center rounded-full border border-border hover:bg-muted dark:hover:bg-secondary transition cursor-pointer"
                >
                  {openDropdown === "upload" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>

              {openDropdown === "upload" && (
                <div className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Email notifications:
                  </span>
                  <button
                    onClick={() => setEmailAlertsEnabled(!emailAlertsEnabled)}
                    className={`w-10 h-5 rounded-full relative transition ${
                      emailAlertsEnabled
                        ? "bg-primary"
                        : "bg-muted dark:bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-card rounded-full top-0.5 transition ${
                        emailAlertsEnabled ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="pt-4 md:w-[60%] border-t border-border">
              <h3 className="text-xl text-destructive font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={22} className="text-destructive" />
                Danger Zone
              </h3>
              <div
                className="flex items-center justify-between p-3"
                onClick={() => setShowDeleteModal(true)}
              >
                <div className="flex items-start gap-3">
                  <Trash2 size={22} className="mt-1" />
                  <div>
                    <div className="text-base font-medium">Delete Account</div>
                    <p className="text-sm text-destructive mt-0.5">
                      Permanently delete your Vidmox account. This action cannot
                      be undone.
                    </p>
                  </div>
                </div>
                <button className="w-7 h-7 flex items-center justify-center rounded-full border border-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition cursor-pointer">
                  <ChevronRight size={16} className="text-destructive" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "Developer Access" && (
          <div className="md:w-[60%] space-y-6">
            {/* Guidelines */}
            <div className="text-base text-muted-foreground leading-relaxed space-y-3">
              <p>
                Developer secret keys are used to programmatically access the
                Vidmox API and embed secured videos. Do{" "}
                <span className="text-foreground font-medium">not share</span> your
                secret key publicly or with third parties.
              </p>
              <p>
                If any suspicious or unauthorized activity is detected using
                your key, we may notify you via email. However, it is solely
                your responsibility to keep your keys secure.
              </p>
              <p>
                If you suspect your key is compromised, you can immediately{" "}
                <span className="text-accent-foreground font-medium">regenerate</span>{" "}
                it below.
              </p>
              <p>
                To further protect your content, you can configure{" "}
                <span className="text-foreground font-medium">
                  whitelisted domains
                </span>{" "}
                that are allowed to access your embedded videos. Requests from
                any other domain will be blocked.
              </p>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-muted-foreground dark:text-foreground">
                Developer Secret Keys
              </h2>
            </div>
            {/* Key List */}

            {
              apiKeys && apiKeys.length >= 1 && !isLoadingApiKeys ? (
              <>
                {/* {apiKeys.map((apikey:any) => ( */}
                  <div className="bg-muted dark:bg-muted border border-border rounded-md px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs dark:text-muted-foreground">
                          Key ID: {apiKeys[0]?.prefix}
                        </p>
                        <p className="mt-1 font-mono dark:text-foreground tracking-wider">
                          {apiKeys[0]?.prefix}
                        </p>
                        <p className="mt-1 text-sm dark:text-muted-foreground">
                          Last used:{" "}
                          {lastUsed ? 
                          new Date(lastUsed).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date(lastUsed).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) 
                          : <span className="dark:text-foreground">Not use yet!</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex gap-2">
                          {coolDownOver ? (
                            <button
                              className="text-xs px-2 py-1 rounded-md border cursor-pointer border-[var(--brand-tertiary)] dark:text-accent-foreground dark:hover:bg-accent/40"
                              onClick={() => handleRegenerateSecretKey(apiKeys[0]?.id)}
                            >
                              Regenerate Key
                            </button>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Please wait 5 minutes before regenerating.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                {/* ))} */}
              </>
              ) :
              (
                <>
                  <button
                    onClick={handleGenerateSecretKey}
                    className="flex items-center cursor-pointer gap-2 mt-3! text-xs px-3 py-2 rounded-md border border-primary bg-primary text-white hover:bg-primary/90 transition-all"
                  >
                    <Plus size={16} />
                    Generate Secret Key
                  </button>
                </>

              )
            }
          </div>
        )}

        {activeTab === "Security" && <SecuritySection />}
      </div>

      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />

      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-card text-card-foreground rounded-md p-6 shadow-xl border border-primary/30">
            {/* Close */}
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>

            {/* Glowing Lock Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 blur-xl opacity-30 bg-primary rounded-full w-14 h-14 z-0" />
                <div className="relative z-10 p-3 bg-primary/10 border border-primary rounded-full text-[var(--brand-primary-readable)]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m0-6h.01M12 9v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center mb-2">
              Your new secret key
            </h2>
            <div className="text-sm text-muted-foreground space-y-3 text-center mb-6">
              <p>
                Use this key to access Vidmox APIs, authenticate your app, and
                embed secured videos across your platform.
              </p>
              <p className="text-accent-foreground font-medium">
                This key is visible only once. Please store it securely — it
                cannot be retrieved again.
              </p>
              <p>
                If it’s ever compromised, you can regenerate it from this
                dashboard. The previous key will be immediately revoked.
              </p>
              <p className="text-xs text-muted-foreground italic">
                For security reasons, a new key can only be generated once every
                5 minutes.
              </p>
            </div>

            {/* Key Box */}
            <div className="relative bg-muted border border-border px-4 py-3 rounded-lg font-mono text-sm mb-6 text-foreground">
              {secretKey.slice(0, 24)}********
              <button
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy to clipboard"}
                className="absolute right-3 top-3 text-xs text-[var(--brand-primary-readable)] hover:text-[var(--brand-primary-readable)] transition"
              >
                {copied ? (
                  <Check size={16} className="text-[var(--brand-primary-readable)] scale-110" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {copied && (
              <p className="text-[var(--brand-primary-readable)] text-center -mt-2! mb-3">
                Copied Successfully!
              </p>
            )}

            {/* Footer CTA */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowKeyModal(false)}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 text-sm rounded-md transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
