import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Logo from "@/assets/svgs/logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/35 bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="lg:col-span-1">
            <Link href="#" className="flex items-center gap-1">
              <Logo className="w-25" />
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              The developer platform for <br /> video production workloads.
            </p>
          </div>

          <div className="flex gap-8 text-xs text-muted-foreground">
            <Link
              href="/docs"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Docs
            </Link>
            <Link
              href=""
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Twitter
            </Link>
            <Link
              href=""
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://status.Cypher.com"
              target="_blank"
              className="hover:text-primary transition-colors"
            >
              Status
            </Link>
          </div>
          <Link
            href={"https://status.Cypher.com"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex h-2 w-2 cursor-pointer">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Live</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-muted-foreground">
              All systems are operational now
            </span>
          </Link>
        </div>

        <div className="mt-8 border-t border-primary pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.7rem] text-muted-foreground/70">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div>© {currentYear} OneMinute Stack Inc.</div>
            <div className="hidden sm:block text-muted-foreground/40">•</div>
            <div className="flex items-center gap-1">
              Built with <span className="text-primary mx-1">❤️</span> for
              developers
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
