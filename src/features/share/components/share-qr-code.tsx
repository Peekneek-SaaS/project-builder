"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { getQrCardUrl } from "@/lib/card-slug";
import { Download01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ShareQrCodeProps = {
  qrCodeId: string;
  downloadName: string;
  published: boolean;
  canPublish?: boolean;
  publishPending?: boolean;
  onPublish?: () => void;
};

export function ShareQrCode({
  qrCodeId,
  downloadName,
  published,
  canPublish = true,
  publishPending = false,
  onPublish,
}: ShareQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const qrUrl = getQrCardUrl(qrCodeId);

  useEffect(() => {
    if (!published) {
      setLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);
    void QRCode.toCanvas(canvas, qrUrl, {
      width: 240,
      margin: 2,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [published, qrUrl]);

  async function handleDownload() {
    if (!published) {
      onPublish?.();
      return;
    }

    try {
      setDownloading(true);
      const dataUrl = await QRCode.toDataURL(qrUrl, {
        width: 1024,
        margin: 2,
        color: { dark: "#0a0a0a", light: "#ffffff" },
      });

      const link = document.createElement("a");
      link.download = `${downloadName.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "card"}-qr.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  if (!published) {
    return (
      <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          {canPublish
            ? "Publish your card first to activate the QR code. The link is permanent once generated — publishing does not change the encoded URL."
            : "Upgrade to Pro to publish your card and activate the QR code."}
        </p>
        {canPublish ? (
          <Button
            type="button"
            disabled={publishPending}
            onClick={() => onPublish?.()}
          >
            {publishPending ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={14}
                  className="animate-spin"
                />
                Publishing…
              </>
            ) : (
              "Publish & show QR code"
            )}
          </Button>
        ) : (
          <Button type="button" asChild>
            <Link href="/settings#pricing-plans">Upgrade to Pro</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl border border-border bg-white p-4 shadow-sm">
        {loading ? (
          <div className="flex size-[240px] items-center justify-center">
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          </div>
        ) : null}
        <canvas
          ref={canvasRef}
          className={loading ? "hidden" : "block"}
          aria-label="QR code for this card"
        />
      </div>
      <p className="max-w-sm text-center font-mono text-xs text-muted-foreground break-all">
        {qrUrl}
      </p>
      <p className="max-w-sm text-center text-xs text-muted-foreground">
        Scan this URL on your phone before printing — it must match your live
        site (not localhost).
      </p>
      <Button
        type="button"
        variant="outline"
        className="gap-1.5"
        disabled={loading || downloading}
        onClick={() => void handleDownload()}
      >
        {downloading ? (
          <HugeiconsIcon
            icon={Loading03Icon}
            size={14}
            className="animate-spin"
          />
        ) : (
          <HugeiconsIcon icon={Download01Icon} size={14} />
        )}
        Download QR code
      </Button>
    </div>
  );
}
