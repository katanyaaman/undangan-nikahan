/** Pengganti LengthAwarePaginator Laravel. */
export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  from: number;
  to: number;
  hasPages: boolean;
  baseUrl: string;
  query: Record<string, string>;
}

export function buildPagination(
  total: number,
  page: number,
  perPage: number,
  baseUrl: string,
  query: Record<string, string> = {},
): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = Math.min(total, safePage * perPage);
  return {
    page: safePage,
    perPage,
    total,
    totalPages,
    from,
    to,
    hasPages: totalPages > 1,
    baseUrl,
    query,
  };
}

/** Nomor halaman untuk partial (window 5 + first/last). */
export function pageWindow(p: Pagination): (number | '…')[] {
  const { page, totalPages } = p;
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const set = new Set<number>([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages]);
  const nums = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) out.push('…');
    out.push(n);
    prev = n;
  }
  return out;
}

export function pageUrl(p: Pagination, page: number): string {
  const params = new URLSearchParams({ ...p.query, page: String(page) });
  return `${p.baseUrl}?${params.toString()}`;
}

export type PageLink = { num: number; url: string; active: boolean } | { ellipsis: true };

/** Link siap render untuk partial pagination. */
export function paginationLinks(p: Pagination): PageLink[] {
  const out: PageLink[] = [];
  let prev = 0;
  for (const n of pageWindow(p)) {
    if (n === '…') {
      out.push({ ellipsis: true });
      continue;
    }
    if (n - prev > 1) out.push({ ellipsis: true });
    out.push({ num: n, url: pageUrl(p, n), active: n === p.page });
    prev = n;
  }
  return out;
}
