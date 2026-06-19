import React, { ReactNode } from "react";

const CreateLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex min-h-screen flex-col">{children}</div>;
};

export default CreateLayout;
