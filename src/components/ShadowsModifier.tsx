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
  "shadow-color": "hsl(0, 0%, 30%)",
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
    };

    // Initial load
    loadShadowValues();
  }, []);

  const handleChange = (key: string, value: string) => {
    // Add units if needed
    if (key in needsUnit && value && !isNaN(Number(value)) && !value.endsWith(needsUnit[key as keyof typeof needsUnit])) {
      value = `${value}${needsUnit[key as keyof typeof needsUnit]}`;
    }
    
    // Store and apply the change
    document.documentElement.style.setProperty(`--${key}`, value);
    setValues((prev) => ({ ...prev, [key]: value }));
    
    // Force browser to recalculate CSS
    document.documentElement.style.setProperty('--shadow-recalc', Date.now().toString());
  };

  const renderInput = (key: string) => {
    const label = key.replace("shadow-", "").replace(/-/g, " ");
    const unit = key in needsUnit ? needsUnit[key as keyof typeof needsUnit] : "";
    
    // Get value or default
    const safeValue = values[key] || defaultValues[key as keyof typeof defaultValues] || "";
    
    // Strip units for number inputs
    const numericValue = safeValue.replace(/[^\d.-]/g, "");
    
    return (
      <div key={key} className="flex items-center space-x-2 mb-2">
        <Label htmlFor={key} className="w-48 text-xs capitalize">
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </Label>
        {key === "shadow-color" ? (
          <input
            type="color"
            id={key}
            value={safeValue}
            onChange={(e) => handleChange(key, e.target.value)}
            className="h-8 w-8 p-0 border-none rounded"
          />
        ) : key === "shadow-opacity" ? (
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
        <CardTitle className="text-base shadow-xl">
          Shadow Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shadowKeys.map(renderInput)}
        {previewShadows}
      </CardContent>
    </Card>
  );
};

export default ShadowSettings;
