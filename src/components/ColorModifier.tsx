"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const colorKeys = {
  base: [
    "background",
    "foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
  ],
  primary: [
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
  ],
  states: [
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "border",
    "input",
    "ring",
  ],
  charts: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  sidebar: [
    "sidebar",
    "sidebar-foreground",
    "sidebar-primary",
    "sidebar-primary-foreground",
    "sidebar-accent",
    "sidebar-accent-foreground",
    "sidebar-border",
    "sidebar-ring",
  ],
} as const;

const toVarName = (key: string) => `--${key}`;

const ColorSettings: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const { theme } = useTheme();

  useEffect(() => {
    // Wait for the DOM to be fully rendered to get computed styles
    const loadColorValues = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const initial: Record<string, string> = {};
      Object.values(colorKeys)
        .flat()
        .forEach((key) => {
          initial[key] =
            rootStyles.getPropertyValue(toVarName(key)).trim() || "#000000";
        });
      setValues(initial);
    };

    // Initial load
    loadColorValues();

    // Re-load when theme changes
    const observer = new MutationObserver(loadColorValues);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [theme]);

  const handleChange = (key: string, color: string) => {
    document.documentElement.style.setProperty(toVarName(key), color);
    setValues((prev) => ({ ...prev, [key]: color }));
  };

  const formatColor = (color: string) => {
    // If color is in shorthand format (e.g., #fd0), expand to full format
    if (/^#([0-9a-f]{3})$/i.test(color)) {
      return color
        .split("")
        .map((char) => char + char)
        .join("")
        .replace("##", "#");
    }
    return color;
  };

  const renderColorPicker = (key: string) => (
    <div key={key} className="flex items-center space-x-2 mb-2">
      <Label htmlFor={key} className="w-48 text-xs capitalize">
        {key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Label>
      <input
        type="color"
        id={key}
        value={formatColor(values[key] || "#000000")}
        onChange={(e) => handleChange(key, e.target.value)}
        className="h-8 w-8 p-0 border-none rounded"
      />
      <span className="text-xs font-mono w-20">{formatColor(values[key])}</span>
    </div>
  );

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      {Object.entries(colorKeys).map(([category, keys]) => (
        <Card key={category} className="w-full">
          <CardHeader>
            <CardTitle className="text-base">
              {category.charAt(0).toUpperCase() + category.slice(1)} Colors
            </CardTitle>
          </CardHeader>
          <CardContent>{keys.map(renderColorPicker)}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ColorSettings;
