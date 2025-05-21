"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const colorKeys = {
  base: ["background", "foreground"],
  brand: [
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "destructive",
    "destructive-foreground",
    "accent",
    "accent-foreground",
  ],
  other: [
    "border",
    "input",
    "ring",
    "muted",
    "muted-foreground",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
  ],
} as const;

const toVarName = (key: string) => `--${key}`;

const ColorSettings: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const initial: Record<string, string> = {};
    Object.values(colorKeys)
      .flat()
      .forEach((key) => {
        initial[key] =
          rootStyles.getPropertyValue(toVarName(key)).trim() || "#000000";
      });
    setValues(initial);
  }, []);

  const handleChange = (key: string, color: string) => {
    document.documentElement.style.setProperty(toVarName(key), color);
    setValues((prev) => ({ ...prev, [key]: color }));
  };

  const renderColorPicker = (key: string) => (
    <div key={key} className="flex items-center space-x-2 mb-2">
      <label htmlFor={key} className="w-32 text-xs capitalize">
        {key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </label>
      <input
        type="color"
        id={key}
        value={values[key] || "#000000"}
        onChange={(e) => handleChange(key, e.target.value)}
        className="h-6 w-6 p-0 border-none"
      />
      <span className="text-xs font-mono">{values[key]}</span>
    </div>
  );

  return (
    <div className="space-y-4 flex w-full  gap-4">
      {Object.entries(colorKeys).map(([category, keys]) => (
        <Card key={category} className="w-full h-96">
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
