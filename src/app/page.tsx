"use client";

import { ShadcnExamples } from "@/components/ShadcnExamples";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="py-8">
        <ShadcnExamples />
      </main>

      <footer className="py-4 px-8 text-center text-sm text-muted-foreground border-t">
        Built with Next.js and Shadcn UI
      </footer>
    </div>
  );
}
