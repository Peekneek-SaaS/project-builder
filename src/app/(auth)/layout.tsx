import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import * as motion from "motion/react-client";
import {
  defaultTransition,
  fadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import {
  ArrowLeft01Icon,
  AiMagicIcon,
  GoogleDocIcon,
  CursorMagicSelection03Icon,
  Share08Icon,
  Loading03Icon,
  PaintBoardIcon,
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
                <Link href="/" className="dark:text-white ">
                  <HugeiconsIcon icon={ArrowLeft01Icon} />
                  Back to home
                </Link>
              </Button>
            </div>
            <motion.div
              className="flex items-center justify-center h-full"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={defaultTransition}
            >
              {children}
            </motion.div>
          </Wrapper>
          <div className="hidden lg:flex flex-1 bg-primary text-white">
            <Wrapper className="py-4 flex flex-col justify-between h-full">
              <div>
                <Badge variant="outline" className="text-white border-white ">
                  <HugeiconsIcon icon={AiMagicIcon} size={20} />
                  AI powered
                </Badge>
              </div>
              <div className="flex flex-col">
                <motion.div
                  className="space-y-3"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  <motion.h1
                    variants={staggerItem}
                    className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance"
                  >
                    One upload away from creating your business card.
                  </motion.h1>
                  <motion.ul className="space-y-1" variants={staggerContainer}>
                    <motion.li
                      variants={staggerItem}
                      className="flex gap-1 items-center"
                    >
                      <HugeiconsIcon icon={GoogleDocIcon} size={20} />
                      Parse your resume automatically with AI
                    </motion.li>
                    <motion.li
                      variants={staggerItem}
                      className="flex gap-1 items-center"
                    >
                      <HugeiconsIcon icon={PaintBoardIcon} size={20} />
                      Choose from beautiful, modern themes
                    </motion.li>
                    <motion.li
                      variants={staggerItem}
                      className="flex gap-1 items-center"
                    >
                      <HugeiconsIcon icon={Share08Icon} size={20} />
                      Share via link or QR and track every view
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ ...defaultTransition, delay: 0.3 }}
              >
                <p className="leading-7">
                  Cardify replaced my paper cards entirely. I share one link
                  and I'm done.
                </p>
              </motion.div>
            </Wrapper>
          </div>
        </div>
      </ClerkLoaded>
    </>
  );
};

export default AuthLayout;
