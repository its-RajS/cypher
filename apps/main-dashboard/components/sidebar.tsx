"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../components/common/logo";
import LogoLight from "../components/common/logolight";
import {
  HelpCircle,
  FolderKanban,
  AreaChart,
  CreditCard,
  Settings,
  PieChart,
  Sun,
  Menu,
  X,
  Video,
  PlaySquare,
  Sliders,
  Image as ImageIcon,
  FileText,
  LogOut,
  LifeBuoy,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
} from "@/components/common/icons";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Image from "next/image";

/* Portal-based tooltip — escapes sidebar overflow-hidden */
function SidebarTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.top + rect.height / 2, left: rect.right + 8 });
    }
    setVisible(true);
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className="fixed px-2.5 py-1.5 rounded-md bg-card text-foreground text-xs font-medium whitespace-nowrap z-50 shadow-md pointer-events-none"
            style={{
              top: pos.top,
              left: pos.left,
              transform: "translateY(-50%)",
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </div>
  );
}

const navSections = [
  {
    title: "General",
    links: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Analytics", href: "/analytics", icon: AreaChart },
    ],
  },
  {
    title: "Video Management",
    links: [
      { title: "Upload Video", href: "/uploads", icon: FolderKanban },
      { title: "My Videos", href: "/my-videos", icon: Video },
      { title: "Playlists", href: "/playlists", icon: PlaySquare },
    ],
  },
  {
    title: "Customization",
    links: [
      { title: "Player Settings", href: "/player", icon: Sliders },
      { title: "Watermark & Branding", href: "/branding", icon: ImageIcon },
    ],
  },
  {
    title: "Support",
    links: [
      { title: "Docs", href: "/docs", icon: FileText },
      { title: "Support Center", href: "/support", icon: LifeBuoy },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "Billing", href: "/billing", icon: CreditCard },
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Log Out", href: "/logout", icon: LogOut },
    ],
  },
];

const Sidebar = () => {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  // resolvedTheme is undefined during SSR — default to "dark" to match defaultTheme
  const isDark = resolvedTheme ? resolvedTheme === "dark" : true;
  const toggleTheme = (): void => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut();
  };

  const iconClasses =
    "text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors";

  if (!isLoaded) return null;

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md bg-background border border-border text-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:sticky top-0 left-0 z-40
          h-screen shrink-0
          ${collapsed ? "w-15" : "w-64"}
          flex flex-col
          overflow-hidden
          bg-sidebar
          border-r border-border
          text-foreground
          transition-[width] duration-200 ease-in-out
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 pt-4 pb-2`}
        >
          {!collapsed && (
            <Link href="/" className="w-28 -mt-2 shrink-0">
              <div className="hidden dark:block">
                <Logo />
              </div>
              <div className="block dark:hidden">
                <LogoLight />
              </div>
            </Link>
          )}

          <div
            className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-2.5"}`}
          >
            {!collapsed && (
              <>
                <HelpCircle size={16} className={iconClasses} />
                <button onClick={() => toggleTheme()}>
                  {!isDark ? (
                    <Moon size={16} className={iconClasses} />
                  ) : (
                    <Sun size={16} className={iconClasses} />
                  )}
                </button>
              </>
            )}

            {/* Collapse toggle — desktop only */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
          </div>
        </div>

        {/* User info */}
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-4 px-4 mt-2">
            <Image
              src={user?.imageUrl || "https://i.pravatar.cc/300"}
              alt="avatar"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border border-border shrink-0"
            />
            <div className="text-[13px] leading-4 min-w-0">
              <p className="font-semibold flex items-center gap-1">
                <span className="truncate max-w-24">
                  {user?.fullName?.split(" ")[0] ||
                    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
                    "User"}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full font-semibold shrink-0">
                  Free
                </span>
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center my-3">
            <Image
              src={user?.imageUrl || "https://i.pravatar.cc/300"}
              width={32}
              height={32}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-border"
            />
          </div>
        )}

        {/* Usage card */}
        {!collapsed && (
          <div className="mx-3 mb-4 px-3 py-3 rounded-xl bg-muted border border-border shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <PieChart size={13} /> Usage
              </span>
              <span className="text-[11px] font-semibold text-foreground">
                5%
              </span>
            </div>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[var(--brand-primary)] to-[var(--brand-primary)]"
                style={{ width: "5%" }}
              />
            </div>
            <Link
              href={"/billing"}
              className="mt-1 cursor-pointer w-full text-[11px] font-medium text-[var(--brand-primary-readable)] hover:underline"
            >
              Manage Plan & Usage
            </Link>
          </div>
        )}

        {/* Navigation — scrollable */}
        <nav className="flex flex-col gap-4 px-2 flex-1 pb-4 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground px-3 mb-1">
                  {section.title}
                </p>
              )}
              {collapsed && (
                <div className="border-t border-border my-1 mx-1" />
              )}
              <div className="flex flex-col gap-0.5">
                {section.links.map(({ title, href, icon: Icon }) => {
                  const link = (
                    <Link
                      key={href}
                      href={href === "/logout" ? "#" : href}
                      onClick={(e) => {
                        if (href === "/logout") {
                          e.preventDefault();
                          handleLogout();
                        }
                        setMobileOpen(false);
                      }}
                      className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} text-[14px] font-medium ${collapsed ? "px-2 py-2.5 mx-auto" : "px-4 py-2"} rounded-md transition-colors ${
                        path === href
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span className="truncate">{title}</span>}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <SidebarTooltip key={href} label={title}>
                        {link}
                      </SidebarTooltip>
                    );
                  }

                  return link;
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions — collapsed mode */}
        {collapsed && (
          <div className="flex flex-col items-center gap-2 pb-4 pt-2 border-t border-border mt-auto mx-2">
            <SidebarTooltip label={isDark ? "Light mode" : "Dark mode"}>
              <button onClick={() => toggleTheme()} className={iconClasses}>
                {!isDark ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </SidebarTooltip>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
