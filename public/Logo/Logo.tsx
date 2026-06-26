import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  className2,
  href,
}: {
  className?: string;
  className2?: string;
  href?: string;
}) => {
  return (
    <Link
      href={href ? href : "/"}
      className={cn("flex items-center gap-2", className)}
    >
      <span className="p-1 bg-primary rounded-md">
        <HugeiconsIcon icon={CreditCardIcon} size={22} color="white" />
      </span>
      <p className={cn("leading-7 text-lg font-semibold", className2)}>
        Kardably
      </p>
    </Link>
  );
};

export default Logo;
