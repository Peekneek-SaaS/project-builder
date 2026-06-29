"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Cancel01Icon,
  CloudUploadIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CardColorOverrides, CardData } from "@/lib/card-data";
import {
  CARD_FIELD_FONT_SIZES,
  CARD_FIELD_KEYS,
  type CardFieldKey,
  type CardFieldStyle,
  getFieldSettings,
} from "@/lib/card-field-utils";
import { getSupportedFieldsForLayout } from "@/lib/card-layout-fields";
import { getTheme } from "@/lib/card-themes";
import { getThemeStyleClasses } from "@/lib/card-theme-utils";
import { usesInvertedCardSides } from "@/lib/card-side-inversion";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

type CardSide = "front" | "back";

function rgbToHex(value: string): string | undefined {
  const parts = value.match(/\d+(\.\d+)?/g);
  if (!parts || parts.length < 3) return undefined;
  const [r, g, b] = parts.slice(0, 3).map((n) => Math.round(Number(n)));
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Resolves a Tailwind color class to its hex value via the live stylesheet. */
function resolveClassColor(
  className: string,
  kind: "bg" | "text",
): string | undefined {
  if (typeof document === "undefined" || !className) return undefined;
  const el = document.createElement("span");
  el.className = className;
  el.style.position = "fixed";
  el.style.left = "-9999px";
  el.style.top = "0";
  el.style.pointerEvents = "none";
  document.body.appendChild(el);
  const computed = getComputedStyle(el);
  const raw = kind === "bg" ? computed.backgroundColor : computed.color;
  document.body.removeChild(el);
  return rgbToHex(raw);
}

type ResolvedThemeColors = {
  front: { background?: string; text?: string };
  back: { background?: string; text?: string };
  accent?: string;
};

/** Theme default colors (hex) for each visual side, resolved on the client. */
function useThemeDefaultColors(themeId: string): ResolvedThemeColors {
  const [resolved, setResolved] = useState<ResolvedThemeColors>({
    front: {},
    back: {},
  });

  useEffect(() => {
    const base = getThemeStyleClasses(themeId);
    const inverted = usesInvertedCardSides(getTheme(themeId).layout);

    const frontSurface = inverted ? base.surface : base.frontSurface;
    const backSurface = inverted ? base.frontSurface : base.surface;
    const frontText = inverted ? base.text : base.frontText;
    const backText = inverted ? base.frontText : base.text;

    setResolved({
      front: {
        background: resolveClassColor(frontSurface, "bg"),
        text: resolveClassColor(frontText, "text"),
      },
      back: {
        background: resolveClassColor(backSurface, "bg"),
        text: resolveClassColor(backText, "text"),
      },
      accent: resolveClassColor(base.accent, "bg"),
    });
  }, [themeId]);

  return resolved;
}

type EditCardPanelProps = {
  data: CardData;
  setData: (d: CardData) => void;
  themeId: string;
  className?: string;
};

export function EditCardPanel({
  data,
  setData,
  themeId,
  className,
}: EditCardPanelProps) {
  const supportedFields = useMemo(
    () => getSupportedFieldsForLayout(getTheme(themeId).layout),
    [themeId],
  );
  const isSupported = (fieldKey: CardFieldKey) =>
    supportedFields.has(fieldKey);

  const themeDefaults = useThemeDefaultColors(themeId);
  const [editFront, setEditFront] = useState(true);
  const [editBack, setEditBack] = useState(true);

  // Exact rendered color of each field, read from the live preview card.
  const [fieldColors, setFieldColors] = useState<
    Partial<Record<CardFieldKey, string>>
  >({});

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.querySelector("[data-card-preview]");
    if (!root) return;

    const next: Partial<Record<CardFieldKey, string>> = {};
    for (const key of CARD_FIELD_KEYS) {
      const el = root.querySelector(`[data-card-field="${key}"]`);
      if (!el) continue;
      const hex = rgbToHex(getComputedStyle(el).color);
      if (hex) next[key] = hex;
    }
    setFieldColors(next);
  }, [data, themeId]);

  const fallbackTextColor =
    themeDefaults.front.text ?? themeDefaults.back.text ?? "#64748b";
  const colorFor = (key: CardFieldKey) => fieldColors[key] ?? fallbackTextColor;

  const uploadErrorRef = useRef<string | null>(null);
  const { startUpload, isUploading } = useUploadThing("logoUploader", {
    onUploadError: (error) => {
      uploadErrorRef.current = error.message;
    },
  });

  function update<K extends keyof CardData>(key: K, value: CardData[K]) {
    setData({ ...data, [key]: value });
  }

  function updateFieldStyle(
    fieldKey: CardFieldKey,
    patch: Partial<CardFieldStyle>,
  ) {
    const current = getFieldSettings(data, fieldKey);
    setData({
      ...data,
      fieldSettings: {
        ...data.fieldSettings,
        [fieldKey]: { ...current, ...patch },
      },
    });
  }

  function commitColors(next: CardColorOverrides) {
    const front =
      next.front && (next.front.background || next.front.text)
        ? next.front
        : undefined;
    const back =
      next.back && (next.back.background || next.back.text)
        ? next.back
        : undefined;
    const accent = next.accent || undefined;
    const hasAny = front || back || accent;
    setData({
      ...data,
      customColors: hasAny ? { front, back, accent } : undefined,
    });
  }

  function updateSideColor(
    sides: CardSide[],
    field: "background" | "text",
    value: string | undefined,
  ) {
    const current = data.customColors ?? {};
    const next: CardColorOverrides = {
      front: { ...current.front },
      back: { ...current.back },
      accent: current.accent,
    };
    for (const side of sides) {
      const sideObj = { ...next[side] };
      if (value) {
        sideObj[field] = value;
      } else {
        delete sideObj[field];
      }
      next[side] = sideObj;
    }
    commitColors(next);
  }

  function updateAccent(value: string | undefined) {
    commitColors({ ...(data.customColors ?? {}), accent: value });
  }

  async function handleLogoUpload(file: File) {
    try {
      uploadErrorRef.current = null;
      const result = await startUpload([file]);
      const uploaded = result?.[0];
      if (!uploaded) {
        throw new Error(uploadErrorRef.current ?? "Logo upload failed.");
      }
      const url = uploaded.ufsUrl ?? uploaded.url;
      if (!url) throw new Error("Upload succeeded but logo URL was missing.");
      update("logoUrl", url);
      toast.success("Logo uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Logo upload failed.",
      );
    }
  }

  const customColors = data.customColors;
  const hasCustomColors = Boolean(
    customColors &&
      (customColors.accent ||
        customColors.front?.background ||
        customColors.front?.text ||
        customColors.back?.background ||
        customColors.back?.text),
  );

  const targetSides: CardSide[] = [
    ...(editFront ? (["front"] as const) : []),
    ...(editBack ? (["back"] as const) : []),
  ];
  // Side whose current value is shown in the swatches (front takes priority).
  const previewSide: CardSide = editFront ? "front" : "back";

  const bgValue =
    customColors?.[previewSide]?.background ??
    themeDefaults[previewSide].background;
  const textValue =
    customColors?.[previewSide]?.text ?? themeDefaults[previewSide].text;
  const accentValue = customColors?.accent ?? themeDefaults.accent;

  return (
    <div className={cn("space-y-6", className)}>
      <Section title="Card colors">
        <p className="-mt-1 text-xs text-muted-foreground">
          Pick which side(s) to recolor, then choose colors. Swatches show the
          current color.
        </p>
        <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground">
              Apply to
            </span>
            <label className="flex cursor-pointer items-center gap-1.5">
              <Checkbox
                checked={editFront}
                onCheckedChange={(checked) => setEditFront(checked === true)}
              />
              <span className="text-sm">Front</span>
            </label>
            <label className="flex cursor-pointer items-center gap-1.5">
              <Checkbox
                checked={editBack}
                onCheckedChange={(checked) => setEditBack(checked === true)}
              />
              <span className="text-sm">Back</span>
            </label>
          </div>

          <ColorRow
            label="Background"
            value={bgValue}
            isCustom={Boolean(customColors?.[previewSide]?.background)}
            disabled={targetSides.length === 0}
            onChange={(value) =>
              updateSideColor(targetSides, "background", value)
            }
          />
          <ColorRow
            label="Text"
            value={textValue}
            isCustom={Boolean(customColors?.[previewSide]?.text)}
            disabled={targetSides.length === 0}
            onChange={(value) => updateSideColor(targetSides, "text", value)}
          />
          <ColorRow
            label="Accent"
            hint="whole card"
            value={accentValue}
            isCustom={Boolean(customColors?.accent)}
            onChange={(value) => updateAccent(value)}
          />
          {hasCustomColors ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-full text-xs text-muted-foreground"
              onClick={() => setData({ ...data, customColors: undefined })}
            >
              Reset all to theme
            </Button>
          ) : null}
        </div>
      </Section>

      <Section title="Branding (front page)">
        {isSupported("logo") ? (
          <FieldRow
            fieldKey="logo"
            label="Company logo"
            data={data}
            supported
            onToggle={(enabled) => updateFieldStyle("logo", { enabled })}
            onStyleChange={(patch) => updateFieldStyle("logo", patch)}
            showStyleControls
            styleMode="logo"
          >
            {data.logoUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <img
                  src={data.logoUrl}
                  alt="Logo preview"
                  className="h-12 max-w-[120px] object-contain rounded-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => update("logoUrl", "")}
                >
                  Remove <HugeiconsIcon icon={Cancel01Icon} color="red" />
                </Button>
              </div>
            ) : (
              <label
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-5 text-center transition-colors hover:border-primary",
                  isUploading && "pointer-events-none opacity-60",
                )}
              >
                <HugeiconsIcon
                  icon={CloudUploadIcon}
                  size={20}
                  className="text-primary"
                />
                <span className="text-sm font-medium">
                  {isUploading ? "Uploading…" : "Upload logo"}
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, SVG up to 2MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleLogoUpload(file);
                  }}
                />
              </label>
            )}
          </FieldRow>
        ) : null}

        <FieldInputRow
          id="company"
          fieldKey="company"
          label="Company name"
          value={data.company}
          data={data}
          supported={isSupported("company")}
          onValueChange={(value) => update("company", value)}
          onStyleChange={(patch) => updateFieldStyle("company", patch)}
          defaultColor={colorFor("company")}
        />

      </Section>

      <Section title="Basics">
        <FieldInputRow
          id="name"
          fieldKey="name"
          label="Full name"
          value={data.name}
          data={data}
          supported={isSupported("name")}
          onValueChange={(value) => update("name", value)}
          onStyleChange={(patch) => updateFieldStyle("name", patch)}
          defaultColor={colorFor("name")}
        />
        <FieldInputRow
          id="title"
          fieldKey="title"
          label="Job title"
          value={data.title}
          data={data}
          supported={isSupported("title")}
          onValueChange={(value) => update("title", value)}
          onStyleChange={(patch) => updateFieldStyle("title", patch)}
          defaultColor={colorFor("title")}
        />
      </Section>

      <Section title="Contact">
        <FieldInputRow
          id="email"
          fieldKey="email"
          label="Email"
          value={data.email}
          data={data}
          supported={isSupported("email")}
          onValueChange={(value) => update("email", value)}
          onStyleChange={(patch) => updateFieldStyle("email", patch)}
          defaultColor={colorFor("email")}
        />
        <FieldInputRow
          id="phone"
          fieldKey="phone"
          label="Phone"
          value={data.phone}
          data={data}
          supported={isSupported("phone")}
          onValueChange={(value) => update("phone", value)}
          onStyleChange={(patch) => updateFieldStyle("phone", patch)}
          defaultColor={colorFor("phone")}
        />
        <FieldInputRow
          id="location"
          fieldKey="location"
          label="Location"
          value={data.location}
          data={data}
          supported={isSupported("location")}
          onValueChange={(value) => update("location", value)}
          onStyleChange={(patch) => updateFieldStyle("location", patch)}
          defaultColor={colorFor("location")}
        />
        <FieldInputRow
          id="website"
          fieldKey="website"
          label="Website"
          value={data.website}
          data={data}
          supported={isSupported("website")}
          onValueChange={(value) => update("website", value)}
          onStyleChange={(patch) => updateFieldStyle("website", patch)}
          defaultColor={colorFor("website")}
        />
      </Section>
    </div>
  );
}

export function EditCardDrawer({
  data,
  setData,
  themeId,
  open,
  setOpen,
  trigger,
}: {
  data: CardData;
  setData: (d: CardData) => void;
  themeId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: ReactNode;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[88vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <DrawerTitle>Edit card details</DrawerTitle>
          <DrawerDescription>
            Toggle fields, edit content, and customize text styling. Unavailable
            fields depend on the card theme.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 pt-2">
          <EditCardPanel data={data} setData={setData} themeId={themeId} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ColorRow({
  label,
  hint,
  value,
  isCustom,
  disabled = false,
  onChange,
}: {
  label: string;
  hint?: string;
  /** Effective color shown in the swatch (override or resolved theme default). */
  value: string | undefined;
  /** Whether the current value is a user override (vs the theme default). */
  isCustom: boolean;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-center gap-2">
        <Label className="text-sm">{label}</Label>
        <span className="text-[10px] text-muted-foreground">
          {hint ?? (isCustom ? "Custom" : "Theme default")}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <label
          className="relative grid size-8 cursor-pointer place-items-center rounded-md border border-border hover:bg-muted"
          title={`${label} color`}
        >
          <input
            type="color"
            value={value || "#000000"}
            className="sr-only"
            onChange={(e) => onChange(e.target.value)}
          />
          <span
            className="size-4 rounded-full border border-border"
            style={value ? { backgroundColor: value } : undefined}
          />
        </label>
        {isCustom ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onChange(undefined)}
            aria-label={`Reset ${label} color`}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FieldStyleControls({
  settings,
  onChange,
  styleMode = "text",
  defaultColor,
}: {
  settings: CardFieldStyle;
  onChange: (patch: Partial<CardFieldStyle>) => void;
  styleMode?: "text" | "logo";
  /** Effective color shown when the field has no custom color set. */
  defaultColor?: string;
}) {
  const fontSizeValue = settings.fontSize > 0 ? String(settings.fontSize) : "auto";
  const swatchColor = settings.color || defaultColor;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
      <Select
        value={fontSizeValue}
        onValueChange={(value) =>
          onChange({ fontSize: value === "auto" ? 0 : Number(value) })
        }
      >
        <SelectTrigger
          size="sm"
          className="h-8 w-[4.75rem] px-2 text-[11px]"
          aria-label="Font size"
        >
          <SelectValue placeholder="Auto" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="auto">Auto</SelectItem>
          {CARD_FIELD_FONT_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {styleMode === "text" ? (
        <>
          <label
            className="relative grid size-8 cursor-pointer place-items-center rounded-md border border-border hover:bg-muted"
            title="Text color"
          >
            <input
              type="color"
              value={swatchColor || "#64748b"}
              className="sr-only"
              onChange={(e) => onChange({ color: e.target.value })}
            />
            <span
              className={cn(
                "size-4 rounded-full border border-border",
                !swatchColor && "bg-muted",
              )}
              style={swatchColor ? { backgroundColor: swatchColor } : undefined}
            />
          </label>
          <Toggle
            size="sm"
            pressed={settings.bold}
            onPressedChange={(pressed) => onChange({ bold: pressed })}
            aria-label="Bold"
            className="size-8 px-0"
          >
            <span className="text-xs font-bold">B</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={settings.italic}
            onPressedChange={(pressed) => onChange({ italic: pressed })}
            aria-label="Italic"
            className="size-8 px-0"
          >
            <span className="text-xs italic">I</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={settings.uppercase}
            onPressedChange={(pressed) => onChange({ uppercase: pressed })}
            aria-label="Uppercase"
            className="size-8 px-0"
          >
            <span className="text-[10px] font-medium">Aa</span>
          </Toggle>
        </>
      ) : null}
    </div>
  );
}

function FieldRow({
  fieldKey,
  label,
  data,
  supported = true,
  children,
  onToggle,
  onStyleChange,
  showStyleControls = true,
  styleMode = "text",
}: {
  fieldKey: CardFieldKey;
  label: string;
  data: CardData;
  supported?: boolean;
  children: ReactNode;
  onToggle: (enabled: boolean) => void;
  onStyleChange: (patch: Partial<CardFieldStyle>) => void;
  showStyleControls?: boolean;
  styleMode?: "text" | "logo";
}) {
  const settings = getFieldSettings(data, fieldKey);

  return (
    <div className={cn("space-y-2", !supported && "opacity-60")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Checkbox
            id={`field-${fieldKey}`}
            checked={supported ? settings.enabled : false}
            disabled={!supported}
            onCheckedChange={(checked) => onToggle(checked === true)}
          />
          <Label
            htmlFor={`field-${fieldKey}`}
            className={cn(
              (!supported || !settings.enabled) && "text-muted-foreground",
            )}
          >
            {label}
          </Label>
          {!supported ? (
            <Badge variant="outline" className="text-[10px] font-normal">
              Not on this theme
            </Badge>
          ) : null}
        </div>
        {showStyleControls && supported ? (
          <FieldStyleControls
            settings={settings}
            onChange={onStyleChange}
            styleMode={styleMode}
          />
        ) : null}
      </div>
      {supported ? (
        <div
          className={cn(!settings.enabled && "pointer-events-none opacity-40")}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function FieldInputRow({
  id,
  fieldKey,
  label,
  value,
  data,
  supported = true,
  onValueChange,
  onStyleChange,
  placeholder,
  defaultColor,
}: {
  id: string;
  fieldKey: CardFieldKey;
  label: string;
  value: string;
  data: CardData;
  supported?: boolean;
  onValueChange: (value: string) => void;
  onStyleChange: (patch: Partial<CardFieldStyle>) => void;
  placeholder?: string;
  defaultColor?: string;
}) {
  const settings = getFieldSettings(data, fieldKey);

  return (
    <div className={cn("space-y-2", !supported && "opacity-60")}>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Checkbox
          id={`field-${fieldKey}`}
          checked={supported ? settings.enabled : false}
          disabled={!supported}
          onCheckedChange={(checked) =>
            onStyleChange({ enabled: checked === true })
          }
        />
        <Label
          htmlFor={`field-${fieldKey}`}
          className={cn(
            (!supported || !settings.enabled) && "text-muted-foreground",
          )}
        >
          {label}
        </Label>
        {!supported ? (
          <Badge variant="outline" className="text-[10px] font-normal">
            Not on this theme
          </Badge>
        ) : null}
      </div>
      {supported ? (
        <div
          className={cn(
            "flex items-center gap-2",
            !settings.enabled && "pointer-events-none opacity-40",
          )}
        >
          <Input
            id={id}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onValueChange(e.target.value)}
            className="min-w-0 flex-1"
          />
          <FieldStyleControls
            settings={settings}
            onChange={onStyleChange}
            defaultColor={defaultColor}
          />
        </div>
      ) : null}
    </div>
  );
}
