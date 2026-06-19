import type { ElementType, ReactNode } from "react";

import type { CardData } from "@/lib/card-data";
import {
  getFieldClassName,
  getFieldInlineStyle,
  getFieldSettings,
  isFieldEnabled,
  type CardFieldKey,
} from "@/lib/card-field-utils";

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
      className={getFieldClassName(settings, className)}
      style={getFieldInlineStyle(settings)}
    >
      {children}
    </Component>
  );
}
