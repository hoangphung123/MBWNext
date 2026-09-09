import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { DataTable, Column } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { Customer, mockApi } from "../../lib/mockApi";
import { CustomerFormModal } from "./CrmFormModals";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<Customer | null>(null); const [deleting, setDeleting] = useState<Customer | null>(null); const { showToast } = useToast();
  const load = useCallback(() => { mockApi.sales.getCustomers().then(setCustomers); }, []);
  useEffect(() => { load(); }, [load]);
  const rows = useMemo(() => customers.filter((customer) => `${customer.code} ${customer.name} ${customer.taxCode}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || customer.status === status)), [customers, search, status]);
  const handleDelete = async () => { if (!deleting) return; const result = await mockApi.sales.deleteCustomer(deleting.id); if (!result.entity) showToast(result.errors.form ?? "Không thể xóa khách hàng.", "error"); else { showToast(`Đã xóa ${deleting.code}.`); load(); } setDeleting(null); };
  const columns: Column<Customer>[] = [
    { key: "customer", header: "Khách hàng", render: (customer) => <div className="cell-main"><Link className="customer-detail-link" to={`/sales/customers/${customer.id}`}>{customer.name}</Link><span>{customer.code} · MST {customer.taxCode}</span></div> },
    { key: "contact", header: "Liên hệ", render: (customer) => <div className="cell-main"><strong>{customer.phone}</strong><span>{customer.email}</span></div> },
    { key: "credit", header: "Công nợ / hạn mức", className: "text-right", render: (customer) => <div className="cell-main text-right"><strong>{formatVnd(customer.outstandingBalance)}</strong><span>/ {formatVnd(customer.creditLimit)}</span></div> },
    { key: "term", header: "Hạn TT", className: "text-right", render: (customer) => `${customer.paymentTermDays} ngày` },
    { key: "status", header: "Trạng thái", render: (customer) => <StatusBadge status={customer.status} /> },
    { key: "action", header: "", className: "text-right", render: (customer) => <div className="table-actions"><Link className="table-link-action" to={`/sales/customers/${customer.id}`}>360°</Link><button onClick={() => { setEditing(customer); setFormOpen(true); }}>Sửa</button><button className="danger-action" onClick={() => setDeleting(customer)}>Xóa</button></div> },
  ];
  return <section className="sales-content"><div className="content-heading"><div><h2>Khách hàng</h2><p>Thông tin liên hệ, hạn mức công nợ và lịch sử giao dịch.</p></div><button className="primary-button compact" onClick={() => { setEditing(null); setFormOpen(true); }}>＋ Thêm khách hàng</button></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm tên, mã khách hàng hoặc mã số thuế..."><select className="filter-select" aria-label="Trạng thái khách hàng" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="inactive">Ngừng hoạt động</option></select></FilterBar><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Không tìm thấy khách hàng" emptyDescription="Thử đổi điều kiện tìm kiếm." /></div><CustomerFormModal isOpen={formOpen} customer={editing} onClose={() => setFormOpen(false)} onSaved={(customer) => { showToast(`${customer.code} đã được lưu.`); load(); }} /><ConfirmDialog isOpen={Boolean(deleting)} title="Xóa khách hàng" description={<>Bạn muốn xóa <strong>{deleting?.name}</strong>? Khách hàng đã phát sinh giao dịch sẽ được bảo vệ khỏi thao tác này.</>} confirmLabel="Xóa khách hàng" onClose={() => setDeleting(null)} onConfirm={handleDelete} /></section>;
}
