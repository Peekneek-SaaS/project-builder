export const TRASH_RETENTION_DAYS = 30;

export const TRASH_RETENTION_MS = TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;

/** tRPC JSON responses serialize dates as strings — normalize before use. */
export function toDate(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getTrashExpiresAt(deletedAt: Date | string): Date {
  const date = toDate(deletedAt) ?? new Date();
  return new Date(date.getTime() + TRASH_RETENTION_MS);
}

export function getTrashDaysRemaining(deletedAt: Date | string): number {
  const remainingMs = getTrashExpiresAt(deletedAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}
