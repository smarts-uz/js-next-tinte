"use client";

import { ShadcnExamples } from "@/components/ShadcnExamples";
import ColorModifier from "@/components/ColorModifier";
import SizeModifier from "@/components/SizeModifier";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="py-8 space-y-4 container mx-auto">
        <ColorModifier />
        <SizeModifier />
        <ShadcnExamples />
      </main>

      <footer className="py-4 px-8 text-center text-sm text-muted-foreground border-t">
        Built with Next.js and Shadcn UI
      </footer>
    </div>
  );
}
