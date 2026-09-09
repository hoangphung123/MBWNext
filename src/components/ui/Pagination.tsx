type PaginationProps = { page: number; pageSize: number; totalItems: number; onPageChange: (page: number) => void };
export function Pagination({ page, pageSize, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  return <div className="pagination"><span>Hiển thị {Math.min((page - 1) * pageSize + 1, totalItems)}-{Math.min(page * pageSize, totalItems)} / {totalItems}</span><div><button disabled={page === 1} onClick={() => onPageChange(page - 1)}>←</button><strong>{page}</strong><span>/ {totalPages}</span><button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>→</button></div></div>;
}
