import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { DASHBOARD_URL } from "@/lib/routes";

export default function Page() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-0 left-0 right-0 h-125 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-100">
        <SignIn
          signUpUrl="/signup"
          forceRedirectUrl={DASHBOARD_URL}
          fallbackRedirectUrl={DASHBOARD_URL}
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "var(--primary)",
              colorBackground: "var(--card)",
              colorText: "var(--foreground)",
              colorTextSecondary: "var(--muted-foreground)",
              colorInputBackground: "var(--muted)",
              colorInputText: "var(--foreground)",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-card/90 backdrop-blur-xl border border-primary shadow-2xl p-8 rounded-xl",
              headerTitle: "text-xl font-bold tracking-tight text-foreground",
              headerSubtitle: "text-sm text-muted-foreground",
              formFieldLabel:
                "text-xs font-medium text-muted-foreground uppercase tracking-wide",
              formFieldInput:
                "bg-[var(--foreground)]/5 border-primary text-foreground focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 h-10",
              socialButtonsBlockButton:
                "bg-[var(--foreground)]/5 border-primary text-foreground/80 hover:bg-primary/90/10 hover:text-foreground transition-all duration-200 h-10",
              socialButtonsBlockButtonText: "font-medium text-sm",
              dividerLine: "bg-border",
              dividerText:
                "text-muted-foreground text-xs font-medium uppercase tracking-wider bg-card",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm transition-all duration-200 h-10",
              footerActionLink:
                "text-primary hover:text-primary/80 font-medium",
              formFieldAction:
                "text-primary hover:text-primary/80 font-medium text-xs",
            },
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
          }}
        />
      </div>
    </div>
  );
}
