"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dashboard-mobile-banner-dismissed";

function hasDismissedBanner() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function dismissBanner() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Ignore storage failures (private mode, etc.)
  }
}

export function MobileExperienceBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasDismissedBanner());
  }, []);

  if (!visible) return null;

  return (
    <div className="relative flex h-8 w-full items-center justify-center bg-primary px-10 text-xs text-primary-foreground md:hidden">
      <span>Use large screen for better experience</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Dismiss"
        className="absolute right-1 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        onClick={() => {
          dismissBanner();
          setVisible(false);
        }}
      >
        <HugeiconsIcon icon={Cancel01Icon} />
      </Button>
    </div>
  );
}
