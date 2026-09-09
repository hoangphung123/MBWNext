import { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

export type Column<T> = { key: string; header: string; className?: string; render: (row: T) => ReactNode };
type DataTableProps<T extends { id: string }> = { columns: Column<T>[]; rows: T[]; emptyTitle?: string; emptyDescription?: string };

export function DataTable<T extends { id: string }>({ columns, rows, emptyTitle = "Chưa có dữ liệu", emptyDescription = "Dữ liệu sẽ xuất hiện khi có giao dịch phù hợp." }: DataTableProps<T>) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((column) => <th className={column.className} key={column.key}>{column.header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td className={column.className} key={column.key}>{column.render(row)}</td>)}</tr>)}</tbody></table></div>;
}
