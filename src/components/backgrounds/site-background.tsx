"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

const LineWaves = dynamic(() => import("@/components/backgrounds/line-waves"), {
  ssr: false,
});

export function SiteBackground() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <LineWaves
        className="h-full w-full"
        lightMode={isLight}
        brightness={isLight ? 0.35 : 0.2}
        color1="#38bdf8"
        color2="#a78bfa"
        color3="#34d399"
        enableMouseInteraction={false}
      />
    </div>
  );
}
