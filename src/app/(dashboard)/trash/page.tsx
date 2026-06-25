import TrashView from "@/features/dashboard/views/trash-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trash",
  description:
    "Restore deleted business cards or permanently remove them from your workspace.",
};

export default function TrashPage() {
  return <TrashView />;
}
