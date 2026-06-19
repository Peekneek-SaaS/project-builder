"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { getQrCardUrl } from "@/lib/card-slug";
import { Download01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type ShareQrCodeProps = {
  qrCodeId: string;
  downloadName: string;
};

export function ShareQrCode({ qrCodeId, downloadName }: ShareQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const qrUrl = getQrCardUrl(qrCodeId);

  useEffect(() => {
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
  }, [qrUrl]);

  async function handleDownload() {
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
      <Button
        type="button"
        variant="outline"
        className="gap-1.5"
        disabled={loading || downloading}
        onClick={() => void handleDownload()}
      >
        {downloading ? (
          <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
        ) : (
          <HugeiconsIcon icon={Download01Icon} size={14} />
        )}
        Download QR code
      </Button>
    </div>
  );
}
