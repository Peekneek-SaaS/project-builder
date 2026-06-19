import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { PageEnter } from "@/components/motion";

const CreateLayout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PageEnter>{children}</PageEnter>
    </div>
  );
};

export default CreateLayout;
