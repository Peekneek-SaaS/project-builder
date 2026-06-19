import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import {
  ArrowLeft01Icon,
  AiMagicIcon,
  GoogleDocIcon,
  CursorMagicSelection03Icon,
  Share08Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import Logo from "../../../public/Logo/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <div className="flex justify-center items-center min-h-screen">
          <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          Loading
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <div className="flex min-h-screen overflow-hidden">
          <Wrapper className="flex-1 py-4">
            <div className="flex items-center justify-between">
              <Logo />
              <Button variant="link" asChild>
                <Link href="/">
                  <HugeiconsIcon icon={ArrowLeft01Icon} />
                  Back to home
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center h-full">
              {children}
            </div>
          </Wrapper>
          <div className="hidden lg:flex flex-1 bg-primary text-white dark:text-black">
            <Wrapper className="py-4 flex flex-col justify-between h-full">
              <div>
                <Badge
                  variant="outline"
                  className="text-white border-white dark:text-black dark:border-black"
                >
                  <HugeiconsIcon icon={AiMagicIcon} size={20} />
                  AI powered
                </Badge>
              </div>
              <div className="flex flex-col">
                <div className="space-y-3">
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
                    One upload away from a card people remember.
                  </h1>
                  <ul className="space-y-1">
                    <li className="flex gap-1 items-center">
                      <HugeiconsIcon icon={GoogleDocIcon} size={20} />
                      Parse your resume automatically with AI
                    </li>
                    <li className="flex gap-1 items-center">
                      <HugeiconsIcon
                        icon={CursorMagicSelection03Icon}
                        size={20}
                      />
                      Choose from beautiful, modern themes
                    </li>
                    <li className="flex gap-1 items-center">
                      <HugeiconsIcon icon={Share08Icon} size={20} />
                      Share via link or QR and track every view
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <p className="leading-7">
                  “Cardably replaced my paper cards entirely. I share one link
                  and I'm done.”
                </p>
              </div>
            </Wrapper>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
};

export default AuthLayout;
