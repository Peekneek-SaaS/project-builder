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
    <div className="flex flex-col min-h-screen">
      <Wrapper className="flex items-center justify-between py-4 border-b">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <HugeiconsIcon icon={Cancel01Icon} size={20} />
              Exit
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
