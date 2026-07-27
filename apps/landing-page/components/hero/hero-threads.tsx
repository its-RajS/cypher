"use client";

import { useTheme } from "next-themes";
import Threads from "@/components/Threads";

export default function HeroThreads() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Threads
      key={isLight ? "light" : "dark"}
      color={isLight ? [0.15, 0.42, 0.56] : [0.44, 0.73, 0.86]}
      amplitude={0.9}
      distance={0.3}
      enableMouseInteraction={false}
    />
  );
}
