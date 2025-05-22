"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const shadowKeys = [
  "shadow-color",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
] as const;

const defaultValues = {
  "shadow-color": "0, 0%, 30%",
  "shadow-opacity": "0.08",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "1px",
};

const needsUnit = {
  "shadow-blur": "px",
  "shadow-spread": "px",
  "shadow-offset-x": "px",
  "shadow-offset-y": "px",
};

// Utility functions for HSL <-> HEX conversion (h, s%, l% format)
const hslStringToHex = (hsl: string): string => {
  // hsl: '0, 0%, 30%'
  const match = hsl.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
  if (!match) return "#cccccc";
  const [h, sInit, lInit] = match.slice(1).map(Number);
  let s = sInit;
  let l = lInit;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToHslString = (hex: string): string => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  h = Math.round(h);
  return `${h}, ${s}%, ${l}%`;
};

// Shadow variant multipliers as in globals.css
const shadowVariants = [
  { name: "2xs", multiplier: 1 },
  { name: "xs", multiplier: 1.2 },
  { name: "sm", multiplier: 1.4 },
  { name: "", multiplier: 1.6 }, // default shadow
  { name: "md", multiplier: 1.8 },
  { name: "lg", multiplier: 2 },
  { name: "xl", multiplier: 2.2 },
  { name: "2xl", multiplier: 2.4 },
];

// Helper to update all shadow variant variables
const updateShadowVariants = (shadowValues: Record<string, string>) => {
  // Get base values
  const offsetX =
    shadowValues["shadow-offset-x"] || defaultValues["shadow-offset-x"];
  const offsetY =
    shadowValues["shadow-offset-y"] || defaultValues["shadow-offset-y"];
  const blur = shadowValues["shadow-blur"] || defaultValues["shadow-blur"];
  const spread =
    shadowValues["shadow-spread"] || defaultValues["shadow-spread"];
  const color = shadowValues["shadow-color"] || defaultValues["shadow-color"];
  const opacity = parseFloat(
    shadowValues["shadow-opacity"] || defaultValues["shadow-opacity"]
  );

  const base = `${offsetX} ${offsetY} ${blur} ${spread}`;

  shadowVariants.forEach(({ name, multiplier }) => {
    const varName = `--shadow${name ? "-" + name : ""}`;
    // Clamp opacity to [0, 1]
    const finalOpacity = Math.max(0, Math.min(1, opacity * multiplier));
    const value = `${base} hsla(${color}, ${finalOpacity})`;
    document.documentElement.style.setProperty(varName, value);
  });
};

const ShadowSettings: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadShadowValues = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const initial: Record<string, string> = {};

      shadowKeys.forEach((key) => {
        let value = rootStyles.getPropertyValue(`--${key}`).trim();

        // Use default value if empty
        if (!value) {
          value = defaultValues[key as keyof typeof defaultValues] || "";
        }

        // Make sure numeric values have proper units
        if (key in needsUnit && value && !isNaN(Number(value))) {
          value = `${value}${needsUnit[key as keyof typeof needsUnit]}`;
        }

        initial[key] = value;
      });

      setValues(initial);

      // Apply initial values to make sure everything is consistent
      Object.entries(initial).forEach(([key, value]) => {
        if (value) {
          document.documentElement.style.setProperty(`--${key}`, value);
        }
      });
      // Also set --shadow-color-hsl for the shadow system
      document.documentElement.style.setProperty(
        "--shadow-color-hsl",
        initial["shadow-color"]
      );
      // Also update all shadow variant variables on mount
      updateShadowVariants(initial);
    };

    // Initial load
    loadShadowValues();
  }, []);

  const handleChange = (key: string, value: string) => {
    // Add units if needed
    if (
      key in needsUnit &&
      value &&
      !isNaN(Number(value)) &&
      !value.endsWith(needsUnit[key as keyof typeof needsUnit])
    ) {
      value = `${value}${needsUnit[key as keyof typeof needsUnit]}`;
    }

    // Store and apply the change
    document.documentElement.style.setProperty(`--${key}`, value);
    setValues((prev) => {
      const updated = { ...prev, [key]: value };
      // Also update all shadow variant variables
      updateShadowVariants(updated);
      return updated;
    });

    // If shadow-color, also update --shadow-color-hsl
    if (key === "shadow-color") {
      document.documentElement.style.setProperty("--shadow-color-hsl", value);
    }

  };

  const renderInput = (key: string) => {
    const label = key.replace("shadow-", "").replace(/-/g, " ");
    const unit =
      key in needsUnit ? needsUnit[key as keyof typeof needsUnit] : "";

    // Get value or default
    const safeValue =
      values[key] || defaultValues[key as keyof typeof defaultValues] || "";

    // Strip units for number inputs
    const numericValue = safeValue.replace(/[^\d.-]/g, "");

    if (key === "shadow-color") {
      // Convert 'h, s%, l%' to HEX for color input
      const hexValue = hslStringToHex(safeValue);
      return (
        <div key={key} className="flex items-center space-x-2 mb-2">
          <Label htmlFor={key} className="w-48 text-xs capitalize">
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </Label>
          <input
            type="color"
            id={key}
            value={hexValue}
            onChange={(e) => {
              const hsl = hexToHslString(e.target.value);
              handleChange(key, hsl);
            }}
            className="h-8 w-8 p-0 border-none rounded"
          />
          <span className="text-xs font-mono w-32">{safeValue}</span>
        </div>
      );
    }
    return (
      <div key={key} className="flex items-center space-x-2 mb-2">
        <Label htmlFor={key} className="w-48 text-xs capitalize">
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Label>
        {key === "shadow-opacity" ? (
          <div className="flex items-center space-x-2 w-full">
            <Slider
              value={[parseFloat(safeValue) || 0]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(values) =>
                handleChange(key, values[0].toString())
              }
              className="w-full"
            />
            <Input
              type="number"
              value={numericValue}
              onChange={(e) => handleChange(key, e.target.value)}
              min={0}
              max={1}
              step={0.01}
              className="w-20 h-8 text-xs"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              id={key}
              value={numericValue}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-24 h-8 text-xs"
            />
            {unit && <span className="text-xs">{unit}</span>}
          </div>
        )}
        {key !== "shadow-color" && key !== "shadow-opacity" && (
          <span className="text-xs font-mono w-20">{safeValue}</span>
        )}
      </div>
    );
  };

  // Shadow preview elements
  const previewShadows = (
    <div className="grid grid-cols-4 gap-4 mt-6">
      <div className="shadow-xs bg-card p-3 rounded text-xs">shadow-xs</div>
      <div className="shadow-sm bg-card p-3 rounded text-xs">shadow-sm</div>
      <div className="shadow bg-card p-3 rounded text-xs">shadow</div>
      <div className="shadow-md bg-card p-3 rounded text-xs">shadow-md</div>
      <div className="shadow-lg bg-card p-3 rounded text-xs">shadow-lg</div>
      <div className="shadow-xl bg-card p-3 rounded text-xs">shadow-xl</div>
      <div className="shadow-2xl bg-card p-3 rounded text-xs">shadow-2xl</div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base shadow-xl">Shadow Properties</CardTitle>
      </CardHeader>
      <CardContent>
        {shadowKeys.map(renderInput)}
        {previewShadows}
      </CardContent>
    </Card>
  );
};

export default ShadowSettings;
