import CreateView from "@/features/create/views/create-view";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create",
  description:
    "Upload your resume and let AI build a professional business card in under a minute.",
};

const CreatePage = () => {
  return <CreateView />;
};

export default CreatePage;
