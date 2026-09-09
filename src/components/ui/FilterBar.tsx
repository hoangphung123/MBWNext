import { ReactNode } from "react";
type FilterBarProps = { searchValue: string; onSearchChange: (value: string) => void; placeholder?: string; children?: ReactNode };
export function FilterBar({ searchValue, onSearchChange, placeholder = "Tìm kiếm...", children }: FilterBarProps) { return <div className="filter-bar"><label className="filter-search"><span>⌕</span><input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={placeholder} /></label><div className="filter-actions">{children}</div></div>; }
