import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your account, appearance, billing plan, and workspace preferences.",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
