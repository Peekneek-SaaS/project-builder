import Wrapper from "@/components/Wrapper";
import React from "react";
import Logo from "../../../../public/Logo/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import CreateForm from "./create-form";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";

const CreateHeader = () => {
  return (
    <div className="flex h-screen min-w-0 flex-col overflow-hidden">
      <Wrapper className="sticky top-0 z-20 flex min-w-0 shrink-0 items-center justify-between gap-2 overflow-hidden border-b bg-background/95 py-4 backdrop-blur-md">
        <Logo href="/dashboard" />
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/dashboard">
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </Button>
          <ModeToggle />
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </Wrapper>
      <CreateForm className="flex flex-1 flex-col min-h-0" />
    </div>
  );
};

export default CreateHeader;
