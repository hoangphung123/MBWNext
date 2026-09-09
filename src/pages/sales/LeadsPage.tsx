import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { DataTable, Column } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { Lead, mockApi } from "../../lib/mockApi";
import { LeadFormModal } from "./CrmFormModals";

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]); const [search, setSearch] = useState(""); const [status, setStatus] = useState("all"); const [source, setSource] = useState("all"); const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<Lead | null>(null); const [deleting, setDeleting] = useState<Lead | null>(null); const [converting, setConverting] = useState<Lead | null>(null); const { showToast } = useToast();
  const load = useCallback(() => { mockApi.sales.getLeads().then(setLeads); }, []);
  useEffect(() => { load(); }, [load]);
  const sources = useMemo(() => [...new Set(leads.map((lead) => lead.source))], [leads]);
  const rows = useMemo(() => leads.filter((lead) => `${lead.code} ${lead.fullName} ${lead.companyName}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || lead.status === status) && (source === "all" || lead.source === source)), [leads, search, source, status]);
  const openNew = () => { setEditing(null); setFormOpen(true); };
  const handleDelete = async () => { if (!deleting) return; const result = await mockApi.sales.deleteLead(deleting.id); if (!result.entity) showToast(result.errors.form ?? "Không thể xóa lead.", "error"); else { showToast(`Đã xóa ${deleting.code}.`); load(); } setDeleting(null); };
  const handleConvert = async () => { if (!converting) return; const result = await mockApi.sales.convertLead(converting.id); const message = (result.errors as Record<string, string>).form; if (message) showToast(message, "error"); else { showToast(`Đã tạo khách hàng ${result.customer?.code} và cơ hội ${result.opportunity?.code}.`); load(); } setConverting(null); };
  const columns: Column<Lead>[] = [
    { key: "lead", header: "Lead", render: (lead) => <div className="cell-main"><strong>{lead.fullName}</strong><span>{lead.code}</span></div> },
    { key: "company", header: "Công ty", render: (lead) => <div className="cell-main"><strong>{lead.companyName}</strong><span>{lead.email}</span></div> },
    { key: "source", header: "Nguồn", render: (lead) => lead.source },
    { key: "score", header: "Điểm", className: "text-right", render: (lead) => <span className="score-cell">{lead.score}</span> },
    { key: "status", header: "Trạng thái", render: (lead) => <StatusBadge status={lead.status} /> },
    { key: "action", header: "", className: "text-right", render: (lead) => <div className="table-actions"><button onClick={() => { setEditing(lead); setFormOpen(true); }}>Sửa</button>{!(["lost", "converted"] as string[]).includes(lead.status) && <button onClick={() => setConverting(lead)}>Chuyển đổi</button>}<button className="danger-action" onClick={() => setDeleting(lead)}>Xóa</button></div> },
  ];
  return <section className="sales-content"><div className="content-heading"><div><h2>Lead</h2><p>{leads.length} khách hàng tiềm năng đang được quản lý</p></div><button className="primary-button compact" onClick={openNew}>＋ Thêm lead</button></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm tên, mã lead hoặc công ty..."><select className="filter-select" aria-label="Nguồn lead" value={source} onChange={(event) => setSource(event.target.value)}><option value="all">Tất cả nguồn</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}</select><select className="filter-select" aria-label="Trạng thái lead" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="qualified">Đã đánh giá</option><option value="converted">Đã chuyển đổi</option><option value="lost">Không thành công</option></select></FilterBar><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Không tìm thấy lead" emptyDescription="Thử đổi điều kiện tìm kiếm hoặc tạo một lead mới." /></div><LeadFormModal isOpen={formOpen} lead={editing} onClose={() => setFormOpen(false)} onSaved={(lead) => { showToast(`${lead.code} đã được lưu.`); load(); }} /><ConfirmDialog isOpen={Boolean(converting)} title="Chuyển đổi lead" description={<>Chuyển <strong>{converting?.fullName}</strong> thành một khách hàng và một cơ hội bán hàng mới?</>} confirmLabel="Chuyển đổi" onClose={() => setConverting(null)} onConfirm={handleConvert} /><ConfirmDialog isOpen={Boolean(deleting)} title="Xóa lead" description={<>Bạn muốn xóa <strong>{deleting?.code}</strong>? Thao tác này không thể hoàn tác.</>} confirmLabel="Xóa lead" onClose={() => setDeleting(null)} onConfirm={handleDelete} /></section>;
}
