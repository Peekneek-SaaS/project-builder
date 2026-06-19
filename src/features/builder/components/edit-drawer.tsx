"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import {
  Add01Icon,
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
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

type EditCardPanelProps = {
  data: CardData;
  setData: (d: CardData) => void;
  className?: string;
};

export function EditCardPanel({ data, setData, className }: EditCardPanelProps) {
  const [skillInput, setSkillInput] = useState("");
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

  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    update("skills", [...data.skills, value]);
    setSkillInput("");
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Section title="Branding (front page)">
        <FieldRow
          fieldKey="logo"
          label="Company logo"
          data={data}
          onToggle={(enabled) => updateFieldStyle("logo", { enabled })}
          onStyleChange={(patch) => updateFieldStyle("logo", patch)}
          showStyleControls={false}
        >
          {data.logoUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <img
                src={data.logoUrl}
                alt="Logo preview"
                className="h-12 max-w-[120px] object-contain"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update("logoUrl", "")}
              >
                Remove
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
          onValueChange={(value) => update("company", value)}
          onStyleChange={(patch) => updateFieldStyle("company", patch)}
        />
        <FieldInputRow
          id="tagline"
          fieldKey="tagline"
          label="Tagline"
          value={data.tagline}
          data={data}
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
          onValueChange={(value) => update("name", value)}
          onStyleChange={(patch) => updateFieldStyle("name", patch)}
        />
        <FieldInputRow
          id="title"
          fieldKey="title"
          label="Job title"
          value={data.title}
          data={data}
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
          onValueChange={(value) => update("email", value)}
          onStyleChange={(patch) => updateFieldStyle("email", patch)}
        />
        <FieldInputRow
          id="phone"
          fieldKey="phone"
          label="Phone"
          value={data.phone}
          data={data}
          onValueChange={(value) => update("phone", value)}
          onStyleChange={(patch) => updateFieldStyle("phone", patch)}
        />
        <FieldInputRow
          id="location"
          fieldKey="location"
          label="Location"
          value={data.location}
          data={data}
          onValueChange={(value) => update("location", value)}
          onStyleChange={(patch) => updateFieldStyle("location", patch)}
        />
        <FieldInputRow
          id="website"
          fieldKey="website"
          label="Website"
          value={data.website}
          data={data}
          onValueChange={(value) => update("website", value)}
          onStyleChange={(patch) => updateFieldStyle("website", patch)}
        />
      </Section>

      <Section title="Bio">
        <FieldRow
          fieldKey="bio"
          label="About you"
          data={data}
          onToggle={(enabled) => updateFieldStyle("bio", { enabled })}
          onStyleChange={(patch) => updateFieldStyle("bio", patch)}
        >
          <textarea
            id="bio"
            rows={4}
            value={data.bio}
            onChange={(e) => update("bio", e.target.value)}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </FieldRow>
      </Section>

      <Section title="Skills">
        <FieldRow
          fieldKey="skills"
          label="Skills"
          data={data}
          onToggle={(enabled) => updateFieldStyle("skills", { enabled })}
          onStyleChange={(patch) => updateFieldStyle("skills", patch)}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "skills",
                        data.skills.filter((s) => s !== skill),
                      )
                    }
                    aria-label={`Remove ${skill}`}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                placeholder="Add a skill…"
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
                aria-label="Add skill"
              >
                <HugeiconsIcon icon={Add01Icon} size={16} />
              </Button>
            </div>
          </div>
        </FieldRow>
      </Section>

      <Section title="Links">
        <FieldRow
          fieldKey="links"
          label="Links"
          data={data}
          onToggle={(enabled) => updateFieldStyle("links", { enabled })}
          onStyleChange={(patch) => updateFieldStyle("links", patch)}
        >
          <div className="space-y-2">
            {data.links.map((link, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <Input
                  value={link.label}
                  aria-label="Link label"
                  onChange={(e) => {
                    const links = [...data.links];
                    links[i] = { ...links[i], label: e.target.value };
                    update("links", links);
                  }}
                />
                <Input
                  value={link.href}
                  aria-label="Link URL"
                  onChange={(e) => {
                    const links = [...data.links];
                    links[i] = { ...links[i], href: e.target.value };
                    update("links", links);
                  }}
                />
              </div>
            ))}
          </div>
        </FieldRow>
      </Section>
    </div>
  );
}

export function EditCardDrawer({
  data,
  setData,
  open,
  setOpen,
  trigger,
}: {
  data: CardData;
  setData: (d: CardData) => void;
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
            Toggle fields, edit content, and customize text styling.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6 pt-2">
          <EditCardPanel data={data} setData={setData} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
          style={settings.color ? { backgroundColor: settings.color } : undefined}
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
  children,
  onToggle,
  onStyleChange,
  showStyleControls = true,
}: {
  fieldKey: CardFieldKey;
  label: string;
  data: CardData;
  children: ReactNode;
  onToggle: (enabled: boolean) => void;
  onStyleChange: (patch: Partial<CardFieldStyle>) => void;
  showStyleControls?: boolean;
}) {
  const settings = getFieldSettings(data, fieldKey);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`field-${fieldKey}`}
            checked={settings.enabled}
            onCheckedChange={(checked) => onToggle(checked === true)}
          />
          <Label
            htmlFor={`field-${fieldKey}`}
            className={cn(!settings.enabled && "text-muted-foreground")}
          >
            {label}
          </Label>
        </div>
        {showStyleControls ? (
          <FieldStyleControls settings={settings} onChange={onStyleChange} />
        ) : null}
      </div>
      <div
        className={cn(!settings.enabled && "pointer-events-none opacity-40")}
      >
        {children}
      </div>
    </div>
  );
}

function FieldInputRow({
  id,
  fieldKey,
  label,
  value,
  data,
  onValueChange,
  onStyleChange,
  placeholder,
}: {
  id: string;
  fieldKey: CardFieldKey;
  label: string;
  value: string;
  data: CardData;
  onValueChange: (value: string) => void;
  onStyleChange: (patch: Partial<CardFieldStyle>) => void;
  placeholder?: string;
}) {
  const settings = getFieldSettings(data, fieldKey);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox
          id={`field-${fieldKey}`}
          checked={settings.enabled}
          onCheckedChange={(checked) =>
            onStyleChange({ enabled: checked === true })
          }
        />
        <Label
          htmlFor={`field-${fieldKey}`}
          className={cn(!settings.enabled && "text-muted-foreground")}
        >
          {label}
        </Label>
      </div>
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
    </div>
  );
}
