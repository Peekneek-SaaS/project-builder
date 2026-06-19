import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function QrRedirectPage({
  params,
}: {
  params: Promise<{ qrCodeId: string }>;
}) {
  const { qrCodeId } = await params;

  const card = await prisma.card.findFirst({
    where: { qrCodeId, deletedAt: null },
    select: { slug: true, published: true },
  });

  if (!card) {
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

  if (!card.published || !card.slug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm font-medium">Card not available</p>
        <p className="text-sm text-muted-foreground">
          This card is not published yet. Ask the owner to turn on publishing.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  redirect(`/c/${card.slug}?utm_source=qr`);
}
