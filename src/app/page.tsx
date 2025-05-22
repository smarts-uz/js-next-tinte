"use client";

import { ShadcnExamples } from "@/components/ShadcnExamples";
import ColorModifier from "@/components/ColorModifier";
import GlobalModifier from "@/components/GlobalModifier";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ShadowModifier from "@/components/ShadowsModifier";
import FontModifier from "@/components/FontsModifier";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="py-8 space-y-4 container mx-auto">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="sizes">Global</TabsTrigger>
            <TabsTrigger value="shadows">Shadows</TabsTrigger>
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
          </TabsList>
          <TabsContent value="colors">
            <ColorModifier />
          </TabsContent>
          <TabsContent value="sizes">
            <GlobalModifier />
          </TabsContent>
          <TabsContent value="shadows">
            <ShadowModifier />
          </TabsContent>
          <TabsContent value="fonts">
            <FontModifier />
          </TabsContent>
        </Tabs>
        <ShadcnExamples />
      </main>

      <footer className="py-4 px-8 text-center text-sm text-muted-foreground border-t">
        Built with Next.js and Shadcn UI
      </footer>
    </div>
  );
}
