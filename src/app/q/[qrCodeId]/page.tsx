import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicQrCardView } from "@/features/share/views/public-qr-card-view";
import { loadPublicCardByQrCodeId } from "@/lib/public-card-server";

export default async function QrRedirectPage({
  params,
}: {
  params: Promise<{ qrCodeId: string }>;
}) {
  const { qrCodeId } = await params;
  const card = await loadPublicCardByQrCodeId(qrCodeId);

  if (!card) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm font-medium">QR code not found</p>
        <p className="text-sm text-muted-foreground">
          This QR link may be invalid, point to another environment, or the card
          was removed. Open Share in Cardably and confirm the URL under your QR
          matches this site.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  return <PublicQrCardView card={card} />;
}
