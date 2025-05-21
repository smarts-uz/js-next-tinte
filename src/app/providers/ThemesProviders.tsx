"use client";

import { ThemeProvider } from "next-themes";

export default function ThemesProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme-preference"
    >
      {children}
    </ThemeProvider>
  );
}
