import Wrapper from "@/components/Wrapper";
import React from "react";
import Logo from "../../../../public/Logo/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import CreateForm from "./create-form";
import { UserButton } from "@clerk/nextjs";

const CreateHeader = () => {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
      <Wrapper className="flex min-w-0 items-center justify-between gap-2 overflow-hidden border-b py-4">
        <Logo href="/dashboard" />
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
            <Link href="/dashboard">
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </Button>
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </Wrapper>
      <CreateForm className="flex flex-1 flex-col min-h-0" />
    </div>
  );
};

export default CreateHeader;
