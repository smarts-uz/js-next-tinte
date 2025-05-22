import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemesProviders from "./providers/ThemesProviders";
import Navigation from "@/components/Navigation";
import { fontVariables } from "./fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shadcn Modifier",
  description: "A tool to modify Shadcn UI components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.className} ${fontVariables}`}
    >
      <body>
        <ThemesProviders>
          <Navigation />
          {children}
        </ThemesProviders>
      </body>
    </html>
  );
}
