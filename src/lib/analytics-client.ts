const VISITOR_STORAGE_KEY = "cardably_visitor_id";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_STORAGE_KEY, id);
  return id;
}
