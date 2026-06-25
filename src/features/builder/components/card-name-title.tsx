import type { CardData } from "@/lib/card-data";
import { isFieldEnabled } from "@/lib/card-field-utils";
import { FieldText } from "@/features/builder/components/field-text";
import type { ThemeStyleClasses } from "@/lib/card-theme-utils";
import { cn } from "@/lib/utils";

function tx(compact: boolean | undefined, sm: string, lg: string) {
  return compact ? sm : lg;
}

/** Vertical name + title stack — avoids inline span collapse on card layouts. */
export function NameTitleStack({
  data,
  compact,
  styles,
  className,
  nameClassName,
  titleClassName,
  align = "start",
}: {
  data: CardData;
  compact?: boolean;
  styles: ThemeStyleClasses;
  className?: string;
  nameClassName?: string;
  titleClassName?: string;
  align?: "start" | "end" | "center";
}) {
  const alignClass =
    align === "end"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start text-left";

  return (
    <div
      className={cn(
        "flex flex-col",
        tx(compact, "gap-0.5", "gap-1.5"),
        alignClass,
        className,
      )}
    >
      <FieldText
        data={data}
        fieldKey="name"
        as="p"
        className={cn(
          "block leading-tight font-semibold tracking-tight",
          tx(compact, "text-[9px]", "text-sm"),
          nameClassName,
        )}
      >
        {data.name}
      </FieldText>
      {isFieldEnabled(data, "title") && data.title ? (
        <FieldText
          data={data}
          fieldKey="title"
          as="p"
          className={cn(
            "block leading-snug",
            styles.subtext,
            tx(compact, "text-[7px]", "text-[10px]"),
            titleClassName,
          )}
        >
          {data.title}
        </FieldText>
      ) : null}
    </div>
  );
}
