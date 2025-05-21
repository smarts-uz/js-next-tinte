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

const ShadowSettings: React.FC = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadShadowValues = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const initial: Record<string, string> = {};
      shadowKeys.forEach((key) => {
        initial[key] =
          rootStyles.getPropertyValue(`--${key}`).trim() ||
          (key === "shadow-color"
            ? "oklch(1 0 0)"
            : key === "shadow-opacity"
            ? "0.08"
            : key === "shadow-blur"
            ? "3px"
            : key === "shadow-spread"
            ? "0px"
            : key === "shadow-offset-x"
            ? "0"
            : key === "shadow-offset-y"
            ? "1px"
            : "");
      });
      setValues(initial);
    };

    // Initial load
    loadShadowValues();
  }, []);

  const handleChange = (key: string, value: string) => {
    document.documentElement.style.setProperty(`--${key}`, value);
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderInput = (key: string) => {
    const label = key.replace("shadow-", "").replace(/-/g, " ");
    const unit =
      key === "shadow-color"
        ? ""
        : key === "shadow-opacity"
        ? ""
        : key.includes("offset") || key === "shadow-spread"
        ? "px"
        : key === "shadow-blur"
        ? "px"
        : "";

    return (
      <div key={key} className="flex items-center space-x-2 mb-2">
        <Label htmlFor={key} className="w-48 text-xs capitalize">
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Label>
        {key === "shadow-color" ? (
          <input
            type="color"
            id={key}
            value={values[key] || "oklch(0.3 0.0891 19.6)"}
            onChange={(e) => handleChange(key, e.target.value)}
            className="h-8 w-8 p-0 border-none rounded"
          />
        ) : key === "shadow-opacity" ? (
          <div className="flex items-center space-x-2 w-full">
            <Slider
              value={[parseFloat(values[key] || "0.08")]}
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
              value={values[key]}
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
              value={values[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-24 h-8 text-xs"
            />
            {unit && <span className="text-xs">{unit}</span>}
          </div>
        )}
        {key !== "shadow-color" && key !== "shadow-opacity" && (
          <span className="text-xs font-mono w-20">{values[key]}</span>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Shadow Properties</CardTitle>
      </CardHeader>
      <CardContent>{shadowKeys.map(renderInput)}</CardContent>
    </Card>
  );
};

export default ShadowSettings;
