"use client";

import type { ElementType, ReactNode } from "react";

import type { CardData } from "@/lib/card-data";
import {
  getFieldClassName,
  getFieldInlineStyle,
  getFieldSettings,
  isFieldEnabled,
  type CardFieldKey,
} from "@/lib/card-field-utils";
import { cn } from "@/lib/utils";

export function FieldText({
  data,
  fieldKey,
  children,
  className,
  as: Component = "span",
}: {
  data: CardData;
  fieldKey: CardFieldKey;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  if (!isFieldEnabled(data, fieldKey)) return null;
  if (children == null || children === false) return null;
  if (typeof children === "string" && !children.trim()) return null;

  const settings = getFieldSettings(data, fieldKey);

  return (
    <Component
      className={cn(
        getFieldClassName(settings, className),
        settings.fontSize > 0 && "min-w-0 max-w-full break-words",
      )}
      style={getFieldInlineStyle(settings)}
    >
      {children}
    </Component>
  );
}
