import DashboardView from "@/features/dashboard/views/dashboard-view";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View, search, and manage all your business cards in one place.",
};

const Dashboard = () => {
  return <DashboardView />;
};

export default Dashboard;
