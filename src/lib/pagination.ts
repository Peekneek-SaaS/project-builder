export const PAGE_SIZE = 10;

export function getTotalPages(totalItems: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = PAGE_SIZE,
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
