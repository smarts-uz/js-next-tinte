"use client";

import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function Navigation() {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/", label: "About" },
    { href: "/", label: "Projects" },
    { href: "/", label: "Contact" },
  ];

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Acme Navigation</SheetTitle>
            <SheetDescription>Explore Acme's website</SheetDescription>
          </SheetHeader>
          <nav className="mt-6 space-y-4">
            {navItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-lg hover:bg-accent hover:text-accent-foreground"
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto absolute bottom-6 left-6 right-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleThemeToggle}
            >
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              ) : (
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 bg-background">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-8">
            Acme
          </Link>
          <div className="flex space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-9 px-0"
          onClick={handleThemeToggle}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </>
  );
}
