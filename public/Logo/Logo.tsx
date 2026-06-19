import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="p-1 bg-primary rounded-md">
        <HugeiconsIcon icon={CreditCardIcon} size={22} color="white" />
      </span>
      <p className="leading-7 text-sm font-semibold">Cardify</p>
    </Link>
  );
};

export default Logo;
