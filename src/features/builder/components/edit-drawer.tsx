"use client";

import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
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
import type { CardData } from "@/lib/card-data";
import {
  type CardFieldKey,
  type CardFieldStyle,
  getFieldSettings,
} from "@/lib/card-field-utils";
import { getSupportedFieldsForLayout } from "@/lib/card-layout-fields";
import { getTheme } from "@/lib/card-themes";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("space-y-6", className)}>
      <Section title="Branding (front page)">
        <FieldRow
          fieldKey="logo"
          label="Company logo"
          data={data}
          supported={isSupported("logo")}
          onToggle={(enabled) => updateFieldStyle("logo", { enabled })}
          onStyleChange={(patch) => updateFieldStyle("logo", patch)}
          showStyleControls={false}
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

        <FieldInputRow
          id="company"
          fieldKey="company"
          label="Company name"
          value={data.company}
          data={data}
          supported={isSupported("company")}
          onValueChange={(value) => update("company", value)}
          onStyleChange={(patch) => updateFieldStyle("company", patch)}
        />
        <FieldInputRow
          id="tagline"
          fieldKey="tagline"
          label="Tagline"
          value={data.tagline}
          data={data}
          supported={isSupported("tagline")}
          placeholder="Design that defines you"
          onValueChange={(value) => update("tagline", value)}
          onStyleChange={(patch) => updateFieldStyle("tagline", patch)}
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
}: {
  settings: CardFieldStyle;
  onChange: (patch: Partial<CardFieldStyle>) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <label
        className="relative grid size-8 cursor-pointer place-items-center rounded-md border border-border hover:bg-muted"
        title="Text color"
      >
        <input
          type="color"
          value={settings.color || "#64748b"}
          className="sr-only"
          onChange={(e) => onChange({ color: e.target.value })}
        />
        <span
          className={cn(
            "size-4 rounded-full border border-border",
            !settings.color && "bg-muted",
          )}
          style={
            settings.color ? { backgroundColor: settings.color } : undefined
          }
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
}: {
  fieldKey: CardFieldKey;
  label: string;
  data: CardData;
  supported?: boolean;
  children: ReactNode;
  onToggle: (enabled: boolean) => void;
  onStyleChange: (patch: Partial<CardFieldStyle>) => void;
  showStyleControls?: boolean;
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
          <FieldStyleControls settings={settings} onChange={onStyleChange} />
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
          <FieldStyleControls settings={settings} onChange={onStyleChange} />
        </div>
      ) : null}
    </div>
  );
}
