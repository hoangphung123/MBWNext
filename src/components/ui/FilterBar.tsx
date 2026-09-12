import { ReactNode } from "react";
import { Icon } from "./Icon";
type FilterBarProps = { searchValue: string; onSearchChange: (value: string) => void; placeholder?: string; children?: ReactNode };
export function FilterBar({ searchValue, onSearchChange, placeholder = "Tìm kiếm...", children }: FilterBarProps) { return <div className="filter-bar"><label className="filter-search"><Icon name="search" size={17} /><input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={placeholder} /></label><div className="filter-actions">{children}</div></div>; }
