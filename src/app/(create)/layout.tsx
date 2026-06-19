import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const CreateLayout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <div className="flex min-h-screen flex-col">{children}</div>;
};

export default CreateLayout;
