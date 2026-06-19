import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const Wrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <div className={cn("px-2 md:px-4", className)}>{children}</div>;
};

export default Wrapper;
