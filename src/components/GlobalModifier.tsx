"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type SpacingSettingsProps = {
  initialSpacing?: number;
  initialLetterSpacing?: number;
  initialBorderRadius?: number;
  initialBlur?: number;
  initialBackdropBlur?: number;
  onSpacingChange?: (spacing: number) => void;
  onLetterSpacingChange?: (letterSpacing: number) => void;
  onBorderRadiusChange?: (borderRadius: number) => void;
  onBlurChange?: (blur: number) => void;
  onBackdropBlurChange?: (backdropBlur: number) => void;
};

const GlobalModifier: React.FC<SpacingSettingsProps> = ({
  initialSpacing = 0.25,
  initialLetterSpacing = 0.0625,
  initialBorderRadius = 0.25,
  onSpacingChange,
  onLetterSpacingChange,
  onBorderRadiusChange,
}) => {
  const [spacing, setSpacing] = useState(initialSpacing);
  const [letterSpacing, setLetterSpacing] = useState(initialLetterSpacing);
  const [borderRadius, setBorderRadius] = useState(initialBorderRadius);

  useEffect(() => {
    // Get initial values from root styles on component mount
    const rootStyles = getComputedStyle(document.documentElement);
    const initialSpacingValue = parseFloat(
      rootStyles.getPropertyValue("--spacing").trim()
    );
    const initialLetterSpacingValue = parseFloat(
      rootStyles.getPropertyValue("--letter-spacing").trim()
    );
    const initialBorderRadiusValue = parseFloat(
      rootStyles.getPropertyValue("--radius").trim()
    );
    setSpacing(initialSpacingValue);
    setLetterSpacing(initialLetterSpacingValue);
    setBorderRadius(initialBorderRadiusValue);
  }, []);

  const handleSpacingChange = (value: number) => {
    setSpacing(value);
    document.documentElement.style.setProperty("--spacing", `${value}rem`);
    onSpacingChange?.(value);
  };

  const handleLetterSpacingChange = (value: number) => {
    setLetterSpacing(value);
    document.documentElement.style.setProperty(
      "--letter-spacing",
      `${value}em`
    );
    onLetterSpacingChange?.(value);
  };

  const handleBorderRadiusChange = (value: number) => {
    setBorderRadius(value);
    document.documentElement.style.setProperty("--radius", `${value}rem`);
    onBorderRadiusChange?.(value);
  };

  return (
    <div className="space-y-4 flex w-full gap-4">
      <Card className="w-full">
        <CardHeader className="py-2">
          <CardTitle className="text-base">Global Style Modifiers</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <Label
                htmlFor="global-spacing-slider"
                className="text-lg text-foreground dark:text-white font-medium"
              >
                Spacing Size
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="global-spacing-input"
                  type="number"
                  value={spacing}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    handleSpacingChange(newValue);
                  }}
                  min={0.15}
                  max={0.35}
                  step={0.001}
                  className="h-6 w-24 px-2 text-xs"
                />
                <span className="text-muted-foreground text-xs">rem</span>
              </div>
            </div>
            <Slider
              id="global-spacing-slider"
              value={[spacing]}
              min={0.15}
              max={0.35}
              step={0.001}
              onValueChange={(values) => handleSpacingChange(values[0])}
              className="py-1"
            />
          </div>

          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <Label
                htmlFor="global-letter-spacing-slider"
                className="text-lg text-foreground dark:text-white font-medium"
              >
                Letter Spacing
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="global-letter-spacing-input"
                  type="number"
                  value={letterSpacing}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    handleLetterSpacingChange(newValue);
                  }}
                  min={-0.05}
                  max={0.05}
                  step={0.001}
                  className="h-6 w-24 px-2 text-xs"
                />
                <span className="text-muted-foreground text-xs">em</span>
              </div>
            </div>
            <Slider
              id="global-letter-spacing-slider"
              value={[letterSpacing]}
              min={-0.1}
              max={0.5}
              step={0.001}
              onValueChange={(values) => handleLetterSpacingChange(values[0])}
              className="py-1"
            />
          </div>

          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between">
              <Label
                htmlFor="global-radius-slider"
                className="text-lg text-foreground dark:text-white font-medium"
              >
                Border Radius
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="global-radius-input"
                  type="number"
                  value={borderRadius}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    handleBorderRadiusChange(newValue);
                  }}
                  min={0}
                  max={5}
                  step={0.05}
                  className="h-6 w-24 px-2 text-xs"
                />
                <span className="text-muted-foreground text-xs">rem</span>
              </div>
            </div>
            <Slider
              id="global-radius-slider"
              value={[borderRadius]}
              min={0}
              max={5}
              step={0.05}
              onValueChange={(values) => handleBorderRadiusChange(values[0])}
              className="py-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalModifier;
