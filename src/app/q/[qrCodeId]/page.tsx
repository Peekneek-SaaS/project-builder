import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { resolveQrRedirect } from "@/lib/qr-redirect";

export default async function QrRedirectPage({
  params,
}: {
  params: Promise<{ qrCodeId: string }>;
}) {
  const { qrCodeId } = await params;
  const result = await resolveQrRedirect(qrCodeId);

  if (result.status === "not_found") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm font-medium">QR code not found</p>
        <p className="text-sm text-muted-foreground">
          This QR link may be invalid or the card was removed.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  redirect(`/c/${result.slug}?utm_source=qr`);
}
