"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Constants
const SHADOW_KEYS = [
  "shadow-color",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
] as const;

const DEFAULT_VALUES = {
  "shadow-color": "0, 0%, 30%",
  "shadow-opacity": "0.08",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "1px",
} as const;

const UNITS = {
  "shadow-blur": "px",
  "shadow-spread": "px",
  "shadow-offset-x": "px",
  "shadow-offset-y": "px",
};
const SHADOW_VARIANTS = [
  { name: "2xs", multiplier: 1 },
  { name: "xs", multiplier: 1.2 },
  { name: "sm", multiplier: 1.4 },
  { name: "", multiplier: 1.6 },
  { name: "md", multiplier: 1.8 },
  { name: "lg", multiplier: 2 },
  { name: "xl", multiplier: 2.2 },
  { name: "2xl", multiplier: 2.4 },
];

// Color conversion utilities
const hslToHex = (hsl: string): string => {
  const [h, s, l] = hsl
    .match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/)
    ?.slice(1)
    .map(Number) || [0, 0, 30];
  const s1 = s / 100,
    l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
      ? [x, c, 0]
      : h < 180
      ? [0, c, x]
      : h < 240
      ? [0, x, c]
      : h < 300
      ? [x, 0, c]
      : [c, 0, x];
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToHsl = (hex: string): string => {
  const [r, g, b] =
    hex.length === 4
      ? [hex[1] + hex[1], hex[2] + hex[2], hex[3] + hex[3]].map(
          (x) => parseInt(x, 16) / 255
        )
      : [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
          (x) => parseInt(x, 16) / 255
        );
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const s =
    max === min
      ? 0
      : l > 0.5
      ? (max - min) / (2 - max - min)
      : (max - min) / (max + min);
  const h =
    max === min
      ? 0
      : max === r
      ? ((g - b) / (max - min) + (g < b ? 6 : 0)) * 60
      : max === g
      ? ((b - r) / (max - min) + 2) * 60
      : ((r - g) / (max - min) + 4) * 60;
  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
};

// Shadow update utility
const updateShadows = (values: Record<string, string>) => {
  const {
    "shadow-offset-x": x,
    "shadow-offset-y": y,
    "shadow-blur": blur,
    "shadow-spread": spread,
    "shadow-color": color,
    "shadow-opacity": opacity,
  } = Object.fromEntries(
    Object.entries(DEFAULT_VALUES).map(([k, v]) => [k, values[k] || v])
  );

  const base = `${x} ${y} ${blur} ${spread}`;
  SHADOW_VARIANTS.forEach(({ name, multiplier }) => {
    const varName = `--shadow${name ? "-" + name : ""}`;
    const finalOpacity = Math.max(
      0,
      Math.min(1, parseFloat(opacity) * multiplier)
    );
    document.documentElement.style.setProperty(
      varName,
      `${base} hsla(${color}, ${finalOpacity})`
    );
  });
};

const ShadowSettings: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const initial = Object.fromEntries(
      SHADOW_KEYS.map((key) => {
        let value =
          rootStyles.getPropertyValue(`--${key}`).trim() ||
          DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES];
        if (key in UNITS && value && !isNaN(Number(value))) {
          value = `${value}${UNITS[key as keyof typeof UNITS]}`;
        }
        return [key, value];
      })
    );

    setValues(initial);
    Object.entries(initial).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    document.documentElement.style.setProperty(
      "--shadow-color-hsl",
      initial["shadow-color"]
    );
    updateShadows(initial);
  }, []);

  const handleChange = (key: string, value: string) => {
    if (
      key in UNITS &&
      value &&
      !isNaN(Number(value)) &&
      !value.endsWith(UNITS[key as keyof typeof UNITS])
    ) {
      value = `${value}${UNITS[key as keyof typeof UNITS]}`;
    }
    document.documentElement.style.setProperty(`--${key}`, value);
    setValues((prev) => {
      const updated = { ...prev, [key]: value };
      updateShadows(updated);
      return updated;
    });
    if (key === "shadow-color") {
      document.documentElement.style.setProperty("--shadow-color-hsl", value);
    }
  };

  const renderInput = (key: string) => {
    const label = key.replace("shadow-", "").replace(/-/g, " ");
    const unit = key in UNITS ? UNITS[key as keyof typeof UNITS] : "";
    const value =
      values[key as keyof typeof values] ||
      DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES] ||
      "";
    const numericValue = value.replace(/[^\d.-]/g, "");

    if (key === "shadow-color") {
      return (
        <div key={key} className="flex items-center space-x-2 mb-2">
          <Label htmlFor={key} className="w-48 text-xs capitalize">
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </Label>
          <input
            type="color"
            id={key}
            value={hslToHex(value)}
            onChange={(e) => handleChange(key, hexToHsl(e.target.value))}
            className="h-8 w-8 p-0 border-none rounded"
          />
          <span className="text-xs font-mono w-32">{value}</span>
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
              value={[parseFloat(value) || 0]}
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
          <span className="text-xs font-mono w-20">{value}</span>
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
        {SHADOW_KEYS.map(renderInput)}
        {previewShadows}
      </CardContent>
    </Card>
  );
};

export default ShadowSettings;
